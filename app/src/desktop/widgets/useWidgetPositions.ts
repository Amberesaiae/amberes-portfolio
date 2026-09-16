import { useCallback } from 'react';
import { DOCK_H, MENUBAR_H } from '@/desktop/config/layout';
import type { Point } from '@/desktop/types';
import { usePersistedPositions } from './usePersistedPositions';

export type WidgetId = 'featured' | 'clock' | 'gallery' | 'talk' | 'films';

const IDS = ['featured', 'clock', 'gallery', 'talk', 'films'] as const;

/** Home positions in % of the viewport, so they land sensibly at any size. */
const HOME: Record<WidgetId, Point> = {
  featured: { x: 70, y: 9 },
  clock: { x: 4, y: 9 },
  gallery: { x: 4, y: 31 },
  talk: { x: 70, y: 56 },
  films: { x: 4, y: 76 },
};

const SIZE: Record<WidgetId, { w: number; h: number }> = {
  featured: { w: 320, h: 360 },
  clock: { w: 272, h: 140 },
  gallery: { w: 300, h: 350 },
  talk: { w: 248, h: 64 },
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
    storageKey: 'desktop:widgets:v5',
    ids: IDS,
    defaults,
    fit,
  });
}
