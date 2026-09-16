import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import type { WindowId } from '@/desktop/types';
import type { ViewMode } from './views';

export interface PaneProps {
  arg?: string;
  /** grid or list, for the panes that offer both */
  view?: ViewMode;
}

/* Each pane is its own chunk. Nothing but the shell is in the first payload,
   and xterm in particular never loads unless the Terminal folder is opened. */
export const PANES: Record<WindowId, LazyExoticComponent<ComponentType<PaneProps>>> = {
  work: lazy(() => import('@/desktop/panes/work/WorkPane')),
  reel: lazy(() => import('@/desktop/panes/reel/ReelPane')),
  about: lazy(() => import('@/desktop/panes/about/AboutPane')),
  contact: lazy(() => import('@/desktop/panes/talk/TalkPane')),
  terminal: lazy(() => import('@/desktop/panes/terminal/TerminalPane')),
  games: lazy(() => import('@/desktop/panes/games/GamesPane')),
  legal: lazy(() => import('@/desktop/panes/legal/LegalPane')),
};
