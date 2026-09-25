import crypto from "node:crypto";

/**
 * ZEQUI AI Router + Usage Guard
 *
 * Providers: Gemini -> Groq -> Hugging Face
 * Guard: anonymous device/IP burst + daily protection, plus a global circuit breaker.
 *
 * IMPORTANT: This is a serverless burst/abuse guard, not a billing/authentication system.
 * For large authenticated deployments, replace the in-memory counters with a shared
 * database/Netlify Blobs-backed counter before promising strict per-user quotas.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Cache-Control": "no-store",
};

const GUARD = {
  windowMs: Number(process.env.ZEQUI_RATE_WINDOW_MS) || 10 * 60 * 1000,
  windowLimit: Number(process.env.ZEQUI_RATE_WINDOW_LIMIT) || 20,
  dailyMs: 24 * 60 * 60 * 1000,
  dailyLimit: Number(process.env.ZEQUI_RATE_DAILY_LIMIT) || 100,
  globalWindowMs: 10 * 60 * 1000,
  globalWindowLimit: Number(process.env.ZEQUI_GLOBAL_WINDOW_LIMIT) || 250,
  maxBodyBytes: Number(process.env.ZEQUI_MAX_BODY_BYTES) || 90000,
};

const buckets = new Map();
const globalBuckets = [];
const CIRCUIT = new Map();
const PROVIDER_COOLDOWN_MS = 60 * 1000;
const MAX_BUCKETS = 5000;

function json(statusCode, payload, extraHeaders = {}) {
  return {
    statusCode,
    headers: { ...corsHeaders, "Content-Type": "application/json", ...extraHeaders },
    body: JSON.stringify(payload),
  };
}

function hash(value) {
  return crypto.createHash("sha256").update(value).digest("hex").slice(0, 32);
}

function getCookie(event, name) {
  const raw = event.headers?.cookie || event.headers?.Cookie || "";
  const match = raw.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

function getClientIdentity(event, authenticatedUserId = null) {
  if (authenticatedUserId) return hash(`user:${authenticatedUserId}`);
  const cookieId = getCookie(event, "zequi_device");
  const ip = event.ip || event.headers?.["x-nf-client-connection-ip"] || "unknown";
  const userAgent = event.headers?.["user-agent"] || "unknown";
  const seed = cookieId || hash(`${ip}|${userAgent}`);
  return hash(seed);
}

async function getAuthenticatedUserId(event) {
  const authorization = event.headers?.authorization || event.headers?.Authorization || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  if (!match || !supabaseUrl || !supabaseAnonKey) return null;

  try {
    const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/auth/v1/user`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${match[1]}`,
      },
    });
    if (!response.ok) return null;
    const user = await response.json();
    return typeof user?.id === "string" ? user.id : null;
  } catch {
    return null;
  }
}

function pruneBuckets(now) {
  for (const [key, bucket] of buckets) {
    if (now - bucket.createdAt > GUARD.dailyMs) buckets.delete(key);
  }
  while (globalBuckets.length && now - globalBuckets[0] > GUARD.globalWindowMs) globalBuckets.shift();
  if (buckets.size > MAX_BUCKETS) {
    const oldest = [...buckets.entries()]
      .sort((a, b) => a[1].createdAt - b[1].createdAt)
      .slice(0, Math.floor(MAX_BUCKETS * 0.2));
    for (const [key] of oldest) buckets.delete(key);
  }
}

function checkGlobalBurst() {
  const now = Date.now();
  pruneBuckets(now);
  if (globalBuckets.length >= GUARD.globalWindowLimit) {
    const retryAfter = Math.max(1, Math.ceil((globalBuckets[0] + GUARD.globalWindowMs - now) / 1000));
    return { allowed: false, retryAfter };
  }
  globalBuckets.push(now);
  return { allowed: true, retryAfter: 1 };
}

function checkAnonymousUsage(identity) {
  const now = Date.now();
  pruneBuckets(now);
  const bucket = buckets.get(identity) || {
    createdAt: now,
    windowStartedAt: now,
    windowCount: 0,
    dailyStartedAt: now,
    dailyCount: 0,
  };
  if (now - bucket.windowStartedAt >= GUARD.windowMs) {
    bucket.windowStartedAt = now;
    bucket.windowCount = 0;
  }
  if (now - bucket.dailyStartedAt >= GUARD.dailyMs) {
    bucket.dailyStartedAt = now;
    bucket.dailyCount = 0;
  }
  const windowRemaining = Math.max(0, GUARD.windowLimit - bucket.windowCount);
  const dailyRemaining = Math.max(0, GUARD.dailyLimit - bucket.dailyCount);
  const resetMs = Math.min(
    bucket.windowStartedAt + GUARD.windowMs,
    bucket.dailyStartedAt + GUARD.dailyMs,
  ) - now;
  if (windowRemaining <= 0 || dailyRemaining <= 0) {
    buckets.set(identity, bucket);
    return {
      allowed: false,
      remaining: Math.min(windowRemaining, dailyRemaining),
      retryAfter: Math.max(1, Math.ceil(resetMs / 1000)),
      persistent: false,
    };
  }
  bucket.windowCount += 1;
  bucket.dailyCount += 1;
  buckets.set(identity, bucket);
  return {
    allowed: true,
    remaining: Math.max(0, Math.min(windowRemaining, dailyRemaining) - 1),
    retryAfter: Math.max(1, Math.ceil(resetMs / 1000)),
    persistent: false,
  };
}

async function supabaseRpc(functionName, payload) {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;
  const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/rpc/${functionName}`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`Supabase RPC ${functionName} failed (${response.status})${details ? `: ${details.slice(0, 160)}` : ""}`);
  }
  return response.json();
}

async function consumePersistentUsage(userId, requestId) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  return supabaseRpc("consume_ai_usage", {
    p_user_id: userId,
    p_request_id: requestId,
    p_window_limit: GUARD.windowLimit,
    p_daily_limit: GUARD.dailyLimit,
  });
}

async function getPersistentUsage(userId) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  return supabaseRpc("get_ai_usage", {
    p_user_id: userId,
    p_window_limit: GUARD.windowLimit,
    p_daily_limit: GUARD.dailyLimit,
  });
}

async function finalizePersistentUsage(requestId, provider) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return;
  await supabaseRpc("finalize_ai_usage", { p_request_id: requestId, p_provider: provider });
}

function markProviderFailure(name, error) {
  if (error?.status === 429 || /\b429\b/.test(error?.message || "") || /rate limit/i.test(error?.message || "")) {
    CIRCUIT.set(name, Date.now() + PROVIDER_COOLDOWN_MS);
  }
}

function providerAvailable(name) {
  const until = CIRCUIT.get(name) || 0;
  if (until && until > Date.now()) return false;
  if (until) CIRCUIT.delete(name);
  return true;
}

function providerError(name, status, message = "Provider error") {
  const error = new Error(`${name} error ${status}: ${message}`);
  error.status = status;
  return error;
}

async function callGemini(messages, signal) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "PASTE_GEMINI_KEY_HERE") throw new Error("Gemini API key not configured");

  const contents = messages.filter((m) => m.role !== "system").map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: typeof m.content === "string" ? m.content : JSON.stringify(m.content) }],
  }));
  const systemMessage = messages.find((m) => m.role === "system");
  const body = { contents, generationConfig: { temperature: 0.7, maxOutputTokens: 2048 } };
  if (systemMessage) body.systemInstruction = { parts: [{ text: String(systemMessage.content).slice(0, 12000) }] };

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal,
    body: JSON.stringify(body),
  });
  if (!response.ok) throw providerError("Gemini", response.status, await response.text().catch(() => ""));
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

async function callGroq(messages, signal) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === "PASTE_GROQ_KEY_HERE") throw new Error("Groq API key not configured");

  const formattedMessages = messages.map((m) => ({
    role: m.role,
    content: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
  }));
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    signal,
    body: JSON.stringify({ model: "llama-3.1-70b-versatile", messages: formattedMessages, temperature: 0.7, max_tokens: 2048 }),
  });
  if (!response.ok) throw providerError("Groq", response.status, await response.text().catch(() => ""));
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

async function callHuggingFace(messages, signal) {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey || apiKey === "PASTE_HUGGINGFACE_KEY_HERE") throw new Error("HuggingFace API key not configured");

  const formattedMessages = messages.map((m) => {
    const content = typeof m.content === "string" ? m.content : JSON.stringify(m.content);
    return m.role === "user" ? `User: ${content}` : m.role === "assistant" ? `Assistant: ${content}` : content;
  }).join("\n");
  const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    signal,
    body: JSON.stringify({ inputs: `<s>[INST] ${formattedMessages} [/INST]`, parameters: { max_new_tokens: 1024, temperature: 0.7, return_full_text: false } }),
  });
  if (!response.ok) throw providerError("HuggingFace", response.status, await response.text().catch(() => ""));
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

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers: corsHeaders, body: "" };
  if (event.httpMethod === "GET") {
    const authenticatedUserId = await getAuthenticatedUserId(event);
    if (!authenticatedUserId) return json(401, { error: "Sign in to view account usage." });
    try {
      const usage = await getPersistentUsage(authenticatedUserId);
      if (!usage) return json(503, { error: "Persistent account usage is not configured yet." });
      return json(200, { usage });
    } catch (error) {
      console.error("Usage lookup failed:", error?.message || error);
      return json(503, { error: "Account usage is temporarily unavailable." });
    }
  }
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

  const rawBody = event.body || "";
  if (Buffer.byteLength(rawBody, "utf8") > GUARD.maxBodyBytes) return json(413, { error: "Request is too large." });

  let body;
  try {
    body = JSON.parse(rawBody || "{}");
  } catch {
    return json(400, { error: "Invalid JSON request." });
  }
  const { messages } = body;
  if (!messages || !Array.isArray(messages) || messages.length === 0 || messages.length > 40) {
    return json(400, { error: "Missing or invalid messages array" });
  }

  const normalizedMessages = messages.map((message) => ({
    role: message?.role,
    content: typeof message?.content === "string" ? message.content.slice(0, 12000) : message?.content,
  }));
  if (normalizedMessages.some((message) => !["system", "user", "assistant"].includes(message.role))) {
    return json(400, { error: "Invalid message role" });
  }

  const authenticatedUserId = await getAuthenticatedUserId(event);
  const requestId = crypto.randomUUID();
  const burst = checkGlobalBurst();
  if (!burst.allowed) {
    return json(429, {
      error: "ZEQUI is protecting shared AI capacity. Please try again shortly.",
      retryAfter: burst.retryAfter,
      usageGuard: true,
    }, { "Retry-After": String(burst.retryAfter) });
  }

  let usage;

  try {
    if (authenticatedUserId && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      usage = await consumePersistentUsage(authenticatedUserId, requestId);
    } else {
      const identity = getClientIdentity(event);
      usage = checkAnonymousUsage(identity);
    }
  } catch (error) {
    console.error("Usage persistence failed:", error?.message || error);
    return json(503, {
      error: "ZEQUI account services are temporarily unavailable. Please try again shortly.",
      retryAfter: 30,
    }, { "Retry-After": "30" });
  }

  const remaining = Number(usage?.remaining ?? 0);
  const guardHeaders = {
    "X-ZEQUI-Usage-Remaining": String(remaining),
    "X-ZEQUI-Usage-Mode": authenticatedUserId && process.env.SUPABASE_SERVICE_ROLE_KEY ? "persistent" : "anonymous",
  };

  const newDevice = !getCookie(event, "zequi_device");
  const deviceCookie = newDevice ? `zequi_device=${encodeURIComponent(crypto.randomUUID())}; Path=/; Max-Age=31536000; SameSite=Lax; Secure` : null;
  if (deviceCookie) guardHeaders["Set-Cookie"] = deviceCookie;

  if (!usage?.allowed) {
    return json(429, {
      error: "Your ZEQUI usage limit has been reached. Please try again after the reset window.",
      retryAfter: usage?.retry_after || 60,
      usageGuard: true,
      usage,
    }, { ...guardHeaders, "Retry-After": String(usage?.retry_after || 60) });
  }


  const providers = [
    { name: "gemini", call: (signal) => callGemini(normalizedMessages, signal) },
    { name: "groq", call: (signal) => callGroq(normalizedMessages, signal) },
    { name: "huggingface", call: (signal) => callHuggingFace(normalizedMessages, signal) },
  ].filter((provider) => providerAvailable(provider.name));

  for (const provider of providers) {
    try {
      const text = await withTimeout(provider.call, 8000);
      if (!text.trim()) throw new Error("Provider returned an empty response");
      if (authenticatedUserId && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        try {
          await finalizePersistentUsage(requestId, provider.name);
        } catch (error) {
          console.error("Usage finalization failed:", error?.message || error);
        }
      }
      return {
        statusCode: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json", ...guardHeaders },
        body: JSON.stringify({
          text,
          provider: provider.name,
          cached: false,
          usageRemaining: remaining,
          usage,
          requestId,
        }),
      };
    } catch (error) {
      markProviderFailure(provider.name, error);
      console.warn(`Provider ${provider.name} failed:`, error?.message || error);
    }
  }

  return json(503, {
    error: "ZEQUI's AI providers are temporarily unavailable. Please try again shortly.",
    retryAfter: 30,
    usageGuard: false,
    usage,
    requestId,
  }, { ...guardHeaders, "Retry-After": "30" });
};
