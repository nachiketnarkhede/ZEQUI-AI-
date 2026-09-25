import { useState, useCallback } from "react";
import { supabase } from "../lib/supabase";

const AI_ROUTER_ENDPOINT = "/.netlify/functions/ai-router";

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
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error("Please provide a message before sending.");
    }

    setRateLimited(false);
    setLoading(true);
    const startedAt = performance.now();
    setStats((current) => ({ ...current, requests: current.requests + 1 }));
    setError(null);

    try {
      const { data: sessionData } = supabase
        ? await supabase.auth.getSession()
        : { data: { session: null } };
      const accessToken = sessionData.session?.access_token;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

      const res = await fetch(AI_ROUTER_ENDPOINT, {
        method: "POST",
        headers,
        body: JSON.stringify({ messages }),
        signal,
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 429 || data.usageGuard) {
        const retryAfter = Number(data.retryAfter || res.headers.get("Retry-After") || 60);
        const minutes = Math.max(1, Math.ceil(retryAfter / 60));
        setRateLimited(true);
        setRateLimitReset(minutes);
        const message = `ZEQUI is protecting shared AI capacity. Please try again in about ${minutes} minute${minutes !== 1 ? "s" : ""}.`;
        setError(message);
        throw new Error(message);
      }

      if (!res.ok) throw new Error(data.error || "AI service is temporarily unavailable. Please try again.");

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
