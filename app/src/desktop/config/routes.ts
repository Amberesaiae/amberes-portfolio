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

/**
 * Where a path URL should land. The desktop only opens a window from a #/…
 * URL, so /work becomes /#/work. Studio is the one screen that is not a
 * window. Anything else goes home. Null when the visitor is already on /.
 *
 * `search` is window.location.search (leading `?`, or empty).
 * vercel.json redirects the same segments; keep that list beside this one.
 */
export function pathUrlTarget(pathname: string, search = ''): string | null {
  if (pathname === '/' || pathname === '') return null;
  const segments = pathname.split('/').filter(Boolean);
  const head = segments[0];
  if (!head) return null;
  const query = search ? (search.startsWith('?') ? search : `?${search}`) : '';
  if (head === 'studio' && segments.length === 1) return `/#/studio${query}`;
  if (Object.hasOwn(PATH_TO_WINDOW, head)) {
    return `/#/${segments.join('/')}${query}`;
  }
  return `/${query}`;
}
