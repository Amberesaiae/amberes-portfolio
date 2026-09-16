import { useRef } from 'react';
import type { ReelClip } from '@/desktop/data/reel';

interface Props {
  clip: ReelClip;
  /** the reel window is open, so the dock loops stand down */
  paused: boolean;
  onClick: () => void;
}

export function ReelDockTile({ clip, onClick }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Play ${clip.title} — ${clip.credit}`}
      className="group relative h-14 w-24 shrink-0 snap-start overflow-hidden rounded-lg border border-white/15 bg-black/50 transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring md:h-16 md:w-28"
    >
      <video
        ref={videoRef}
        className="size-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
        src={clip.loop}
        muted
        loop
        playsInline
        autoPlay={false}
        preload="metadata"
      />
      <span className="type-label absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/85 to-transparent px-1.5 pb-1 pt-3 text-left text-[8px] tracking-[0.14em] text-white">
        {clip.title}
      </span>
    </button>
  );
}
