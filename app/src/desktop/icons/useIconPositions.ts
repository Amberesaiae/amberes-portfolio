import { useCallback, useEffect, useState } from 'react';
import { DOCK_H, ICON_H, ICON_W, MENUBAR_H } from '@/desktop/config/layout';
import { WINDOW_DEFS, WINDOW_ORDER } from '@/desktop/config/windows';
import type { Point, WindowId } from '@/desktop/types';

const KEY = 'desktop:icons:v1';

export type Positions = Record<WindowId, Point>;

function bounds() {
  const vw = typeof window === 'undefined' ? 1440 : window.innerWidth;
  const vh = typeof window === 'undefined' ? 900 : window.innerHeight;
  return {
    minX: 8,
    maxX: Math.max(8, vw - ICON_W - 8),
    minY: MENUBAR_H + 8,
    maxY: Math.max(MENUBAR_H + 8, vh - ICON_H - DOCK_H),
  };
}

const fit = (p: Point): Point => {
  const b = bounds();
  return {
    x: Math.min(Math.max(p.x, b.minX), b.maxX),
    y: Math.min(Math.max(p.y, b.minY), b.maxY),
  };
};

function defaults(): Positions {
  const vw = typeof window === 'undefined' ? 1440 : window.innerWidth;
  const vh = typeof window === 'undefined' ? 900 : window.innerHeight;
  const out = {} as Positions;
  WINDOW_ORDER.forEach((id) => {
    const { home } = WINDOW_DEFS[id];
    out[id] = fit({ x: Math.round((home.x / 100) * vw), y: Math.round((home.y / 100) * vh) });
  });
  return out;
}

function read(): Positions | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as Partial<Positions>;
    // Merge over defaults so a folder added later still gets a home.
    const base = defaults();
    WINDOW_ORDER.forEach((id) => {
      const p = stored[id];
      if (p && typeof p.x === 'number' && typeof p.y === 'number') base[id] = fit(p);
    });
    return base;
  } catch {
    return null;
  }
}

/**
 * Folder positions, remembered per visitor. Storage can be unavailable or full
 * (private windows, blocked site data) — every access is guarded, and the
 * desktop behaves identically without it.
 */
export function useIconPositions() {
  const [positions, setPositions] = useState<Positions>(() => read() ?? defaults());

  const persist = useCallback((next: Positions) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* positions simply do not survive the visit */
    }
  }, []);

  // Keep every icon reachable when the viewport changes.
  useEffect(() => {
    const onResize = () =>
      setPositions((prev) => {
        let changed = false;
        const next = { ...prev };
        WINDOW_ORDER.forEach((id) => {
          const p = fit(prev[id]);
          if (p.x !== prev[id].x || p.y !== prev[id].y) {
            next[id] = p;
            changed = true;
          }
        });
        return changed ? next : prev;
      });

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const setPosition = useCallback(
    (id: WindowId, x: number, y: number) =>
      setPositions((prev) => {
        const next = { ...prev, [id]: fit({ x, y }) };
        persist(next);
        return next;
      }),
    [persist],
  );

  const tidy = useCallback(() => {
    const next = defaults();
    setPositions(next);
    persist(next);
  }, [persist]);

  return { positions, setPosition, tidy };
}
