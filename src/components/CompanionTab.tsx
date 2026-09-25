import { useState, useCallback, useEffect, useRef } from "react";
import { Send, User, Volume2, Pause, Play, Square } from "lucide-react";
import { type GroqMessage } from "../hooks/useGroq";
import { useTextToSpeech } from "../hooks/useTextToSpeech";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { sanitizeText } from "../utils/fileProcessor";
import ZEQUILogo from "./ZEQUILogo";

const COMPANION_SYSTEM_PROMPT =
  "You are ZEQUI (pronounced 'Zeh-key'), a friendly, witty AI companion. You tell jokes, explain complex topics simply with emojis, give casual life advice, and keep conversations engaging. Always respond in a warm, conversational tone. Never sound academic or robotic. Use emojis occasionally but not excessively. Sometimes refer to yourself as ZEQUI.";

const QUICK_REPLIES = [
  "Tell me a joke",
  "Explain something cool",
  "I'm bored",
  "Motivate me",
];

interface SavedMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface Props {
  onCall: (messages: GroqMessage[], signal?: AbortSignal) => Promise<string>;
  loading: boolean;
  error: string | null;
  addToast: (message: string, type: "success" | "error" | "info") => void;
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 fade-in">
      <div className="flex-shrink-0">
        <ZEQUILogo size={40} animated />
      </div>
      <div className="glass-panel px-4 py-3 max-w-xs rounded-2xl">
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

export default function CompanionTab({ onCall, loading, error, addToast }: Props) {
  const [messages, setMessages] = useLocalStorage<SavedMessage[]>("zequi_companion_history", []);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const tts = useTextToSpeech();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const playWelcome = useCallback(() => {
    tts.play("welcome", "Hey there! I'm ZEQUI, your AI companion. What's on your mind today?");
  }, [tts]);

  const send = useCallback(
    async (text?: string) => {
      const messageText = (text || input).trim();
      if (!messageText || loading) return;

      setInput("");
      const userMsg: SavedMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: messageText,
      };
      const updated = [...messages, userMsg];
      setMessages(updated);

      const apiMessages: GroqMessage[] = [
        { role: "system", content: COMPANION_SYSTEM_PROMPT },
        ...updated.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      ];

      try {
        const reply = await onCall(apiMessages);
        setMessages([
          ...updated,
          {
            id: `ai-${Date.now()}`,
            role: "assistant",
            content: reply,
          },
        ]);
      } catch {
        // Error handled by hook
      }
    },
    [input, loading, messages, onCall, setMessages]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    addToast("Chat cleared", "info");
    tts.stop();
  }, [setMessages, addToast, tts]);

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-4 border-b border-white/5">
        <div className="flex flex-col items-center gap-2">
          <ZEQUILogo size={56} animated />
          <div className="text-center">
            <h2 className="font-bold text-lg theme-text">ZEQUI</h2>
            <p className="text-xs text-slate-500">Your AI Companion</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-4 fade-in">
            <div className="glass-panel p-4 rounded-xl max-w-xs">
              <p className="text-sm theme-text mb-3">
                Hey there! I'm ZEQUI, your AI companion. What's on your mind today?
              </p>
              <button
                onClick={playWelcome}
                className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Play intro
              </button>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {QUICK_REPLIES.map((reply) => (
                <button
                  key={reply}
                  onClick={() => send(reply)}
                  className="px-3 py-1.5 rounded-full glass-panel text-xs text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                >
                  {reply}
                </button>
              ))}
            </div>
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
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === "user"
                  ? "bg-violet-500/20 border border-violet-500/30"
                  : ""
              }`}
            >
              {msg.role === "user" ? (
                <User size={18} className="text-violet-400" />
              ) : (
                <ZEQUILogo size={40} animated={false} />
              )}
            </div>
            <div
              className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "glass-panel-violet rounded-2xl rounded-br-md"
                  : "glass-panel rounded-2xl rounded-bl-md"
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

      <div className="p-4 border-t border-white/5 theme-input-border">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Chat with ZEQUI..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm theme-text placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all theme-input"
            disabled={loading}
          />
          <button
            onClick={() => send()}
            disabled={loading || !input.trim()}
            className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-500/30 text-cyan-400 hover:from-cyan-500/30 hover:to-violet-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover-glow"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
