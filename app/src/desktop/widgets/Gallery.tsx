import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageSlot } from '@/desktop/components/ImageSlot';
import { GALLERY } from '@/desktop/data/gallery';
import { useIsMobile } from '@/desktop/providers/useIsMobile';
import { cn } from '@/lib/utils';
import { Label, Small, Title } from '@/desktop/typography/Text';

const DWELL = 7000;

/**
 * The pictures that are not projects, one at a time with its line.
 *
 * It advances on its own slowly enough to read, and stops the moment anyone
 * takes control — an auto-advancing thing that ignores you is worse than a
 * static one.
 */
export function Gallery() {
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);
  const mobile = useIsMobile();
  const item = GALLERY[index];

  const step = useCallback(
    (delta: number) => setIndex((i) => (i + delta + GALLERY.length) % GALLERY.length),
    [],
  );

  useEffect(() => {
    if (held) return;
    const t = setInterval(() => step(1), DWELL);
    return () => clearInterval(t);
  }, [held, step]);

  return (
    <div
      className="flex h-full w-full min-h-0 flex-col p-3 sm:h-auto sm:w-[300px]"
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
    >
      {mobile ? (
        <span className="min-h-[110px] flex-1 overflow-hidden rounded-lg border border-border">
          <img
            src={item.src}
            alt={item.title}
            className="size-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </span>
      ) : (
        <ImageSlot
          className="w-full"
          ratio="4 / 3"
          src={item.src}
          alt={item.title}
          hint={item.title}
          sizes="300px"
        />
      )}

      <div className="mt-2.5 shrink-0 px-1">
        <Title className="truncate text-[0.875rem]">{item.title}</Title>
        <Small
          className={cn(
            'mt-1 text-[0.75rem] leading-relaxed text-muted-foreground',
            'line-clamp-2',
          )}
        >
          {item.note}
        </Small>
      </div>

      <div
        className={cn(
          'mt-2.5 flex shrink-0 items-center gap-1 border-t border-border px-1 pt-2',
        )}
      >
        <Label className="text-subtle-foreground">
          {index + 1}/{GALLERY.length}
        </Label>
        <button
          type="button"
          aria-label="Previous"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => step(-1)}
          className="ml-auto grid size-6 place-items-center rounded text-subtle-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
        >
          <ChevronLeft className="size-3.5" />
        </button>
        <button
          type="button"
          aria-label="Next"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => step(1)}
          className="grid size-6 place-items-center rounded text-subtle-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
        >
          <ChevronRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
