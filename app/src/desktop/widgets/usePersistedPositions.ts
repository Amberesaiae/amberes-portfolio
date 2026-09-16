import { useCallback, useEffect, useState } from 'react';
import type { Point } from '@/desktop/types';

export interface Bounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

interface Config<Id extends string> {
  /** localStorage key */
  storageKey: string;
  ids: readonly Id[];
  /** where each thing sits before anyone moves it */
  defaults: () => Record<Id, Point>;
  /** keep a thing on screen; called on read, on drop and on resize */
  fit: (id: Id, point: Point) => Point;
}

/**
 * Positions for draggable things, remembered per visitor.
 *
 * Generic because two different sets of things need exactly this — folders once
 * did, the desktop plates do now — and the only parts that differ are the
 * storage key, the ids and how each is clamped. Storage can be unavailable or
 * full, so every access is guarded and the desktop behaves identically without.
 */
export function usePersistedPositions<Id extends string>({
  storageKey,
  ids,
  defaults,
  fit,
}: Config<Id>) {
  const read = useCallback((): Record<Id, Point> => {
    const base = defaults();
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return base;
      const stored = JSON.parse(raw) as Partial<Record<Id, Point>>;
      ids.forEach((id) => {
        const p = stored[id];
        if (p && typeof p.x === 'number' && typeof p.y === 'number') base[id] = fit(id, p);
      });
    } catch {
      /* fall back to the defaults already in hand */
    }
    return base;
  }, [defaults, fit, ids, storageKey]);

  const [positions, setPositions] = useState<Record<Id, Point>>(read);

  const persist = useCallback(
    (next: Record<Id, Point>) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        /* positions simply do not survive the visit */
      }
    },
    [storageKey],
  );

  // Keep everything reachable when the viewport changes.
  useEffect(() => {
    const onResize = () =>
      setPositions((prev) => {
        let changed = false;
        const next = { ...prev };
        ids.forEach((id) => {
          const p = fit(id, prev[id]);
          if (p.x !== prev[id].x || p.y !== prev[id].y) {
            next[id] = p;
            changed = true;
          }
        });
        return changed ? next : prev;
      });

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [fit, ids]);

  const setPosition = useCallback(
    (id: Id, x: number, y: number) =>
      setPositions((prev) => {
        const next = { ...prev, [id]: fit(id, { x, y }) };
        persist(next);
        return next;
      }),
    [fit, persist],
  );

  const tidy = useCallback(() => {
    const next = defaults();
    setPositions(next);
    persist(next);
  }, [defaults, persist]);

  return { positions, setPosition, tidy };
}
