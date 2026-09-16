import { MENUBAR_H } from '@/desktop/config/layout';
import type { WindowState } from '@/desktop/types';

export interface Geometry {
  x: number;
  y: number;
  width: number | string;
  height: number | string;
}

/**
 * Where a window is and how big, including the maximised case.
 *
 * Split out of Window.tsx so that file stays composition: the arithmetic of
 * "maximised means twelve pixels in from every edge, minus the menu bar" is not
 * something to read past on the way to the markup.
 */
export function useWindowGeometry(win: WindowState): Geometry {
  if (!win.maximized) {
    return { x: win.x, y: win.y, width: win.w, height: win.h };
  }

  return {
    x: 12,
    y: MENUBAR_H,
    width: 'calc(100vw - 24px)',
    height: `calc(100vh - ${MENUBAR_H + 28}px)`,
  };
}
