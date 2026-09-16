import { useEffect, useState } from 'react';

interface SaveDataConnection {
  saveData?: boolean;
  effectiveType?: string;
}

/**
 * True when the background should be the poster frame instead of the video:
 * the visitor asked for less motion, or their connection cannot afford it.
 */
export function useStillBackground() {
  const [still, setStill] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const conn = (navigator as Navigator & { connection?: SaveDataConnection }).connection;
    const thin = conn?.saveData === true || /^(slow-)?2g$/.test(conn?.effectiveType ?? '');
    setStill(reduced || thin);
  }, []);

  return still;
}
