import { useEffect, useState } from 'react';

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
 * Effects go off only when the device or the visitor says no: reduced motion
 * and save-data / 2G turn everything off. Small screens used to kill the
 * heavy layer too, but that left mobile with dead fallbacks where the design
 * expects living effects — and modern phones run a few small canvases fine.
 * If a device still stutters, that is per-effect tuning (e.g. pausing
 * off-screen orbs), not a reason to blank the whole layer.
 */
export function useEffectsEnabled(): EffectBudget {
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

  return { light: allowed, heavy: allowed };
}
