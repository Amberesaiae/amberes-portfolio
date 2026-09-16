import { Play } from 'lucide-react';
import type { RefObject } from 'react';
import type { ReelClip } from '@/desktop/data/reel';
import { MetalRing } from '@/desktop/effects/MetalRing';

interface Props {
  clip: ReelClip;
  videoRef: RefObject<HTMLVideoElement>;
  playing: boolean;
  onToggle: () => void;
  onPlayingChange: (playing: boolean) => void;
}

export function ReelPlayer({ clip, videoRef, playing, onToggle, onPlayingChange }: Props) {
  return (
    <div className="relative flex-1 bg-black/60">
      <video
        ref={videoRef}
        className="absolute inset-0 size-full object-contain"
        src={clip.preview}
        playsInline
        loop
        controls={false}
        onClick={onToggle}
        onPlay={() => onPlayingChange(true)}
        onPause={() => onPlayingChange(false)}
      />

      {!playing && (
        <button
          type="button"
          onClick={onToggle}
          aria-label={`Play ${clip.title}`}
          className="absolute inset-0 grid place-items-center bg-black/35 transition-colors hover:bg-black/25"
        >
          <MetalRing className="size-16">
            <span className="grid size-16 place-items-center rounded-full bg-black/55 text-white">
              <Play className="size-5 translate-x-0.5" />
            </span>
          </MetalRing>
        </button>
      )}
    </div>
  );
}
