import { ScrollArea } from '@/components/ui/scroll-area';
import { REEL } from '@/desktop/data/reel';
import { Label, Mono } from '@/desktop/typography/Text';
import { cn } from '@/lib/utils';

interface Props {
  index: number;
  onSelect: (index: number) => void;
}

export function ReelQueue({ index, onSelect }: Props) {
  return (
    <ScrollArea className="shrink-0 border-border md:w-60 md:border-l">
      <ul>
        {REEL.map((clip, i) => (
          <li key={clip.id}>
            <button
              type="button"
              onClick={() => onSelect(i)}
              aria-current={i === index}
              className={cn(
                'flex w-full items-center gap-3 px-3.5 py-3 text-left transition-colors',
                i === index ? 'bg-white/10' : 'hover:bg-white/5',
              )}
            >
              <Mono className="text-muted-foreground/45">{String(i + 1).padStart(2, '0')}</Mono>
              <span className="min-w-0">
                <span
                  className={cn(
                    'type-small block truncate',
                    i === index ? 'text-foreground' : 'text-foreground/70',
                  )}
                >
                  {clip.title}
                </span>
                <Label className="block truncate text-muted-foreground/60">{clip.credit}</Label>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}
