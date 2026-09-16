import { useEffect, useRef } from 'react';
import { useDesktop } from '@/desktop/providers/windowStore';

const STILL = '/vids/desktop-bg-poster.jpg';

/**
 * The surface the whole site sits on: fixed, full-bleed, never scrolls.
 *
 * At rest it is a still — the captured frame. The looping background video was
 * doing nothing the still does not do, and it stuttered on first paint, so the
 * home screen no longer pays for it.
 *
 * Motion is reserved for one thing: picking a film in the Reel makes that film
 * the wallpaper. When a film is playing the desktop *is* the player, and the
 * still comes back the moment it stops.
 *
 * Two scrims carry the chrome — the plate is dark at the top where the menubar
 * goes and darker at the bottom where the dock goes.
 */
export function BackgroundVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const { activeBackgroundVideo } = useDesktop();

  useEffect(() => {
    const el = ref.current;
    if (!el || !activeBackgroundVideo) return;

    void el.play().catch(() => undefined);

    const onVisibility = () => {
      if (document.hidden) el.pause();
      else void el.play().catch(() => undefined);
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [activeBackgroundVideo]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background" aria-hidden="true">
      <img
        src={STILL}
        alt=""
        className="size-full object-cover"
        fetchPriority="high"
        decoding="async"
      />

      {activeBackgroundVideo && (
        <video
          ref={ref}
          key={activeBackgroundVideo}
          className="absolute inset-0 size-full object-cover transition-opacity duration-300"
          poster={STILL}
          src={activeBackgroundVideo}
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
