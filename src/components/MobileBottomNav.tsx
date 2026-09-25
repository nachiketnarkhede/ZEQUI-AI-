export default function MobileBottomNav({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  const tabs = [
    { id: 'chat', icon: '💬', label: 'Chat' },
    { id: 'summarize', icon: '📄', label: 'Notes' },
    { id: 'research', icon: '🔍', label: 'Search' },
    { id: 'advice', icon: '💡', label: 'Tips' },
    { id: 'companion', icon: '🤖', label: 'AI' },
    { id: 'growth', icon: '📈', label: 'Growth' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0B0F19]/95 backdrop-blur-xl border-t border-white/10 px-4 py-2 z-50 safe-area-bottom">
      <div className="flex items-center justify-around max-w-xl mx-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === tab.id ? 'text-cyan-400 scale-110' : 'text-white/50 hover:text-white/80'}`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}