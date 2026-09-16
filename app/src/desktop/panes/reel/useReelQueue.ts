import { useCallback, useEffect, useRef, useState } from 'react';
import { REEL } from '@/desktop/data/reel';

/** Queue position, playback state, and the one <video> they both describe. */
export function useReelQueue(startId?: string) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [index, setIndex] = useState(() => Math.max(0, REEL.findIndex((c) => c.id === startId)));
  const [playing, setPlaying] = useState(false);

  // Follow the dock if a different tile is clicked while this window is open.
  useEffect(() => {
    if (!startId) return;
    const i = REEL.findIndex((c) => c.id === startId);
    if (i >= 0) setIndex(i);
  }, [startId]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.load();
    void el
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, [index]);

  const step = useCallback(
    (delta: number) => setIndex((i) => (i + delta + REEL.length) % REEL.length),
    [],
  );

  const toggle = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) void el.play().then(() => setPlaying(true)).catch(() => undefined);
    else {
      el.pause();
      setPlaying(false);
    }
  }, []);

  return {
    videoRef,
    clip: REEL[index],
    index,
    total: REEL.length,
    playing,
    setPlaying,
    setIndex,
    step,
    toggle,
  };
}
