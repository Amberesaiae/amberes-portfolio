import { useEffect, useState } from 'react';
import { useIsMobile } from '@/desktop/providers/useIsMobile';

export interface EffectBudget {
  /** cheap CSS/SVG effects: border beam, metal ring, shimmer */
  light: boolean;
  /** anything with a filter chain or canvas loop: gooey, orbs */
  heavy: boolean;
}

interface SaveDataConnection {
  saveData?: boolean;
  effectiveType?: string;
}

/**
 * One budget, decided once.
 *
 * Effects are the first thing to go when the device or the visitor says no:
 * reduced motion turns everything off, and a phone keeps only the cheap layer,
 * because the background video and seven dock loops have already spent most of
 * what a mid-range GPU has.
 */
export function useEffectsEnabled(): EffectBudget {
  const mobile = useIsMobile();
  const [allowed, setAllowed] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const conn = (navigator as Navigator & { connection?: SaveDataConnection }).connection;
    const thin = conn?.saveData === true || /^(slow-)?2g$/.test(conn?.effectiveType ?? '');

    const update = () => setAllowed(!mq.matches && !thin);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return { light: allowed, heavy: allowed && !mobile };
}
