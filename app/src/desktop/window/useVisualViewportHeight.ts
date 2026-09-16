import { useEffect } from 'react';

/**
 * Pins a CSS var to the visible height.
 *
 * `100dvh` tracks the browser chrome but not the on-screen keyboard: with the
 * keyboard open, a `fixed inset-0` sheet keeps its full height and the input
 * row ends up floating mid-screen behind the keys. visualViewport shrinks with
 * the keyboard on every modern mobile browser, so driving the sheet height
 * from it keeps the composer glued above the keys. Unsupported browsers keep
 * the 100dvh fallback and behave exactly as before.
 */
export function useVisualViewportHeight() {
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const sync = () => {
      document.documentElement.style.setProperty('--vv-h', `${vv.height}px`);
    };
    sync();
    vv.addEventListener('resize', sync);
    vv.addEventListener('scroll', sync);
    window.addEventListener('orientationchange', sync);
    return () => {
      vv.removeEventListener('resize', sync);
      vv.removeEventListener('scroll', sync);
      window.removeEventListener('orientationchange', sync);
      document.documentElement.style.removeProperty('--vv-h');
    };
  }, []);
}
