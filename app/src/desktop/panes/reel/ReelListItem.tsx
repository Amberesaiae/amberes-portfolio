import { useRef } from 'react';
import { Play, Waves } from 'lucide-react';
import type { ReelClip } from '@/desktop/data/reel';
import { Label, Title } from '@/desktop/typography/Text';
import { cn } from '@/lib/utils';

interface Props {
  clip: ReelClip;
  playing: boolean;
  onPlay: () => void;
}

/**
 * One film. The thumbnail only decodes while the pointer is on it — seven
 * autoplaying loops was the thing that made the old dock expensive.
 */
export function ReelListItem({ clip, playing, onPlay }: Props) {
  const video = useRef<HTMLVideoElement>(null);

  return (
    <li>
      <button
        type="button"
        onClick={onPlay}
        onMouseEnter={() => void video.current?.play().catch(() => undefined)}
        onMouseLeave={() => video.current?.pause()}
        aria-current={playing || undefined}
        className={cn(
          'group flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors',
          playing ? 'bg-primary/10' : 'hover:bg-foreground/5',
        )}
      >
        <span className="relative h-11 w-[74px] shrink-0 overflow-hidden rounded border border-border bg-black/40">
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
              <Play className="size-3.5 translate-x-px text-white" />
            </span>
          )}
        </span>

        <span className="min-w-0 flex-1">
          <Title className="truncate text-[0.9rem]">{clip.title}</Title>
          <Label className="block truncate text-muted-foreground/75">
            {clip.credit}
            {clip.role ? ` · ${clip.role}` : ''}
          </Label>
        </span>

        {playing && (
          <span className="flex shrink-0 items-center gap-1.5 text-primary">
            <Waves className="size-3.5" />
            <Label className="text-primary">On screen</Label>
          </span>
        )}
      </button>
    </li>
  );
}
