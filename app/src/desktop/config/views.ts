import type { WindowId } from '@/desktop/types';

export type ViewMode = 'grid' | 'list';

/**
 * Which windows can be switched between a card grid and a list, and which of
 * the two they open on.
 *
 * A window absent from this map has no toggle — prose and forms have one
 * correct shape, and offering a choice there would be noise.
 */
export const VIEWS: Partial<Record<WindowId, ViewMode>> = {
  work: 'grid',
  reel: 'list',
  games: 'list',
};

export const supportsViews = (id: WindowId): boolean => id in VIEWS;
