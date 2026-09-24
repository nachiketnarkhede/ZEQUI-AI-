/**
 * ZEQUI AI Router - Netlify Serverless Function
 *
 * Multi-provider AI routing with intelligent fallback:
 * Tries: Gemini → Groq → HuggingFace (8s timeout each)
 * Auto-fallback on: 429 (rate limit), 500 (server error), timeout
 * Returns: { text, provider, cached }
 *
 * ENVIRONMENT VARIABLES (set in Netlify):
 * - GEMINI_API_KEY
 * - GROQ_API_KEY
 * - HUGGINGFACE_API_KEY (optional)
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

async function callGemini(messages, signal) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "PASTE_GEMINI_KEY_HERE") {
    throw new Error("Gemini API key not configured");
  }

  const contents = messages
    .filter(m => m.role !== "system")
    .map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: typeof m.content === "string" ? m.content : JSON.stringify(m.content) }],
    }));

  const systemMessage = messages.find(m => m.role === "system");
  const body = {
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    },
  };

  if (systemMessage) {
    body.systemInstruction = {
      parts: [{ text: systemMessage.content }],
    };
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal,
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const status = response.status;
    if (status === 429 || status === 500) {
      throw new Error(`Gemini error ${status}`);
    }
    throw new Error(`Gemini error: ${status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

async function callGroq(messages, signal) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === "PASTE_GROQ_KEY_HERE") {
    throw new Error("Groq API key not configured");
  }

  const formattedMessages = messages.map(m => ({
    role: m.role,
    content: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
  }));

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    signal,
    body: JSON.stringify({
      model: "llama-3.1-70b-versatile",
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const status = response.status;
    if (status === 429 || status === 500) {
      throw new Error(`Groq error ${status}`);
    }
    throw new Error(`Groq error: ${status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

async function callHuggingFace(messages, signal) {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey || apiKey === "PASTE_HUGGINGFACE_KEY_HERE") {
    throw new Error("HuggingFace API key not configured");
  }

  const formattedMessages = messages
    .map(m => {
      const content = typeof m.content === "string" ? m.content : JSON.stringify(m.content);
      return m.role === "user" ? `User: ${content}` : m.role === "assistant" ? `Assistant: ${content}` : content;
    })
    .join("\n");

  const prompt = `<s>[INST] ${formattedMessages} [/INST]`;

  const response = await fetch(
    "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal,
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 1024,
          temperature: 0.7,
          return_full_text: false,
        },
      }),
    }
  );

  if (!response.ok) {
    const status = response.status;
    if (status === 429 || status === 500) {
      throw new Error(`HuggingFace error ${status}`);
    }
    throw new Error(`HuggingFace error: ${status}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data[0]?.generated_text || "" : data.generated_text || "";
}

async function withTimeout(task, ms = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await task(controller.signal);
  } catch (error) {
    if (error?.name === "AbortError") throw new Error("Provider timeout");
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

exports.handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { messages } = JSON.parse(event.body || "{}");
    if (!messages || !Array.isArray(messages) || messages.length === 0 || messages.length > 40) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Missing or invalid messages array" }),
      };
    }

    const normalizedMessages = messages.map((message) => ({
      role: message?.role,
      content: typeof message?.content === "string" ? message.content.slice(0, 12000) : message?.content,
    }));

    if (normalizedMessages.some((message) => !["system", "user", "assistant"].includes(message.role))) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "Invalid message role" }) };
    }

    // Try providers in order: Gemini → Groq → HuggingFace.
    const providers = [
      { name: "gemini", call: (signal) => callGemini(normalizedMessages, signal) },
      { name: "groq", call: (signal) => callGroq(normalizedMessages, signal) },
      { name: "huggingface", call: (signal) => callHuggingFace(normalizedMessages, signal) },
    ];

    let lastError = null;

    for (const provider of providers) {
      try {
        const text = await withTimeout(provider.call, 8000);
        return {
          statusCode: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            provider: provider.name,
            cached: false,
          }),
        };
      } catch (error) {
        lastError = error;
        console.warn(`Provider ${provider.name} failed:`, error.message);
        // Continue to next provider
      }
    }

    // All providers failed
    throw lastError || new Error("All AI providers failed");
  } catch (error) {
    return {
      statusCode: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({
        error: error.message || "Internal server error",
      }),
    };
  }
};
