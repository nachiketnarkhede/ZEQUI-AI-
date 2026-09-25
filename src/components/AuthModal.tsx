import { useState, type FormEvent } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, X } from "lucide-react";
import { supabase } from "../lib/supabase";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  addToast: (message: string, type: "success" | "error" | "info") => void;
}

export default function AuthModal({ isOpen, onClose, addToast }: Props) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) {
      addToast("Sign-in is not configured yet. Add the Supabase environment variables first.", "error");
      return;
    }

    const cleanEmail = email.trim();
    if (!cleanEmail || password.length < 6) {
      addToast("Enter a valid email and a password of at least 6 characters.", "error");
      return;
    }

    setLoading(true);
    try {
      const result = mode === "signin"
        ? await supabase.auth.signInWithPassword({ email: cleanEmail, password })
        : await supabase.auth.signUp({ email: cleanEmail, password });

      if (result.error) throw result.error;

      if (mode === "signup" && !result.data.session) {
        addToast("Account created. Check your email to confirm the account.", "success");
      } else {
        addToast("Signed in to ZEQUI.", "success");
      }
      onClose();
    } catch (error) {
      addToast(error instanceof Error ? error.message : "Authentication failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="glass-panel w-full max-w-md rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-cyan-400">ZEQUI Account</p>
            <h2 className="text-2xl font-bold text-white mt-1">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-slate-400" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {!supabase && (
          <div className="mb-4 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-200">
            Authentication is currently disabled until Supabase is configured in Netlify and the Vite environment.
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="text-sm text-slate-300">Email</span>
            <div className="mt-1 relative">
              <Mail size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400/50"
              />
            </div>
          </label>

          <label className="block">
            <span className="text-sm text-slate-300">Password</span>
            <div className="mt-1 relative">
              <LockKeyhole size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                placeholder="At least 6 characters"
                className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-10 py-2.5 text-sm text-white outline-none focus:border-cyan-400/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-slate-200"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </label>

          <button
            type="submit"
            disabled={loading || !supabase}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-500/25 to-violet-500/25 border border-cyan-400/30 py-2.5 text-cyan-300 font-semibold disabled:opacity-50"
          >
            {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-slate-500">
          {mode === "signin" ? "New to ZEQUI?" : "Already have an account?"}{" "}
          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="text-cyan-400 hover:text-cyan-300"
          >
            {mode === "signin" ? "Create account" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
