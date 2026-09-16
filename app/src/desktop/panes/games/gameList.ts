import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

export interface GameDef {
  id: string;
  title: string;
  blurb: string;
  /** what the keys do, shown before you start */
  keys: string;
  /** a screenshot of the game itself, in public/images */
  cover: string;
  Component: LazyExoticComponent<ComponentType>;
}

/**
 * Two games, each its own chunk.
 *
 * They were written for the old site and carry their own hardcoded palette, so
 * they do not follow the theme — which is fine while they live behind their own
 * window, and is the first thing to fix if they earn more attention.
 */
export const GAMES: GameDef[] = [
  {
    id: 'tetris',
    title: 'Tetris',
    blurb: 'The handheld on the wallpaper had to be good for something.',
    keys: '← → move · ↑ rotate · space drop',
    cover: '/images/game-tetris.jpg',
    Component: lazy(() => import('@/components/Tetris')),
  },
  {
    id: 'minesweeper',
    title: 'Minesweeper',
    blurb: 'The other thing every desktop has shipped with since 1990.',
    keys: 'Click to clear · right-click to flag',
    cover: '/images/game-minesweeper.jpg',
    Component: lazy(() => import('@/components/Minesweeper')),
  },
];
