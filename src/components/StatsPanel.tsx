export default function StatsPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-white">Study Stats</h2>
        <button onClick={onClose} className="text-white/50 hover:text-white">✕</button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
          <p className="text-3xl font-bold text-cyan-400">12</p>
          <p className="text-xs text-white/50">Day Streak</p>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
          <p className="text-3xl font-bold text-purple-400">48h</p>
          <p className="text-xs text-white/50">Focus Time</p>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
          <p className="text-3xl font-bold text-emerald-400">24</p>
          <p className="text-xs text-white/50">Summaries</p>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
          <p className="text-3xl font-bold text-amber-400">8</p>
          <p className="text-xs text-white/50">Topics</p>
        </div>
      </div>
    </div>
  );
}