import FocusPanel from './FocusPanel';
import StatsPanel from './StatsPanel';

export default function ToolDock({ activeTool, setActiveTool }: { activeTool: 'focus' | 'stats' | null, setActiveTool: (t: 'focus' | 'stats' | null) => void }) {
  return (
    <>
      {/* Vertical Icon Rail - Right Side */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-40">
        <button 
          onClick={() => setActiveTool(activeTool === 'focus' ? null : 'focus')} 
          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-xl transition-all ${activeTool === 'focus' ? 'bg-cyan-500 text-white scale-110' : 'bg-[#12161F]/90 text-white/70 border border-white/10 hover:bg-white/10 backdrop-blur-md'}`}
          title="Focus Timer"
        >
          ⏱️
        </button>
        <button 
          onClick={() => setActiveTool(activeTool === 'stats' ? null : 'stats')} 
          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-xl transition-all ${activeTool === 'stats' ? 'bg-cyan-500 text-white scale-110' : 'bg-[#12161F]/90 text-white/70 border border-white/10 hover:bg-white/10 backdrop-blur-md'}`}
          title="Study Stats"
        >
          📊
        </button>
      </div>

      {/* Expanded Panel Overlay */}
      {activeTool && (
        <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto" onClick={() => setActiveTool(null)} />
          
          {/* Panel Content */}
          <div className="relative w-full max-w-sm h-full bg-[#0B0F19] border-l border-white/10 pointer-events-auto animate-in slide-in-from-right overflow-y-auto">
            {activeTool === 'focus' ? (
              <FocusPanel onClose={() => setActiveTool(null)} />
            ) : (
              <StatsPanel onClose={() => setActiveTool(null)} />
            )}
          </div>
        </div>
      )}
    </>
  );
}