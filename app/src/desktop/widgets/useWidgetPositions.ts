import { useCallback } from 'react';
import { DOCK_H, MENUBAR_H } from '@/desktop/config/layout';
import type { Point } from '@/desktop/types';
import { usePersistedPositions } from './usePersistedPositions';

export type WidgetId = 'work' | 'clock' | 'talk' | 'films';

const IDS = ['work', 'clock', 'talk', 'films'] as const;

/**
 * Home positions in % of the viewport, so they land sensibly at any size.
 *
 * The work plate took the place of the picture plate and the selected-work
 * list, and it is wide, so the films moved to the right column under the
 * conversation rather than sitting underneath it.
 */
const HOME: Record<WidgetId, Point> = {
  clock: { x: 3.5, y: 8 },
  talk: { x: 76, y: 8 },
  work: { x: 3.5, y: 27 },
  films: { x: 76, y: 70 },
};

const SIZE: Record<WidgetId, { w: number; h: number }> = {
  work: { w: 860, h: 480 },
  clock: { w: 272, h: 140 },
  talk: { w: 260, h: 88 },
  films: { w: 306, h: 96 },
};

/** The plates that live on the desktop, with their own storage key. */
export function useWidgetPositions() {
  const fit = useCallback((id: WidgetId, p: Point): Point => {
    const vw = typeof window === 'undefined' ? 1440 : window.innerWidth;
    const vh = typeof window === 'undefined' ? 900 : window.innerHeight;
    const { w, h } = SIZE[id];
    return {
      x: Math.min(Math.max(p.x, 8), Math.max(8, vw - w - 8)),
      y: Math.min(Math.max(p.y, MENUBAR_H + 8), Math.max(MENUBAR_H + 8, vh - h - DOCK_H)),
    };
  }, []);

  const defaults = useCallback(() => {
    const vw = typeof window === 'undefined' ? 1440 : window.innerWidth;
    const vh = typeof window === 'undefined' ? 900 : window.innerHeight;
    const out = {} as Record<WidgetId, Point>;
    IDS.forEach((id) => {
      out[id] = fit(id, { x: (HOME[id].x / 100) * vw, y: (HOME[id].y / 100) * vh });
    });
    return out;
  }, [fit]);

  return usePersistedPositions<WidgetId>({
    storageKey: 'desktop:widgets:v6',
    ids: IDS,
    defaults,
    fit,
  });
}
