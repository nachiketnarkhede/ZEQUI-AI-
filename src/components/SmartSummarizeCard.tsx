import { useState } from 'react';
import { processFile, validateFile } from '../utils/fileProcessor';

export default function SmartSummarizeCard({ addToast }: { addToast?: (msg: string, type?: string) => void }) {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<'quick' | 'deep'>('quick');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    const validation = validateFile(selected);
    if (!validation.valid) {
      setError(validation.error || 'Unsupported file.');
      addToast?.(validation.error || 'Unsupported file.', 'error');
      return;
    }
    setFile(selected); setText(''); setError(''); setResult(''); setLoading(true);
    try {
      const processed = await processFile(selected);
      if (processed.type !== 'text') {
        throw new Error('Image summarization is available through the dedicated image workflow; upload a TXT or PDF here.');
      }
      setText(processed.content);
      addToast?.('File loaded', 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not read file.';
      setError(message);
      addToast?.(message, 'error');
      setFile(null);
    } finally { setLoading(false); }
  };

  const runAI = async () => {
    if (!text.trim()) { setError('Add content first.'); addToast?.('Please add content', 'error'); return; }
    setLoading(true); setError(''); setResult('');
    try {
      const res = await fetch('/.netlify/functions/ai-router', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'system', content: mode === 'deep' ? "Provide: 1) Summary, 2) Study advice, 3) Explanations." : "Summarize in exam-focused bullet points." }, { role: 'user', content: text }] })
      });
      if (!res.ok) throw new Error('AI failed.');
      const data = await res.json();
      setResult(data.text);
      addToast?.('Summary ready!', 'success');
    } catch (err: any) { setError(err.message); addToast?.(err.message, 'error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="w-full max-w-4xl mx-auto bg-[#12161F]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 md:p-8 shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
            <button onClick={() => setMode('quick')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${mode === 'quick' ? 'bg-cyan-500 text-white shadow-lg' : 'text-white/50 hover:text-white'}`}>📄 Quick</button>
            <button onClick={() => setMode('deep')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${mode === 'deep' ? 'bg-purple-500 text-white shadow-lg' : 'text-white/50 hover:text-white'}`}>🧠 Deep + Advice</button>
          </div>
        </div>
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Paste notes here..." className="w-full h-32 md:h-40 bg-black/30 border border-white/10 rounded-xl p-4 text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-white/30 mb-4" />
        <label className="flex items-center justify-center py-4 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-cyan-500/50 hover:bg-cyan-950/10 transition group mb-4">
          <div className="text-center">
            <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">📎</div>
            <span className="text-sm text-white/60 group-hover:text-cyan-300">{file ? file.name : 'Upload .txt / .pdf'}</span>
          </div>
          <input type="file" accept=".txt,.pdf" onChange={handleFile} className="hidden" />
        </label>
        <button onClick={runAI} disabled={loading || !text.trim()} className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-sm font-semibold hover:from-cyan-400 hover:to-blue-500 transition disabled:opacity-40 shadow-lg shadow-cyan-500/25">
          {loading ? '✨ Generating...' : '✨ Generate Summary'}
        </button>
        {error && <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-300 text-center text-sm">{error}</div>}
        {result && (
          <div className="mt-6 bg-black/40 rounded-2xl border border-white/10 p-5 max-h-[50vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/5">
              <h3 className="text-sm font-semibold text-cyan-400 uppercase">{mode === 'deep' ? ' Deep Analysis' : '📄 Quick Summary'}</h3>
              <button onClick={() => { setResult(''); setText(''); setFile(null); }} className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-white/70">Clear</button>
            </div>
            <p className="text-sm text-white/85 whitespace-pre-wrap leading-relaxed">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}