import { useState, useCallback, useEffect } from "react";

const ACCENT_KEY = "zequi_accent";
const DEFAULT_ACCENT = "#06b6d4";

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `${r}, ${g}, ${b}`;
  }
  return "6, 182, 212"; // Default cyan
}

export function useAccent() {
  const [accent, setAccentState] = useState<string>(() => {
    try {
      return localStorage.getItem(ACCENT_KEY) || DEFAULT_ACCENT;
    } catch {
      return DEFAULT_ACCENT;
    }
  });

  const setColor = useCallback((color: string) => {
    setAccentState(color);
    try {
      localStorage.setItem(ACCENT_KEY, color);
    } catch {
      console.warn("Failed to save accent color");
    }

    // Apply to CSS variables
    document.documentElement.style.setProperty("--accent", color);
    document.documentElement.style.setProperty("--accent-rgb", hexToRgb(color));
  }, []);

  // Initialize CSS variables on mount
  useEffect(() => {
    document.documentElement.style.setProperty("--accent", accent);
    document.documentElement.style.setProperty("--accent-rgb", hexToRgb(accent));
  }, [accent]);

  return { accent, setColor };
}
