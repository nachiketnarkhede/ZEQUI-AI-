import { useCallback, useEffect, useState } from "react";
import { BarChart3, Cloud, Crown, LogIn, Zap } from "lucide-react";
import { supabase } from "../lib/supabase";
import { STRIPE_PRO_LINK } from "../config/api";

interface Props {
  addToast: (message: string, type: "success" | "error" | "info") => void;
}

interface UsageSnapshot {
  plan: string;
  daily_used: number;
  daily_limit: number;
  window_used: number;
  window_limit: number;
  remaining: number;
}

const FALLBACK_USAGE: UsageSnapshot = {
  plan: "guest",
  daily_used: 0,
  daily_limit: 0,
  window_used: 0,
  window_limit: 0,
  remaining: 0,
};

export default function UsageStats({ addToast }: Props) {
  const [usage, setUsage] = useState<UsageSnapshot>(FALLBACK_USAGE);
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!supabase) {
      setSignedIn(false);
      setLoading(false);
      return;
    }

    const { data } = await supabase.auth.getSession();
    const session = data.session;
    setSignedIn(Boolean(session));

    if (!session) {
      setUsage(FALLBACK_USAGE);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/.netlify/functions/ai-router", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const payload = await response.json().catch(() => ({}));
      if (response.ok && payload.usage) {
        setUsage(payload.usage);
      }
    } catch {
      // The AI router remains the source of truth; a temporary stats failure
      // should never interrupt the rest of the application.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const interval = window.setInterval(() => void refresh(), 30_000);
    const { data } = supabase?.auth.onAuthStateChange(() => void refresh()) ?? { data: { subscription: null } };

    return () => {
      window.clearInterval(interval);
      data.subscription?.unsubscribe();
    };
  }, [refresh]);

  if (!signedIn) {
    return (
      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg glass-panel text-xs text-slate-400">
        <LogIn size={14} className="text-cyan-400" />
        <span>Sign in for persistent usage</span>
      </div>
    );
  }

  const isPro = usage.plan === "pro";
  const percentage = usage.daily_limit > 0 ? Math.round((usage.daily_used / usage.daily_limit) * 100) : 0;
  const isLow = percentage >= 80;

  return (
    <div className="flex items-center gap-2 sm:gap-3" title={loading ? "Refreshing usage…" : `${usage.daily_used} of ${usage.daily_limit} daily AI requests used`}>
      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg glass-panel">
        <BarChart3 size={14} className={isLow ? "text-amber-400" : "text-cyan-400"} />
        <span className="text-xs text-slate-400">
          {usage.daily_used}/{usage.daily_limit}
        </span>
        <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden" aria-label="Daily AI usage">
          <div
            className={`h-full rounded-full transition-all ${isLow ? "bg-gradient-to-r from-amber-500 to-red-500" : "bg-gradient-to-r from-cyan-500 to-violet-500"}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <Cloud size={12} className="text-emerald-400" aria-label="Cloud synced" />
      </div>

      {isPro ? (
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-violet-500/20 border border-amber-500/30">
          <Crown size={14} className="text-amber-400" />
          <span className="text-xs font-medium text-amber-400">Pro</span>
          <Zap size={12} className="text-violet-400" />
        </div>
      ) : isLow ? (
        <a
          href={STRIPE_PRO_LINK}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => addToast("Opening ZEQUI Pro", "info")}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-violet-500/20 border border-amber-500/30 hover:scale-105 transition-all text-xs"
        >
          <Crown size={14} className="text-amber-400" />
          <span className="text-amber-400">Upgrade</span>
        </a>
      ) : null}
    </div>
  );
}
