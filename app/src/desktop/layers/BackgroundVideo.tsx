import { useEffect, useRef } from 'react';
import { useDesktop } from '@/desktop/providers/windowStore';

const STILL = '/vids/desktop-bg-poster.jpg';

/**
 * The surface the whole site sits on: fixed, full-bleed, never scrolls.
 *
 * The still is the resting state. A film appears here only when someone asks
 * for it by name — there is a "Set as wallpaper" button in the Reel — and never
 * as a side effect of pressing play. That distinction is the whole fix: the old
 * version put the film here the moment you picked it, which is why nobody could
 * tell what had happened or how to undo it.
 */
export function BackgroundVideo() {
  const { wallpaper } = useDesktop();
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = video.current;
    if (!el || !wallpaper) return;
    void el.play().catch(() => undefined);
    const onVisibility = () => {
      if (document.hidden) el.pause();
      else void el.play().catch(() => undefined);
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [wallpaper]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background" aria-hidden="true">
      <img
        src={STILL}
        alt=""
        className="size-full object-cover"
        fetchPriority="high"
        decoding="async"
      />

      {wallpaper && (
        <video
          ref={video}
          key={wallpaper}
          src={wallpaper}
          poster={STILL}
          className="absolute inset-0 size-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      )}

      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/55 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-black/15" />
    </div>
  );
}
