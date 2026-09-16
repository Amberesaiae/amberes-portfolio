import { useCallback, useEffect, useRef, useState } from 'react';

interface SpeechRecognitionEvent extends Event {
  results: { isFinal: boolean; 0: { transcript: string } }[] & { length: number };
}

interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}

type Ctor = new () => SpeechRecognitionLike;

function getConstructor(): Ctor | null {
  const w = window as unknown as { SpeechRecognition?: Ctor; webkitSpeechRecognition?: Ctor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/**
 * Dictation, using the browser's own recogniser.
 *
 * Free, no server, no key — and absent in Firefox, which is why `supported` is
 * part of the contract and the composer always keeps a text field. Interim
 * results are surfaced so the words appear while they are still being spoken;
 * only final ones are committed.
 */
export function useSpeechInput(onFinal: (text: string) => void) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState('');
  const recognition = useRef<SpeechRecognitionLike | null>(null);
  const finalRef = useRef(onFinal);
  finalRef.current = onFinal;

  useEffect(() => {
    setSupported(getConstructor() !== null);
    return () => recognition.current?.stop();
  }, []);

  const stop = useCallback(() => {
    recognition.current?.stop();
    recognition.current = null;
    setListening(false);
    setInterim('');
  }, []);

  const start = useCallback(() => {
    const Ctor = getConstructor();
    if (!Ctor) return;

    const rec = new Ctor();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = navigator.language || 'en-GB';

    rec.onresult = (e) => {
      let live = '';
      for (let i = 0; i < e.results.length; i += 1) {
        const result = e.results[i];
        if (result.isFinal) finalRef.current(result[0].transcript.trim());
        else live += result[0].transcript;
      }
      setInterim(live);
    };
    rec.onerror = () => stop();
    rec.onend = () => {
      setListening(false);
      setInterim('');
      recognition.current = null;
    };

    recognition.current = rec;
    setListening(true);
    rec.start();
  }, [stop]);

  const toggle = useCallback(() => (listening ? stop() : start()), [listening, start, stop]);

  return { supported, listening, interim, toggle, stop };
}
