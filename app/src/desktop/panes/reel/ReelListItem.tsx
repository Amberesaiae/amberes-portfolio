import { useRef } from 'react';
import { Play, Waves } from 'lucide-react';
import type { ReelClip } from '@/desktop/data/reel';
import { Label, Title } from '@/desktop/typography/Text';
import { cn } from '@/lib/utils';

interface Props {
  clip: ReelClip;
  /** true while this film is the desktop wallpaper */
  active: boolean;
  onSelect: () => void;
}

/**
 * One film. The thumbnail only plays while the pointer is on it *or* it holds
 * focus — seven autoplaying loops was the thing that made the old dock
 * expensive, but a keyboard user should still see the film move.
 *
 * Selecting it puts it on the desktop wallpaper; it never plays in this
 * window. The marker shows which film currently owns the background.
 */
export function ReelListItem({ clip, active, onSelect }: Props) {
  const video = useRef<HTMLVideoElement>(null);

  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        onMouseEnter={() => void video.current?.play().catch(() => undefined)}
        onMouseLeave={() => video.current?.pause()}
        onFocus={() => void video.current?.play().catch(() => undefined)}
        onBlur={() => video.current?.pause()}
        aria-current={active || undefined}
        className={cn(
          'group flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors',
          active ? 'bg-primary/10' : 'hover:bg-foreground/5',
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
          {!active && (
            <span className="absolute inset-0 grid place-items-center bg-black/25 opacity-0 transition-opacity group-hover:opacity-100">
              <Play className="size-3.5 translate-x-px text-white" />
            </span>
          )}
        </span>

        <span className="min-w-0 flex-1">
          <Title className="truncate text-[0.9rem]">{clip.title}</Title>
          <Label className="block truncate text-subtle-foreground">
            {clip.credit}
            {clip.role ? ` · ${clip.role}` : ''}
          </Label>
        </span>

        {active && (
          <span className="flex shrink-0 items-center gap-1.5 text-primary">
            <Waves className="size-3.5" />
            <Label className="text-primary">On desktop</Label>
          </span>
        )}
      </button>
    </li>
  );
}
