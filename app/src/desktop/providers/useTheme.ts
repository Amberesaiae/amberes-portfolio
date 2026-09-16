import { useCallback, useEffect, useState } from 'react';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

const KEY = 'desktop:theme:v1';

function readPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  } catch {
    /* storage unavailable — fall through to system */
  }
  return 'system';
}

const systemTheme = (): ResolvedTheme =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark';

/**
 * Theme preference, and the theme it currently resolves to.
 *
 * `system` writes no attribute at all, leaving the media query in index.css in
 * charge; an explicit choice stamps `data-theme` on <html>, which every token
 * block is written to respect in both directions. The attribute is what the
 * shadcn components, xterm and the orb all read, so there is one source of
 * truth rather than a prop threaded through the tree.
 */
export function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>(readPreference);
  const [resolved, setResolved] = useState<ResolvedTheme>(() =>
    readPreference() === 'system' ? systemTheme() : (readPreference() as ResolvedTheme),
  );

  useEffect(() => {
    const root = document.documentElement;

    if (preference === 'system') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', preference);
    }

    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const sync = () => setResolved(preference === 'system' ? systemTheme() : preference);
    sync();

    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, [preference]);

  const set = useCallback((next: ThemePreference) => {
    setPreference(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* the choice simply does not survive the visit */
    }
  }, []);

  /** Flip to the opposite of what is on screen, pinning it explicitly. */
  const toggle = useCallback(() => {
    setPreference((prev) => {
      const current = prev === 'system' ? systemTheme() : prev;
      const next: ThemePreference = current === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(KEY, next);
      } catch {
        /* ignored */
      }
      return next;
    });
  }, []);

  return { preference, resolved, set, toggle };
}
