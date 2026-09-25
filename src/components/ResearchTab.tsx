import { useState, useCallback } from "react";
import { Search, Loader2, BookOpen, Lightbulb, ExternalLink } from "lucide-react";
import { type GroqMessage } from "../hooks/useGroq";
import { sanitizeText } from "../utils/fileProcessor";
import ZEQUILogo from "./ZEQUILogo";

interface ResearchResult {
  answer: string;
  facts: string[];
  sources: string[];
}

function parseResult(raw: string): ResearchResult {
  const lines = raw.split("\n").filter((l) => l.trim());
  const answer = lines[0] || "";
  const facts: string[] = [];
  const sources: string[] = [];

  let inFacts = false;
  let inSources = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^#{1,3}\s*(fact|key\s*fact)/i.test(trimmed)) {
      inFacts = true;
      inSources = false;
      continue;
    }
    if (/^#{1,3}\s*(source|suggested\s*source|where)/i.test(trimmed)) {
      inSources = true;
      inFacts = false;
      continue;
    }
    if (inFacts && /^[-*•]\s/.test(trimmed)) {
      facts.push(trimmed.replace(/^[-*•]\s*/, ""));
    }
    if (inSources && /^[-*•]\s/.test(trimmed)) {
      sources.push(trimmed.replace(/^[-*•]\s*/, ""));
    }
  }

  if (facts.length === 0) {
    const bulletLines = lines.filter((l) => /^[-*•]\s/.test(l.trim()));
    bulletLines.slice(0, 3).forEach((l) => facts.push(l.trim().replace(/^[-*•]\s*/, "")));
  }

  if (sources.length === 0) {
    sources.push(
      "Wikipedia - search for your topic",
      "Google Scholar - academic papers",
      "Khan Academy - educational videos"
    );
  }

  return { answer: sanitizeText(answer), facts: facts.slice(0, 3).map(sanitizeText), sources };
}

interface Props {
  onCall: (messages: GroqMessage[], signal?: AbortSignal) => Promise<string>;
  loading: boolean;
  error: string | null;
}

export default function ResearchTab({ onCall, loading, error }: Props) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<ResearchResult | null>(null);

  const research = useCallback(async () => {
    if (!query.trim() || loading) return;
    setResult(null);

    const messages: GroqMessage[] = [
      {
        role: "system",
        content:
          'You are a research assistant. Given a question, provide:\n1. A short, direct answer (1-2 sentences)\n2. 3 key facts (as bullet points, under a "## Key Facts" heading)\n3. 3 suggested sources to learn more (as bullet points, under a "## Suggested Sources" heading)\n\nBe accurate and concise.',
      },
      { role: "user", content: query },
    ];

    try {
      const reply = await onCall(messages);
      setResult(parseResult(reply));
    } catch {
      // Error handled by hook
    }
  }, [query, loading, onCall]);

  return (
    <div className="flex flex-col h-full gap-4 p-4">
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && research()}
          placeholder="Ask ZEQUI a research question..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm theme-text placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all theme-input"
          disabled={loading}
        />
        <button
          onClick={research}
          disabled={loading || !query.trim()}
          className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-500/30 text-cyan-400 hover:from-cyan-500/30 hover:to-violet-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover-glow"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
        </button>
      </div>

      {!result && !error && !loading && (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-3 fade-in">
          <ZEQUILogo size={56} animated />
          <p className="text-sm">Ask ZEQUI to research any topic</p>
        </div>
      )}

      {result && (
        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="glass-panel p-4 rounded-lg">
            <p className="text-sm leading-relaxed">{result.answer}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={16} className="text-yellow-400" />
              <h3 className="text-sm font-semibold text-slate-200">Key Facts</h3>
            </div>
            <div className="space-y-2">
              {result.facts.map((fact, i) => (
                <div
                  key={i}
                  className="glass-panel p-3 rounded-lg text-xs leading-relaxed"
                >
                  {fact}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={16} className="text-blue-400" />
              <h3 className="text-sm font-semibold text-slate-200">Suggested Sources</h3>
            </div>
            <div className="space-y-2">
              {result.sources.map((source, i) => (
                <a
                  key={i}
                  href={`https://www.google.com/search?q=${encodeURIComponent(source)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-panel p-3 rounded-lg text-xs flex items-center justify-between hover:bg-white/10 transition-all group"
                >
                  <span>{source}</span>
                  <ExternalLink size={12} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
