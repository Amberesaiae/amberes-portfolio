import { BASE_Z, MENUBAR_H } from '@/desktop/config/layout';
import { WINDOW_DEFS, WINDOW_ORDER } from '@/desktop/config/windows';
import type { WindowId, WindowState } from '@/desktop/types';
import { clamp, initialWindow, placeOnFirstOpen, viewport } from './windowGeometry';

export interface DesktopState {
  windows: Record<WindowId, WindowState>;
  topZ: number;
  /** focused window, or null when the desktop itself has focus */
  focused: WindowId | null;
  /** The film currently painted on the desktop, or null for the still. */
  wallpaper: string | null;
  /** icon selected by a single click */
  selectedIcon: WindowId | null;
}

export type DesktopAction =
  | { type: 'open'; id: WindowId; arg?: string }
  | { type: 'close'; id: WindowId }
  | { type: 'focus'; id: WindowId }
  | { type: 'minimize'; id: WindowId }
  | { type: 'toggleMaximize'; id: WindowId }
  | { type: 'move'; id: WindowId; x: number; y: number }
  | { type: 'resize'; id: WindowId; w: number; h: number }
  | { type: 'selectIcon'; id: WindowId | null }
  | { type: 'closeAll' }
  | { type: 'setWallpaper'; src: string | null };

export function makeInitialState(): DesktopState {
  const windows = {} as Record<WindowId, WindowState>;
  WINDOW_ORDER.forEach((id, i) => {
    windows[id] = initialWindow(id, i);
  });
  return { windows, topZ: BASE_Z, focused: null, selectedIcon: null, wallpaper: null };
}

/** Highest-z open window that is not `except`, for handing focus on. */
function nextFocus(state: DesktopState, except: WindowId, skipMinimized: boolean) {
  return (
    WINDOW_ORDER.filter(
      (id) =>
        id !== except && state.windows[id].open && (!skipMinimized || !state.windows[id].minimized),
    ).sort((a, b) => state.windows[b].z - state.windows[a].z)[0] ?? null
  );
}

function patch(state: DesktopState, id: WindowId, next: Partial<WindowState>): DesktopState {
  return { ...state, windows: { ...state.windows, [id]: { ...state.windows[id], ...next } } };
}

export function windowReducer(state: DesktopState, action: DesktopAction): DesktopState {
  const vp = viewport();

  switch (action.type) {
    case 'open': {
      const prev = state.windows[action.id];
      const z = state.topZ + 1;
      const cascade = WINDOW_ORDER.indexOf(action.id) % 3;

      // Centre only on the first open, against the viewport as it is now.
      const placed = prev.open ? prev : placeOnFirstOpen(prev, cascade, vp);


      return {
        ...state,
        topZ: z,
        focused: action.id,
        selectedIcon: action.id,
        windows: {
          ...state.windows,
          [action.id]: {
            ...placed,
            open: true,
            minimized: false,
            z,
            arg: action.arg ?? prev.arg,
          },
        },
      };
    }

    case 'close':
      return {
        ...patch(state, action.id, { open: false, minimized: false, arg: undefined }),
        focused: nextFocus(state, action.id, false),
      };

    case 'focus': {
      if (state.focused === action.id && !state.windows[action.id].minimized) return state;
      const z = state.topZ + 1;
      return { ...patch(state, action.id, { z, minimized: false }), topZ: z, focused: action.id };
    }

    case 'minimize':
      return {
        ...patch(state, action.id, { minimized: true }),
        focused: nextFocus(state, action.id, true),
      };

    case 'toggleMaximize':
      return patch(state, action.id, { maximized: !state.windows[action.id].maximized });

    case 'move':
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.id]: clamp({ ...state.windows[action.id], x: action.x, y: action.y }, vp),
        },
      };

    case 'resize': {
      const min = WINDOW_DEFS[action.id].minSize;
      return patch(state, action.id, {
        w: Math.max(min.w, Math.min(action.w, vp.vw - 24)),
        h: Math.max(min.h, Math.min(action.h, vp.vh - MENUBAR_H - 20)),
      });
    }

    case 'selectIcon':
      return { ...state, selectedIcon: action.id };

    case 'setWallpaper':
      return { ...state, wallpaper: action.src };

    case 'closeAll': {
      const windows = { ...state.windows };
      WINDOW_ORDER.forEach((id) => {
        windows[id] = { ...windows[id], open: false, minimized: false, arg: undefined };
      });
      return { ...state, windows, focused: null, selectedIcon: null };
    }

    default:
      return state;
  }
}
