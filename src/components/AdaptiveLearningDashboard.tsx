import { useEffect, useMemo, useState } from "react";
import { Activity, Brain, GitBranch, Lightbulb, RefreshCw, ShieldCheck, Target, TrendingUp } from "lucide-react";
import { getLearningSignals, getLearningSummary, getRecommendations, getTopicGraph, type LearningRecommendation } from "../utils/learningEngine";

interface Props {
  aiProvider?: string | null;
  aiStats?: { requests: number; successes: number; failures: number; fallbacks: number; averageLatency: number };
}

export default function AdaptiveLearningDashboard({ aiProvider, aiStats }: Props) {
  const [version, setVersion] = useState(0);
  const refresh = () => setVersion((value) => value + 1);
  const summary = useMemo(() => getLearningSummary(), [version]);
  const signals = useMemo(() => getLearningSignals(), [version]);
  const recommendations = useMemo(() => getRecommendations(4), [version]);
  const graph = useMemo(() => getTopicGraph(signals.topics), [signals.topics]);

  useEffect(() => {
    const onStorage = () => refresh();
    window.addEventListener("storage", onStorage);
    const timer = window.setInterval(refresh, 4000);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.clearInterval(timer);
    };
  }, []);

  const successRate = aiStats?.requests ? Math.round((aiStats.successes / aiStats.requests) * 100) : 0;
  const providerLabel = aiProvider ? aiProvider.toUpperCase() : "STANDBY";

  return (
    <div className="space-y-4 fade-in">
      <section className="glass-panel rounded-2xl p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 mb-1"><Brain size={18} /><span className="text-xs uppercase tracking-widest">Adaptive Learning Engine</span></div>
            <h1 className="text-2xl font-bold theme-text">ZEQUI Growth Intelligence</h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">ZEQUI turns local study signals and quiz outcomes into explainable, targeted next steps.</p>
          </div>
          <button onClick={refresh} className="glass-panel px-3 py-2 rounded-lg text-xs text-slate-300 flex items-center gap-2 hover:text-cyan-400"><RefreshCw size={14} /> Refresh</button>
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          ["Topics", summary.trackedTopics, Target],
          ["Quiz attempts", summary.quizAttempts, Brain],
          ["Accuracy", `${summary.averageAccuracy}%`, TrendingUp],
          ["Strong", summary.strongAttempts, ShieldCheck],
          ["Weak", summary.weakAttempts, Activity],
        ].map(([label, value, Icon]) => {
          const IconComponent = Icon as typeof Activity;
          return <div key={String(label)} className="glass-panel rounded-xl p-3"><IconComponent size={15} className="text-violet-400 mb-2" /><div className="text-lg font-bold theme-text">{value}</div><div className="text-xs text-slate-500">{label}</div></div>;
        })}
      </section>

      <section className="grid lg:grid-cols-2 gap-4">
        <div className="glass-panel rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-4"><Lightbulb size={17} className="text-amber-400" /><h2 className="font-semibold theme-text">Explainable recommendations</h2></div>
          {recommendations.length === 0 ? <p className="text-sm text-slate-500">Start a study conversation or complete a quiz. ZEQUI will build recommendations from your activity.</p> : <div className="space-y-3">{recommendations.map((item: LearningRecommendation) => <div key={item.topic} className="rounded-xl border border-white/10 p-3 bg-white/[0.02]"><div className="flex justify-between gap-3"><span className="font-medium capitalize theme-text">{item.topic}</span><span className={`text-[10px] uppercase tracking-wide ${item.priority === "high" ? "text-rose-400" : item.priority === "medium" ? "text-amber-400" : "text-cyan-400"}`}>{item.priority}</span></div><p className="text-xs text-slate-400 mt-1">{item.reason}</p><p className="text-xs text-cyan-300 mt-2">→ {item.action}</p></div>)}</div>}
        </div>

        <div className="glass-panel rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-4"><GitBranch size={17} className="text-cyan-400" /><h2 className="font-semibold theme-text">Learning graph</h2></div>
          {graph.length === 0 ? <p className="text-sm text-slate-500">Your topic graph will appear as ZEQUI detects recurring subjects.</p> : <div className="space-y-2">{graph.map((node) => <div key={node.topic} className="flex items-center gap-2 text-xs"><span className="px-2 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 capitalize">{node.topic}</span>{node.links.length > 0 && <><span className="text-slate-600">↔</span><span className="text-slate-400 capitalize">{node.links.join(" · ")}</span></>}</div>)}</div>}
        </div>
      </section>

      <section className="glass-panel rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><Activity size={16} className="text-green-400" /><h2 className="font-semibold theme-text">AI system telemetry</h2></div><span className="text-xs text-slate-500">local session metrics</span></div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          <div><span className="text-slate-500 block">Provider</span><strong className="text-cyan-300">{providerLabel}</strong></div>
          <div><span className="text-slate-500 block">Requests</span><strong className="theme-text">{aiStats?.requests ?? 0}</strong></div>
          <div><span className="text-slate-500 block">Success</span><strong className="text-green-400">{successRate}%</strong></div>
          <div><span className="text-slate-500 block">Fallbacks</span><strong className="text-amber-400">{aiStats?.fallbacks ?? 0}</strong></div>
          <div><span className="text-slate-500 block">Avg latency</span><strong className="theme-text">{aiStats?.averageLatency ? `${aiStats.averageLatency}ms` : "—"}</strong></div>
        </div>
      </section>
    </div>
  );
}
