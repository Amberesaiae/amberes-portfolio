import { useCallback } from 'react';
import { REEL } from '@/desktop/data/reel';
import { useDesktop, useDesktopDispatch } from '@/desktop/providers/windowStore';

/**
 * Which film is currently the wallpaper, and how to change it.
 *
 * The desktop background is the player — there is no second video element to
 * keep in sync, and closing the Reel window puts the original plate back (the
 * reducer handles that).
 */
export function useWallpaperFilm() {
  const { activeBackgroundVideo } = useDesktop();
  const dispatch = useDesktopDispatch();

  const playingId =
    REEL.find((clip) => clip.preview === activeBackgroundVideo)?.id ?? null;

  const play = useCallback(
    (id: string) => {
      const clip = REEL.find((c) => c.id === id);
      if (clip) dispatch({ type: 'setReelBackground', src: clip.preview });
    },
    [dispatch],
  );

  const restore = useCallback(
    () => dispatch({ type: 'setReelBackground', src: null }),
    [dispatch],
  );

  return { playingId, play, restore };
}
