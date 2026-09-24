import { useState, useRef, useCallback, useEffect } from "react";
import { Send, Trash2, User, Volume2, Pause, Play, Square, Brain } from "lucide-react";
import { type GroqMessage } from "../hooks/useGroq";
import { useTextToSpeech } from "../hooks/useTextToSpeech";
import { getPersona, sanitizeText, type PersonaId } from "../utils/personas";
import { useLocalStorage } from "../hooks/useLocalStorage";
import VoiceInput from "./VoiceInput";
import ZEQUILogo from "./ZEQUILogo";
import { getASCIILogo } from "./AppLogo";
import QuizMode from "./QuizMode";
import ExportChat from "./ExportChat";
import { trackTopic } from "./TopicTracker";
import CalmChatBackground from "./CalmChatBackground";

interface SavedMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface Props {
  personaId: PersonaId;
  onCall: (messages: GroqMessage[], signal?: AbortSignal) => Promise<string>;
  loading: boolean;
  error: string | null;
  addToast: (message: string, type: "success" | "error" | "info") => void;
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 fade-in">
      <div className="flex-shrink-0">
        <ZEQUILogo size={32} animated />
      </div>
      <div className="glass-panel px-4 py-3 max-w-xs">
        <p className="text-xs text-slate-400 mb-1">ZEQUI is thinking...</p>
        <div className="flex gap-1.5">
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce-dot" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce-dot" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce-dot" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

function SpeechButton({
  id,
  text,
  tts,
}: {
  id: string;
  text: string;
  tts: ReturnType<typeof useTextToSpeech>;
}) {
  if (!tts.supported) return null;

  const isPlaying = tts.speakingId === id && tts.speaking;

  return (
    <div className="flex items-center gap-1 mt-2 fade-in">
      {isPlaying ? (
        <>
          <button
            onClick={() => tts.pause()}
            className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs hover-glow"
          >
            <Pause size={12} />
          </button>
          <button
            onClick={() => tts.resume()}
            className="p-1.5 rounded-lg bg-green-500/20 text-green-400 text-xs hover-glow"
          >
            <Play size={12} />
          </button>
          <button
            onClick={() => tts.stop()}
            className="p-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs hover-glow"
          >
            <Square size={12} />
          </button>
        </>
      ) : (
        <button
          onClick={() => tts.play(id, text)}
          className="p-1.5 rounded-lg bg-violet-500/20 border border-violet-500/30 text-violet-300 hover:bg-violet-500/30 transition-all hover-glow text-xs flex items-center gap-1"
        >
          <Volume2 size={12} />
          <span>Read</span>
        </button>
      )}
    </div>
  );
}

export default function ChatTab({
  personaId,
  onCall,
  loading,
  error,
  addToast,
}: Props) {
  const [messages, setMessages] = useLocalStorage<SavedMessage[]>("zequi_chat_history", []);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const tts = useTextToSpeech();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    const timestamp = Date.now();
    const userMsg: SavedMessage = {
      id: `user-${timestamp}`,
      role: "user",
      content: text,
      timestamp,
    };
    const updated = [...messages, userMsg];
    setMessages(updated);

    trackTopic(text);

    const persona = getPersona(personaId);
    const apiMessages: GroqMessage[] = [
      { role: "system", content: persona.systemPrompt },
      ...updated.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    ];

    abortRef.current = new AbortController();

    try {
      const reply = await onCall(apiMessages, abortRef.current.signal);
      setMessages([
        ...updated,
        {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: reply,
          timestamp: Date.now(),
        },
      ]);
    } catch {
      // Error already handled by hook
    }
  }, [input, loading, messages, onCall, personaId, setMessages]);

  const clearChat = useCallback(() => {
    setMessages([]);
    addToast("Chat cleared", "info");
    tts.stop();
  }, [setMessages, addToast, tts]);

  const handleVoice = useCallback(
    (transcript: string) => {
      setInput((prev) => (prev ? prev + " " + transcript : transcript));
    },
    []
  );

  const exportChat = useCallback(() => {
    const header = getASCIILogo() + "\n";
    const formatted = messages
      .map((m) => {
        const time = new Date(m.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const role = m.role === "user" ? "You" : "ZEQUI";
        return `[${time}] ${role}: ${m.content}`;
      })
      .join("\n\n");

    const blob = new Blob([header + formatted], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `zequi-chat-${timestamp}.txt`;
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast("Chat exported successfully!", "success");
  }, [messages, addToast]);

  useEffect(() => {
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
      tts.stop();
    };
  }, [tts]);

  const [showQuiz, setShowQuiz] = useState(false);
  const [lastContent, setLastContent] = useState("");

  useEffect(() => {
    if (messages.length > 0) {
      const last = messages[messages.length - 1];
      if (last.role === "assistant") {
        setLastContent(last.content);
      }
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full relative">
      <CalmChatBackground />
      <div className="px-4 py-2 border-b border-white/5 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <>
              <ExportChat
                messages={messages.map((m) => ({
                  role: m.role,
                  content: m.content,
                  timestamp: m.timestamp,
                }))}
                tab="chat"
                persona={getPersona(personaId).name}
                addToast={addToast}
              />
              <button
                onClick={() => setShowQuiz(!showQuiz)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-panel text-xs text-slate-400 hover:text-cyan-400 transition-colors hover-glow"
              >
                <Brain size={14} />
                {showQuiz ? "Hide Quiz" : "Generate Quiz"}
              </button>
            </>
          )}
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-panel text-xs text-red-400 hover:text-red-300 transition-colors hover-glow"
          >
            <Trash2 size={14} />
            Clear
          </button>
        )}
      </div>

      {showQuiz && lastContent && (
        <div className="px-4 py-4 border-b border-white/5 relative z-10">
          <QuizMode content={lastContent} addToast={addToast} />
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 relative z-10">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3 fade-in">
            <ZEQUILogo size={64} animated />
            <p className="text-sm">Start a conversation with ZEQUI</p>
            <p className="text-xs text-slate-500">Your AI companion for studying and growth</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={msg.id || i}
            className={`flex items-start gap-3 fade-in ${
              msg.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === "user"
                  ? "bg-violet-500/20 border border-violet-500/30"
                  : ""
              }`}
            >
              {msg.role === "user" ? (
                <User size={16} className="text-violet-400" />
              ) : (
                <ZEQUILogo size={32} animated={false} />
              )}
            </div>
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap backdrop-blur-sm ${
                msg.role === "user"
                  ? "glass-panel-violet rounded-br-md"
                  : "glass-panel rounded-bl-md"
              }`}
            >
              {sanitizeText(msg.content)}
              {msg.role === "assistant" && (
                <SpeechButton id={msg.id} text={msg.content} tts={tts} />
              )}
            </div>
          </div>
        ))}

        {loading && <TypingIndicator />}

        {error && (
          <div className="text-center text-red-400 text-xs fade-in glass-panel px-4 py-2 mx-auto">
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-white/5 theme-input-border relative z-10 backdrop-blur-sm">
        <div className="flex gap-2">
          <VoiceInput onTranscript={handleVoice} disabled={loading} />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Ask ZEQUI anything..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm theme-text placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all theme-input"
            disabled={loading}
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover-glow"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
