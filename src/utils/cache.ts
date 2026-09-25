import { CACHE_EXPIRY_DAYS, CACHE_MAX_ENTRIES } from "../config/api";

const CACHE_KEY = "zequi_response_cache";

export interface CacheEntry {
  response: string;
  timestamp: number;
  provider: string;
}

export type CacheStore = Record<string, CacheEntry>;

/**
 * Generate a deterministic cache key from messages
 */
export function generateCacheKey(messages: Array<{ role: string; content: string | object }>): string {
  const normalized = messages.map(m => ({
    role: m.role,
    content: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
  }));
  return JSON.stringify(normalized);
}

/**
 * Get the entire cache from localStorage
 */
function getCache(): CacheStore {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : {};
  } catch {
    return {};
  }
}

/**
 * Save cache to localStorage
 */
function saveCache(cache: CacheStore): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    console.warn("Failed to save cache to localStorage");
  }
}

/**
 * Check if a cached response exists and is still valid
 * Returns response text if found and not expired, null otherwise
 */
export function getCachedResponse(messages: Array<{ role: string; content: string | object }>): string | null {
  const cache = getCache();
  const key = generateCacheKey(messages);
  const entry = cache[key];

  if (!entry) return null;

  // Check expiry
  const expiryMs = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
  const isExpired = Date.now() - entry.timestamp > expiryMs;

  if (isExpired) {
    delete cache[key];
    saveCache(cache);
    return null;
  }

  return entry.response;
}

/**
 * Store a response in cache with auto-cleanup if over limit
 */
export function setCachedResponse(
  messages: Array<{ role: string; content: string | object }>,
  response: string,
  provider: string
): void {
  const cache = getCache();
  const key = generateCacheKey(messages);

  cache[key] = {
    response,
    timestamp: Date.now(),
    provider,
  };

  // Auto-cleanup: remove oldest entries if over limit
  const entries = Object.entries(cache);
  if (entries.length > CACHE_MAX_ENTRIES) {
    entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
    const newCache: CacheStore = {};
    entries.slice(0, CACHE_MAX_ENTRIES).forEach(([k, v]) => {
      newCache[k] = v;
    });
    saveCache(newCache);
  } else {
    saveCache(cache);
  }
}

/**
 * Clean expired entries from cache (optional maintenance)
 */
export function cleanExpiredCache(): void {
  const cache = getCache();
  const expiryMs = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
  const now = Date.now();
  let cleaned = 0;

  Object.keys(cache).forEach(key => {
    if (now - cache[key].timestamp > expiryMs) {
      delete cache[key];
      cleaned++;
    }
  });

  if (cleaned > 0) {
    saveCache(cache);
  }
}

/**
 * Clear all cached responses
 */
export function clearCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    console.warn("Failed to clear cache");
  }
}
