import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Label, Title } from '@/desktop/typography/Text';

interface Props {
  title: string;
  /** one line under the title — year and category, a credit, a key hint */
  meta: string;
  /** fills the 16:10 media box: an image, a video, a glyph */
  media: ReactNode;
  /** small mark to the left of the title, e.g. a status dot */
  leading?: ReactNode;
  /** small mark to the right, e.g. an arrow or a playing indicator */
  trailing?: ReactNode;
  active?: boolean;
  onOpen: () => void;
}

/**
 * Every card in every grid.
 *
 * One component rather than three near-identical ones, because the moment Work,
 * Reel and Games each own their own markup they drift: a different padding here,
 * a third line of text there, and the grid stops looking like a grid. The media
 * box is a fixed 16:10 and the footer is a fixed two lines, so every card in
 * every window is exactly the same height.
 */
export function MediaCard({ title, meta, media, leading, trailing, active, onOpen }: Props) {
  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        aria-current={active || undefined}
        className={cn(
          'group flex w-full flex-col overflow-hidden rounded-lg border text-left transition-colors',
          active
            ? 'border-primary/60 bg-primary/10'
            : 'border-border hover:border-primary/50 hover:bg-foreground/5',
        )}
      >
        <span className="relative block aspect-[16/10] w-full overflow-hidden bg-foreground/[0.04]">
          {media}
        </span>

        <span className="flex items-start gap-2.5 p-3">
          {leading && <span className="mt-1.5 shrink-0">{leading}</span>}
          <span className="min-w-0 flex-1">
            <Title className="truncate text-[0.875rem] transition-colors group-hover:text-primary">
              {title}
            </Title>
            <Label className="mt-1 block truncate text-subtle-foreground">{meta}</Label>
          </span>
          {trailing && <span className="mt-0.5 shrink-0">{trailing}</span>}
        </span>
      </button>
    </li>
  );
}
