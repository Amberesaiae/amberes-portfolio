import { Undo2 } from 'lucide-react';
import { useRef } from 'react';
import { REEL } from '@/desktop/data/reel';
import { useWallpaperFilm } from '@/desktop/panes/reel/useWallpaperFilm';
import { useDesktopDispatch } from '@/desktop/providers/windowStore';
import { cn } from '@/lib/utils';

/** How far each card sits from the one under it. */
const STEP = 30;
const CARD_W = 108;
const CARD_H = 68;

/**
 * The films, stacked, as the way in to the reel.
 *
 * A stack rather than a grid: seven cards overlapping like a pile of stills on
 * a desk. A grid gives every film the same weight and turns the whole thing
 * into a contact sheet; a stack reads as one object, which is both smaller on
 * the screen and more inviting to touch.
 *
 * Clicking the pile opens the Reel, where the full list scrolls and picking one
 * puts it on the wallpaper. That is the division of labour: this plate is an
 * invitation, the window is the chooser. Fanning the stack out in place was the
 * other option and it was worse — it turned a small ornament into a cramped
 * list competing with the one that already exists.
 *
 * Pointing at a card lifts it and starts its loop; the rest stay paused, so
 * seven videos are never decoding at once.
 */
export function ReelStrip() {
  const { playingId, restore } = useWallpaperFilm();
  const dispatch = useDesktopDispatch();

  const open = () => dispatch({ type: 'open', id: 'reel' });

  return (
    <div className="p-3">
      <div className="relative" style={{ width: CARD_W + STEP * (REEL.length - 1), height: CARD_H }}>
        {REEL.map((clip, i) => (
          <Card
            key={clip.id}
            clip={clip}
            index={i}
            z={i}
            playing={playingId === clip.id}
            onOpen={open}
          />
        ))}
      </div>

      {playingId && (
        <button
          type="button"
          onClick={restore}
          onPointerDown={(e) => e.stopPropagation()}
          className="type-label mt-2.5 flex h-6 items-center gap-1 rounded px-1 text-primary"
        >
          <Undo2 className="size-3" />
          Restore wallpaper
        </button>
      )}
    </div>
  );
}

function Card({
  clip,
  index,
  z,
  playing,
  onOpen,
}: {
  clip: (typeof REEL)[number];
  index: number;
  z: number;
  playing: boolean;
  onOpen: () => void;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const start = () => void video.current?.play().catch(() => undefined);
  const stop = () => video.current?.pause();

  return (
    <button
      type="button"
      onClick={onOpen}
      onPointerDown={(e) => e.stopPropagation()}
      onMouseEnter={start}
      onMouseLeave={stop}
      onFocus={start}
      onBlur={stop}
      aria-current={playing || undefined}
      aria-label={`Open the reel — ${clip.title} by ${clip.credit}`}
      title={`${clip.title} — ${clip.credit}`}
      style={{ left: index * STEP, width: CARD_W, height: CARD_H, zIndex: z }}
      className={cn(
        'group absolute top-0 overflow-hidden rounded-md border shadow-window-idle',
        'transition-[transform,border-color] duration-200',
        'hover:z-20 hover:-translate-y-2 focus-visible:z-20 focus-visible:-translate-y-2',
        playing ? 'border-primary' : 'border-black/50 hover:border-foreground/40',
      )}
    >
      <video
        ref={video}
        className={cn(
          'size-full object-cover transition-opacity duration-200',
          playing ? 'opacity-100' : 'opacity-75 group-hover:opacity-100',
        )}
        src={clip.loop}
        muted
        loop
        playsInline
        preload="metadata"
      />
    </button>
  );
}
