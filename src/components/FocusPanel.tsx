import { useState, useEffect } from 'react';

export default function FocusPanel({ onClose }: { onClose: () => void }) {
  const [time, setTime] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  
  useEffect(() => { 
    let i: any; 
    if (running && time > 0) {
      i = setInterval(() => setTime(t => t - 1), 1000);
    } else if (time === 0) {
      setRunning(false);
    }
    return () => clearInterval(i); 
  }, [running, time]);
  
  const fmt = (s: number) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;
  
  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-white">Focus Timer</h2>
        <button onClick={onClose} className="text-white/50 hover:text-white">✕</button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-7xl font-bold text-white tabular-nums mb-8">{fmt(time)}</div>
        <div className="flex gap-4">
          <button 
            onClick={() => setRunning(!running)} 
            className={`px-8 py-3 rounded-xl font-bold ${running ? 'bg-red-500/20 text-red-300' : 'bg-cyan-500 text-white'}`}
          >
            {running ? 'Pause' : 'Start'}
          </button>
          <button 
            onClick={() => { setRunning(false); setTime(1500); }} 
            className="px-6 py-3 rounded-xl bg-white/5 text-white/60"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}