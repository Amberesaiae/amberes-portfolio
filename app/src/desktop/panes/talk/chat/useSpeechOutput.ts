import { useCallback, useEffect, useRef, useState } from 'react';

function getSynthesis(): SpeechSynthesis | null {
  if (typeof window === 'undefined') return null;
  const synth = window.speechSynthesis;
  return synth && typeof synth.speak === 'function' ? synth : null;
}

/**
 * The assistant's voice, using the browser's own speech engine.
 *
 * Same deal as dictation: free, no server, no key — and the toggle lives next
 * to the mic so the two directions read as one feature. Off by default;
 * turning it on speaks each new assistant reply once, and turning it off (or
 * leaving) stops mid-word. Unsupported browsers simply never see the button.
 */
export function useSpeechOutput() {
  const [supported, setSupported] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const enabledRef = useRef(false);
  enabledRef.current = enabled;

  useEffect(() => {
    setSupported(getSynthesis() !== null);
    return () => getSynthesis()?.cancel();
  }, []);

  const stop = useCallback(() => {
    getSynthesis()?.cancel();
    setSpeaking(false);
  }, []);

  const speak = useCallback(
    (text: string) => {
      const synth = getSynthesis();
      if (!synth || !enabledRef.current || !text.trim()) return;
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = navigator.language || 'en-GB';
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      setSpeaking(true);
      synth.speak(utterance);
    },
    [],
  );

  const toggle = useCallback(() => {
    if (enabledRef.current) {
      getSynthesis()?.cancel();
      setSpeaking(false);
      setEnabled(false);
    } else {
      setEnabled(true);
    }
  }, []);

  return { supported, enabled, speaking, speak, stop, toggle };
}
