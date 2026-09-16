import type { WindowId } from '@/desktop/types';

/**
 * URL segment -> window. The legacy entries keep links to the old site alive
 * instead of dropping them on a 404.
 */
export const PATH_TO_WINDOW: Record<string, WindowId> = {
  work: 'work',
  reel: 'reel',
  about: 'about',
  contact: 'contact',
  terminal: 'terminal',
  games: 'games',
  legal: 'legal',
  portfolio: 'work',
  privacy: 'legal',
  terms: 'legal',
  cookies: 'legal',
};
