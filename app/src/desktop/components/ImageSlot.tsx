import { useState } from 'react';
import { ImageIcon } from 'lucide-react';
import { GenerationShimmer } from '@/desktop/effects/GenerationShimmer';
import { Label } from '@/desktop/typography/Text';
import { cn } from '@/lib/utils';

/**
 * Widths every image in public/images/optimized is guaranteed to have.
 *
 * The repo's own script emits more for some pictures (768, 1024, 1280) but only
 * 320 and 640 for the smaller originals — and a candidate that 404s makes the
 * browser abandon that whole <source>, losing avif or webp entirely. Two safe
 * widths covers every slot on this site at 3x, and `widths` is there for the
 * few places that know bigger variants exist.
 */
const DEFAULT_WIDTHS = [320, 640];

interface Props {
  /** when absent, the slot stays a placeholder — the layout is already correct */
  src?: string;
  alt?: string;
  /** short caption shown inside an empty slot, e.g. "Portrait" or "01" */
  hint?: string;
  className?: string;
  ratio?: string;
  /** how much of the viewport this image occupies, for srcset selection */
  sizes?: string;
  /** override when larger generated variants are known to exist */
  widths?: number[];
}

/**
 * An image that may not exist yet.
 *
 * Every picture on the site goes through here, so the box, the ratio and the
 * rhythm are reserved whether or not a file is there, and a missing or broken
 * one degrades to the placeholder rather than to a torn layout.
 *
 * When the source lives in /images, this also reaches for the avif and webp
 * variants the repo's own optimisation script already generates — they were
 * sitting in public/images/optimized unused. A variant that is missing simply
 * fails its candidate and the browser falls through to the original file.
 */
export function ImageSlot({
  src,
  alt = '',
  hint,
  className,
  ratio = '16 / 10',
  sizes = '(max-width: 768px) 90vw, 320px',
  widths = DEFAULT_WIDTHS,
}: Props) {
  const [failed, setFailed] = useState(false);
  const empty = !src || failed;
  const variants = src && !failed ? optimizedSources(src, widths) : null;

  return (
    <div
      className={cn('relative overflow-hidden rounded-lg border border-border bg-muted/40', className)}
      style={{ aspectRatio: ratio }}
    >
      {empty ? (
        <>
          <GenerationShimmer />
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-subtle-foreground">
            <ImageIcon className="size-4" />
            {hint && <Label className="text-[9px] text-subtle-foreground">{hint}</Label>}
          </span>
        </>
      ) : (
        <picture>
          {variants && <source type="image/avif" srcSet={variants.avif} sizes={sizes} />}
          {variants && <source type="image/webp" srcSet={variants.webp} sizes={sizes} />}
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            className="size-full object-cover"
          />
        </picture>
      )}
    </div>
  );
}

/**
 * `/images/portrait.png` -> srcsets pointing at
 * `/images/optimized/portrait-{320,640,768,1024}.{avif,webp}`.
 * Returns null for anything outside /images, which has no generated variants.
 */
function optimizedSources(src: string, widths: number[]) {
  const match = /^\/images\/([^/]+)\.[a-z0-9]+$/i.exec(src);
  if (!match) return null;

  const base = match[1];
  const set = (ext: string) =>
    widths.map((w) => `/images/optimized/${base}-${w}.${ext} ${w}w`).join(', ');

  return { avif: set('avif'), webp: set('webp') };
}
