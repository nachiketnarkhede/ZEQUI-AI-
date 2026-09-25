import { useState, useEffect } from "react";
import { Zap, Crown, BarChart3 } from "lucide-react";
import { STRIPE_PRO_LINK } from "../config/api";

interface Props {
  addToast: (message: string, type: "success" | "error" | "info") => void;
}

function isProUser(): boolean {
  return localStorage.getItem("zequi_isPro") === "true";
}

function getUsageStats() {
  const used = parseInt(localStorage.getItem("zequi_usage_today") || "0");
  return { used, limit: 30, remaining: Math.max(0, 30 - used) };
}

export default function UsageStats({ addToast }: Props) {
  const [stats, setStats] = useState({ used: 0, limit: 30, remaining: 30 });
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    // Check if coming from Stripe with pro=true
    const params = new URLSearchParams(window.location.search);
    if (params.get("pro") === "true") {
      localStorage.setItem("zequi_isPro", "true");
      window.history.replaceState({}, "", window.location.pathname);
      addToast("Welcome to ZEQUI Pro!", "success");
    }

    setIsPro(isProUser());
    setStats(getUsageStats());
  }, [addToast]);

  // Refresh stats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(getUsageStats());
      setIsPro(isProUser());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (isPro) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-violet-500/20 border border-amber-500/30">
        <Crown size={14} className="text-amber-400" />
        <span className="text-xs font-medium text-amber-400">Pro</span>
        <Zap size={12} className="text-violet-400" />
      </div>
    );
  }

  const percentage = Math.round((stats.used / stats.limit) * 100);
  const isLow = percentage >= 80;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-panel">
        <BarChart3 size={14} className={isLow ? "text-amber-400" : "text-cyan-400"} />
        <span className="text-xs text-slate-400">
          {stats.used}/{stats.limit}
        </span>
        <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              isLow
                ? "bg-gradient-to-r from-amber-500 to-red-500"
                : "bg-gradient-to-r from-cyan-500 to-violet-500"
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      {isLow && (
        <a
          href={STRIPE_PRO_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-violet-500/20 border border-amber-500/30 hover:scale-105 transition-all text-xs"
        >
          <Crown size={14} className="text-amber-400" />
          <span className="text-amber-400">Upgrade to Pro</span>
        </a>
      )}
    </div>
  );
}
