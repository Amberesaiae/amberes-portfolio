import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageSlot } from '@/desktop/components/ImageSlot';
import { GALLERY } from '@/desktop/data/gallery';
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
      className="w-[300px] p-3"
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
    >
      <ImageSlot
        className="w-full"
        ratio="4 / 3"
        src={item.src}
        alt={item.title}
        hint={item.title}
        sizes="300px"
      />

      <div className="mt-3 px-1">
        <Title className="text-[0.875rem]">{item.title}</Title>
        <Small className="mt-1 text-[0.75rem] leading-relaxed text-muted-foreground">
          {item.note}
        </Small>
      </div>

      <div className="mt-3 flex items-center gap-1 border-t border-border px-1 pt-2.5">
        <Label className="text-muted-foreground/50">
          {index + 1}/{GALLERY.length}
        </Label>
        <button
          type="button"
          aria-label="Previous"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => step(-1)}
          className="ml-auto grid size-6 place-items-center rounded text-muted-foreground/60 transition-colors hover:bg-foreground/10 hover:text-foreground"
        >
          <ChevronLeft className="size-3.5" />
        </button>
        <button
          type="button"
          aria-label="Next"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => step(1)}
          className="grid size-6 place-items-center rounded text-muted-foreground/60 transition-colors hover:bg-foreground/10 hover:text-foreground"
        >
          <ChevronRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
