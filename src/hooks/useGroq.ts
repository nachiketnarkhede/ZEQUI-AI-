import { useState, useCallback } from "react";

const AI_ROUTER_ENDPOINT = "/.netlify/functions/ai-router";
const MAX_REQUESTS_PER_HOUR = 50;
const STORAGE_KEY = "zequi_rate_limit";

interface RateLimitData { count: number; resetTime: number; }

function getRateLimitData(): RateLimitData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored) as RateLimitData;
      if (Date.now() > data.resetTime) return { count: 0, resetTime: Date.now() + 3600000 };
      return data;
    }
  } catch { /* use defaults */ }
  return { count: 0, resetTime: Date.now() + 3600000 };
}

function setRateLimitData(data: RateLimitData): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* storage may be unavailable */ }
}

function checkRateLimit(): { allowed: boolean; remaining: number; resetIn: number } {
  const data = getRateLimitData();
  const remaining = Math.max(0, MAX_REQUESTS_PER_HOUR - data.count);
  const resetIn = Math.max(0, Math.ceil((data.resetTime - Date.now()) / 60000));
  return data.count >= MAX_REQUESTS_PER_HOUR
    ? { allowed: false, remaining: 0, resetIn }
    : { allowed: true, remaining: Math.max(0, remaining - 1), resetIn };
}

function incrementRateLimit(): void {
  const data = getRateLimitData();
  setRateLimitData({ ...data, count: data.count + 1 });
}

export interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>;
}

export interface UseGroqResult {
  loading: boolean;
  error: string | null;
  rateLimited: boolean;
  rateLimitReset: number;
  call: (messages: GroqMessage[], signal?: AbortSignal) => Promise<string>;
  resetError: () => void;
  provider: string | null;
  stats: { requests: number; successes: number; failures: number; fallbacks: number; averageLatency: number };
}

export function useGroq(): UseGroqResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const [rateLimitReset, setRateLimitReset] = useState(0);
  const [provider, setProvider] = useState<string | null>(null);
  const [stats, setStats] = useState({ requests: 0, successes: 0, failures: 0, fallbacks: 0, averageLatency: 0 });

  const call = useCallback(async (messages: GroqMessage[], signal?: AbortSignal): Promise<string> => {
    const rateCheck = checkRateLimit();
    if (!rateCheck.allowed) {
      setRateLimited(true);
      setRateLimitReset(rateCheck.resetIn);
      throw new Error(`Rate limit reached. Please try again in ${rateCheck.resetIn} minute${rateCheck.resetIn !== 1 ? "s" : ""}.`);
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error("Please provide a message before sending.");
    }

    setRateLimited(false);
    setLoading(true);
    const startedAt = performance.now();
    setStats((current) => ({ ...current, requests: current.requests + 1 }));
    setError(null);

    try {
      const res = await fetch(AI_ROUTER_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
        signal,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "AI service is unavailable. Please try again.");

      const text = typeof data.text === "string" ? data.text.trim() : "";
      if (!text) throw new Error("The AI service returned an empty response.");
      const latency = Math.round(performance.now() - startedAt);
      const responseProvider = typeof data.provider === "string" ? data.provider : null;
      setProvider(responseProvider);
      setStats((current) => {
        const completed = current.successes;
        return {
          ...current,
          successes: current.successes + 1,
          fallbacks: current.fallbacks + (responseProvider && responseProvider !== "gemini" ? 1 : 0),
          averageLatency: Math.round(((current.averageLatency * completed) + latency) / Math.max(1, completed + 1)),
        };
      });

      incrementRateLimit();
      return text;
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") throw err;
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
      setStats((current) => ({ ...current, failures: current.failures + 1 }));
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const resetError = useCallback(() => {
    setError(null);
    setRateLimited(false);
  }, []);

  return { loading, error, rateLimited, rateLimitReset, call, resetError, provider, stats };
}
