import MobileBottomNav from './components/MobileBottomNav';
import ToolDock from './components/ToolDock';
import SmartSummarizeCard from './components/SmartSummarizeCard';
import { useState, useCallback, useEffect } from "react";
import { MessageSquare, FileText, Search, Lightbulb, Bot, Network } from "lucide-react";
import ChatTab from "./components/ChatTab";
import ResearchTab from "./components/ResearchTab";
import AdviceTab from "./components/AdviceTab";
import CompanionTab from "./components/CompanionTab";
import TopBar from "./components/TopBar";
import Toast, { type ToastMessage } from "./components/Toast";
import TopicTracker from "./components/TopicTracker";
import ExamCountdown from "./components/ExamCountdown";
import ProfileSystem from "./components/ProfileSystem";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useProfile } from "./hooks/useProfile";
import { type PersonaId } from "./utils/personas";
import { useGroq } from "./hooks/useGroq";
import AdaptiveLearningDashboard from "./components/AdaptiveLearningDashboard";
import AuthModal from "./components/AuthModal";
import { useAuth } from "./hooks/useAuth";

export type Tab = "chat" | "summarize" | "research" | "advice" | "companion" | "growth";

const tabs: { id: Tab; label: string; icon: typeof MessageSquare }[] = [
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "summarize", label: "Summarize", icon: FileText },
  { id: "research", label: "Research", icon: Search },
  { id: "advice", label: "Advice", icon: Lightbulb },
  { id: "companion", label: "Companion", icon: Bot },
  { id: "growth", label: "Growth", icon: Network },
];

export default function App() {
  const [tab, setTab] = useState<Tab>("chat");
  const [theme, setTheme] = useLocalStorage<"dark" | "light">("zequi_theme", "dark");
  const [personaId, setPersonaId] = useLocalStorage<PersonaId>("zequi_persona", "buddy");
  const [showPronunciation, setShowPronunciation] = useLocalStorage("zequi_show_pronunciation", true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [activeTool, setActiveTool] = useState<'focus' | 'stats' | null>(null);

  const { profile, setProfile } = useProfile();
  const { user, signOut } = useAuth();
  const ai = useGroq();

  const addToast = useCallback((message: string, type: "success" | "error" | "info") => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev.slice(-3), { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    addToast(`Switched to ${newTheme} mode`, "info");
  }, [theme, setTheme, addToast]);

  useEffect(() => {
    if (showPronunciation) {
      const timer = setTimeout(() => setShowPronunciation(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showPronunciation, setShowPronunciation]);

  const showPersona = tab === "chat";

  return (
    <div className={`min-h-screen theme-bg text-slate-200 flex flex-col transition-colors duration-300 ${theme === "dark" ? "dark-theme" : "light-theme"}`}>
      <Toast toasts={toasts} removeToast={removeToast} />
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        addToast={addToast}
      />

      <ProfileSystem
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        profile={profile}
        onSave={setProfile}
      />

      {showPronunciation && (
        <div className="fixed top-32 left-1/2 -translate-x-1/2 z-40 fade-in">
          <div className="glass-panel px-4 py-2 rounded-xl text-xs text-slate-400 flex items-center gap-2">
            <span className="text-violet-400 text-base">気</span>
            <span>Pronounced: <strong className="text-cyan-400">Zeh-key</strong></span>
          </div>
        </div>
      )}

      <TopBar
        theme={theme}
        toggleTheme={toggleTheme}
        tab={tab}
        onExport={() => {}}
        personaId={personaId}
        setPersonaId={setPersonaId}
        showPersonaSelector={showPersona}
        addToast={addToast}
        profile={profile}
        onProfileClick={() => setShowProfileModal(true)}
        user={user}
        onAuthClick={() => setShowAuthModal(true)}
        onSignOut={async () => {
          const { error } = await signOut();
          addToast(error ? "Could not sign out." : "Signed out of ZEQUI.", error ? "error" : "info");
        }}
      />

      <nav className="border-b border-white/10 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 flex gap-1 overflow-x-auto scrollbar-none">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                tab === id
                  ? "border-cyan-400 text-cyan-400"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-1 w-full max-w-[1600px] mx-auto flex gap-4 px-2 sm:px-4 lg:px-6 py-3 sm:py-4 min-h-0 relative z-10">
        <aside className="hidden lg:flex flex-col w-64 space-y-4">
          <TopicTracker />
          <ExamCountdown addToast={addToast} />
        </aside>

        <div className="flex-1 min-w-0 max-w-5xl mx-auto w-full pb-20 lg:pb-0">
          {tab === "chat" && <ChatTab personaId={personaId} onCall={ai.call} loading={ai.loading} error={ai.error} addToast={addToast} />}
          {tab === "summarize" && <SmartSummarizeCard addToast={addToast} />}
          {tab === "research" && <ResearchTab onCall={ai.call} loading={ai.loading} error={ai.error} />}
          {tab === "advice" && <AdviceTab onCall={ai.call} loading={ai.loading} error={ai.error} addToast={addToast} />}
          {tab === "companion" && <CompanionTab onCall={ai.call} loading={ai.loading} error={ai.error} addToast={addToast} />}
          {tab === "growth" && <AdaptiveLearningDashboard aiProvider={ai.provider} aiStats={ai.stats} />}
        </div>
      </main>
      
      {/* Old panels safely disabled to prevent layout conflicts */}
      {/* <div className="hidden md:flex w-80 flex-shrink-0 border-l border-white/10 bg-[#0B0F19]"><SmartPanel /></div> */}
      {/* <div className="md:hidden border-t border-white/10 bg-[#0B0F19]"><MobileQuickActions /></div> */}

      {/* ✅ NEW: Vertical Tool Dock */}
      <ToolDock activeTool={activeTool} setActiveTool={setActiveTool} />

      {/* ✅ NEW: Mobile Bottom Navigation (Instagram-style) */}
      <MobileBottomNav activeTab={tab} setActiveTab={setTab} />

      <footer className="border-t border-white/5 py-3 text-center relative z-10">
        <p className="text-xs text-slate-500">
          <span className="opacity-60">© 2026</span> <span className="text-cyan-400">ZEQUI</span>
          <span className="text-violet-400">™</span>
        </p>
        {/* ✅ NEW: Contact Email Link */}
        <a href="mailto:zequi.app.ai@gmail.com" className="text-white/40 hover:text-cyan-400 text-xs mt-1 block">
          Contact: zequi.app.ai@gmail.com
        </a>
        <div className="flex justify-center gap-3 mt-1 text-[11px] text-white/30">
          <a href="/privacy.html" className="hover:text-cyan-400">Privacy</a>
          <span>•</span>
          <a href="/terms.html" className="hover:text-cyan-400">Terms</a>
        </div>
      </footer>
    </div>
  );
}