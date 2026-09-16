import { useRef } from 'react';
import { Play, Waves } from 'lucide-react';
import type { ReelClip } from '@/desktop/data/reel';
import { MediaCard } from '@/desktop/panes/MediaCard';

interface Props {
  clip: ReelClip;
  playing: boolean;
  onPlay: () => void;
}

/** The card form of a film. The thumbnail only decodes while hovered. */
export function ReelCard({ clip, playing, onPlay }: Props) {
  const video = useRef<HTMLVideoElement>(null);

  return (
    <div
      onMouseEnter={() => void video.current?.play().catch(() => undefined)}
      onMouseLeave={() => video.current?.pause()}
      className="contents"
    >
      <MediaCard
        title={clip.title}
        meta={clip.role ? `${clip.credit} · ${clip.role}` : clip.credit}
        active={playing}
        onOpen={onPlay}
        trailing={playing ? <Waves className="size-3.5 text-primary" /> : undefined}
        media={
          <>
            <video
              ref={video}
              className="size-full object-cover opacity-85 transition-opacity group-hover:opacity-100"
              src={clip.loop}
              muted
              loop
              playsInline
              preload="metadata"
            />
            {!playing && (
              <span className="absolute inset-0 grid place-items-center bg-black/25 opacity-0 transition-opacity group-hover:opacity-100">
                <Play className="size-5 translate-x-px text-white" />
              </span>
            )}
          </>
        }
      />
    </div>
  );
}
