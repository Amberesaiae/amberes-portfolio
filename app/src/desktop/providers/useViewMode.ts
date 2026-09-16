import { useCallback, useEffect, useState } from 'react';
import { VIEWS, type ViewMode } from '@/desktop/config/views';
import type { WindowId } from '@/desktop/types';

const KEY = 'desktop:views:v1';

type Stored = Partial<Record<WindowId, ViewMode>>;

function read(): Stored {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Stored) : {};
  } catch {
    return {};
  }
}

/**
 * Grid or list, per window, remembered.
 *
 * Each window owns its own instance — the Work window being a grid says nothing
 * about how someone wants to see the Reel.
 */
export function useViewMode(id: WindowId) {
  const [mode, setMode] = useState<ViewMode>(() => read()[id] ?? VIEWS[id] ?? 'list');

  // Pick up a change made in another window of the same id (or another tab).
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== KEY) return;
      const next = read()[id];
      if (next) setMode(next);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [id]);

  const set = useCallback(
    (next: ViewMode) => {
      setMode(next);
      try {
        localStorage.setItem(KEY, JSON.stringify({ ...read(), [id]: next }));
      } catch {
        /* the choice simply does not survive the visit */
      }
    },
    [id],
  );

  return { mode, set };
}
