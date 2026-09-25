import { LogIn, LogOut, Moon, Sun } from "lucide-react";
import { personas, type PersonaId } from "../utils/personas";
import type { Tab } from "../App";
import type { UserProfile } from "./ProfileSystem";
import type { User } from "@supabase/supabase-js";
import AppLogo from "./AppLogo";
import UsageStats from "./UsageStats";
import NeoScholar from "./avatars/NeoScholar";
import SakuraFocus from "./avatars/SakuraFocus";
import VoltLogic from "./avatars/VoltLogic";
import AstraThinker from "./avatars/AstraThinker";
import GuardianAI from "./avatars/GuardianAI";
import CanvasCreator from "./avatars/CanvasCreator";
import ChronoPlanner from "./avatars/ChronoPlanner";
import ZenMindful from "./avatars/ZenMindful";

const AVATAR_COMPONENTS: Record<string, typeof NeoScholar> = {
  neo: NeoScholar,
  sakura: SakuraFocus,
  volt: VoltLogic,
  astra: AstraThinker,
  guardian: GuardianAI,
  canvas: CanvasCreator,
  chrono: ChronoPlanner,
  zen: ZenMindful,
};

interface TopBarProps {
  theme: "dark" | "light";
  toggleTheme: () => void;
  tab: Tab;
  onExport: () => void;
  personaId: PersonaId;
  setPersonaId: (id: PersonaId) => void;
  showPersonaSelector: boolean;
  addToast: (message: string, type: "success" | "error" | "info") => void;
  profile: UserProfile;
  onProfileClick: () => void;
  user: User | null;
  onAuthClick: () => void;
  onSignOut: () => void;
}

export default function TopBar({
  theme,
  toggleTheme,
  personaId,
  setPersonaId,
  showPersonaSelector,
  addToast,
  profile,
  onProfileClick,
  user,
  onAuthClick,
  onSignOut,
}: TopBarProps) {
  const AvatarComponent = AVATAR_COMPONENTS[profile.avatarId] || NeoScholar;

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 backdrop-blur-xl theme-bg-header theme-border-header">
      <div className="max-w-full mx-auto px-4 py-3 flex items-center justify-between">
        <AppLogo size={32} showTagline theme={theme} stackOnMobile />

        <div className="flex items-center gap-2">
          <UsageStats addToast={addToast} />

          {user ? (
            <button
              onClick={onSignOut}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg glass-panel text-xs text-slate-300 hover:text-white transition-colors"
              title="Sign out"
            >
              <span className="hidden sm:block max-w-28 truncate">{user.email}</span>
              <LogOut size={15} />
            </button>
          ) : (
            <button
              onClick={onAuthClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-panel text-xs text-cyan-300 hover:text-cyan-200 transition-colors"
              title="Sign in"
            >
              <LogIn size={15} />
              <span>Sign in</span>
            </button>
          )}

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg glass-panel text-slate-400 hover:text-yellow-400 transition-colors hover-glow"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {showPersonaSelector && (
            <select
              value={personaId}
              onChange={(e) => setPersonaId(e.target.value as PersonaId)}
              className="px-3 py-1.5 rounded-lg glass-panel text-sm theme-text appearance-none cursor-pointer pr-8"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center", backgroundSize: "14px" }}
            >
              {personas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.emoji} {p.name}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={onProfileClick}
            className="p-2 rounded-lg glass-panel hover:bg-white/10 transition-all group"
            title="Edit profile"
          >
            <div className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity">
              <AvatarComponent accentColor={profile.accentColor} />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
