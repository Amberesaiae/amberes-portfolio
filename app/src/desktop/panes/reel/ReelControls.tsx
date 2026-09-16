import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ReelClip } from '@/desktop/data/reel';
import { Label, Mono, Title } from '@/desktop/typography/Text';

interface Props {
  clip: ReelClip;
  index: number;
  total: number;
  playing: boolean;
  onStep: (delta: number) => void;
  onToggle: () => void;
}

export function ReelControls({ clip, index, total, playing, onStep, onToggle }: Props) {
  return (
    <div className="flex shrink-0 items-center gap-2 border-t border-border px-4 py-3">
      <Button variant="ghost" size="icon-sm" onClick={() => onStep(-1)} aria-label="Previous clip">
        <SkipBack />
      </Button>
      <Button variant="ghost" size="icon-sm" onClick={onToggle} aria-label={playing ? 'Pause' : 'Play'}>
        {playing ? <Pause /> : <Play />}
      </Button>
      <Button variant="ghost" size="icon-sm" onClick={() => onStep(1)} aria-label="Next clip">
        <SkipForward />
      </Button>

      <div className="ml-2 min-w-0 flex-1">
        <Title className="truncate text-[0.9rem]">{clip.title}</Title>
        <Label className="block truncate text-muted-foreground/75">
          {clip.credit}
          {clip.role ? ` \u00b7 ${clip.role}` : ''}
        </Label>
      </div>

      <Mono className="shrink-0 text-muted-foreground/60">
        {index + 1}/{total}
      </Mono>
    </div>
  );
}
