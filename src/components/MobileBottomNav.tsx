import { MessageSquare, FileText, Search, Lightbulb, Bot, Network } from "lucide-react";

export default function MobileBottomNav({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  const tabs = [
    { id: "chat", icon: MessageSquare, label: "Chat" },
    { id: "summarize", icon: FileText, label: "Notes" },
    { id: "research", icon: Search, label: "Search" },
    { id: "advice", icon: Lightbulb, label: "Tips" },
    { id: "companion", icon: Bot, label: "AI" },
    { id: "growth", icon: Network, label: "Growth" },
  ];

  return (
    <nav className="mobile-bottom-nav fixed bottom-0 left-0 right-0 bg-[#0B0F19]/95 backdrop-blur-xl border-t border-white/10 px-2 py-1.5 z-50 safe-area-bottom" aria-label="Mobile navigation">
      <div className="flex items-center justify-around max-w-xl mx-auto gap-1">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            aria-current={activeTab === id ? "page" : undefined}
            className={`min-w-0 flex-1 flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all ${activeTab === id ? "text-cyan-400 bg-cyan-400/10" : "text-white/50 hover:text-white/80"}`}
          >
            <Icon size={19} strokeWidth={activeTab === id ? 2.5 : 2} />
            <span className="text-[9px] font-medium truncate max-w-full">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
