import { BASE_Z, MENUBAR_H } from '@/desktop/config/layout';
import { WINDOW_DEFS } from '@/desktop/config/windows';
import type { WindowId, WindowState } from '@/desktop/types';

export interface Viewport {
  vw: number;
  vh: number;
}

export const viewport = (): Viewport =>
  typeof window === 'undefined'
    ? { vw: 1440, vh: 900 }
    : { vw: window.innerWidth, vh: window.innerHeight };

/** Keep a titlebar reachable however the viewport has changed since. */
export function clamp(win: WindowState, { vw, vh }: Viewport): WindowState {
  const w = Math.min(win.w, Math.max(320, vw - 32));
  const h = Math.min(win.h, Math.max(240, vh - MENUBAR_H - 48));
  return {
    ...win,
    w,
    h,
    x: Math.min(Math.max(win.x, -w + 160), vw - 160),
    y: Math.min(Math.max(win.y, MENUBAR_H), vh - 80),
  };
}

/** A window's resting state before it has ever been opened. */
export function initialWindow(id: WindowId, index: number): WindowState {
  const def = WINDOW_DEFS[id];
  return {
    id,
    open: false,
    minimized: false,
    maximized: false,
    x: 120 + index * 28,
    y: MENUBAR_H + 52 + index * 28,
    w: def.defaultSize.w,
    h: def.defaultSize.h,
    z: BASE_Z,
  };
}

/**
 * Where a window lands the first time it opens: centred against the viewport as
 * it is now, nudged by a small cascade so a second window never lands exactly
 * on the first.
 */
export function placeOnFirstOpen(win: WindowState, cascade: number, vp: Viewport): WindowState {
  return clamp(
    {
      ...win,
      x: Math.round((vp.vw - win.w) / 2 + cascade * 24 - 24),
      y: Math.round((vp.vh - win.h) / 2.4 + cascade * 20),
    },
    vp,
  );
}
