import { useState, useCallback, useEffect } from "react";

interface UseTextToSpeechResult {
  speaking: boolean;
  speakingId: string | null;
  play: (id: string, text: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  supported: boolean;
}

let globalSpeechInstance: SpeechSynthesisUtterance | null = null;

export function useTextToSpeech(): UseTextToSpeechResult {
  const [speaking, setSpeaking] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    return () => {
      if (speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const play = useCallback((id: string, text: string) => {
    if (!supported) return;

    window.speechSynthesis.cancel();
    globalSpeechInstance = new SpeechSynthesisUtterance(text);
    globalSpeechInstance.rate = 0.9;
    globalSpeechInstance.pitch = 1;

    globalSpeechInstance.onend = () => {
      setSpeaking(false);
      setSpeakingId(null);
      globalSpeechInstance = null;
    };

    globalSpeechInstance.onerror = () => {
      setSpeaking(false);
      setSpeakingId(null);
      globalSpeechInstance = null;
    };

    setSpeaking(true);
    setSpeakingId(id);
    window.speechSynthesis.speak(globalSpeechInstance);
  }, [supported]);

  const pause = useCallback(() => {
    window.speechSynthesis.pause();
  }, []);

  const resume = useCallback(() => {
    window.speechSynthesis.resume();
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setSpeakingId(null);
    globalSpeechInstance = null;
  }, []);

  return { speaking, speakingId, play, pause, resume, stop, supported };
}
