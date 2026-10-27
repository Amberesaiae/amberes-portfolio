import { useLayoutEffect, useRef, useState } from 'react';
import { ImageIcon } from 'lucide-react';
import { useAsciiModule } from '@/desktop/effects/useAsciiModule';
import { useSaveData } from '@/desktop/effects/useSaveData';
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
  /** null fills the parent instead of reserving an aspect ratio */
  ratio?: string | null;
  /** how much of the viewport this image occupies, for srcset selection */
  sizes?: string;
  /** override when larger generated variants are known to exist */
  widths?: number[];
  /**
   * paint: a glyph field while the file is in flight, then the picture on the
   * frame the browser decodes it. First-screen slots use this so the decode
   * wave cannot hold LCP.
   * decode: the same field, then the picture resolves through the glyph grid.
   * For panes and later gallery slides — never the first paint.
   */
  reveal?: 'paint' | 'decode';
  /** Still glyphs, no shimmer canvas. Rows of tiny thumbnails, and the first picture. */
  still?: boolean;
  /**
   * The picture that can be the largest paint. It is requested immediately
   * and the glyph field waits for an idle turn, so the effect cannot hold LCP.
   */
  priority?: boolean;
}

/**
 * An image that may not exist yet.
 *
 * Every picture on the site goes through here, so the box, the ratio and the
 * rhythm are reserved whether or not a file is there, and a missing or broken
 * one degrades to the placeholder rather than to a torn layout.
 *
 * While a file is in flight the box holds an ASCII field (ascii-reveal's
 * skeleton) instead of a gray pulse. Slots that are not on the first screen
 * then decode the bitmap in its own colors. The field is skipped by any pane
 * wave around it — `data-ascii="skip"` — so a photo is not scrambled twice.
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
  reveal = 'paint',
  still = false,
  priority = false,
}: Props) {
  const thin = useSaveData();
  const imgRef = useRef<HTMLImageElement>(null);
  const [hold, setHold] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const emptySoon = !src || failed;
  // Paint-mode slots (the first screen) wait for an idle turn. A pane's
  // pictures and empty frames load the field with the pane, not before it.
  const ascii = useAsciiModule(emptySoon || hold || reveal === 'decode', reveal === 'paint' && !emptySoon);
  const seed = seedFrom(src || hint || 'slot');
  const empty = !src || failed;

  // Cached bitmaps are already decodable on the commit that mounts them.
  // Deciding before paint means a warm image never flashes a glyph field,
  // and an uncached one never paints a blank frame first. `hold` stays up
  // after the file arrives so the decode wave keeps the same canvas.
  useLayoutEffect(() => {
    const img = imgRef.current;
    if (!src || !img) {
      setHold(false);
      setReady(false);
      return;
    }
    if (img.complete && img.naturalWidth > 0) {
      setFailed(false);
      setHold(false);
      setReady(true);
      return;
    }
    setReady(false);
    if (img.complete && img.naturalWidth === 0) {
      setFailed(true);
      setHold(false);
      return;
    }
    setFailed(false);
    setHold(true);
  }, [src]);

  const frame = cn(
    'ascii-frame relative overflow-hidden rounded-lg border border-border bg-muted/40',
    className,
  );
  const frameStyle = ratio ? { aspectRatio: ratio } : undefined;

  if (empty) {
    return (
      <div className={frame} style={frameStyle} data-ascii="skip">
        <SlotField seed={seed} still={still || thin} />
        <span className="absolute inset-0 z-[1] flex flex-col items-center justify-center gap-1.5 text-subtle-foreground">
          <ImageIcon className="size-4" />
          {hint && <Label className="text-[9px] text-subtle-foreground">{hint}</Label>}
        </span>
      </div>
    );
  }

  const showField = hold && !ready && !!ascii;
  const liveDecode = reveal === 'decode' && hold && !thin && !!ascii;
  const variants = optimizedSources(src, widths);

  const picture = (
    <picture className="block size-full">
      {variants && <source type="image/avif" srcSet={variants.avif} sizes={sizes} />}
      {variants && <source type="image/webp" srcSet={variants.webp} sizes={sizes} />}
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          onLoad={() => setReady(true)}
          onError={() => setFailed(true)}
          className="size-full object-cover"
        />
    </picture>
  );

  const field = showField ? <SlotField seed={seed} still={still || thin} className="absolute inset-0" /> : null;

  return (
    <div className={frame} style={frameStyle} data-ascii="skip">
      {liveDecode && ascii ? (
        <ascii.AsciiReveal
          loading={!ready}
          preset="dither"
          duration="fast"
          revealOnMount={false}
          lazy={false}
          shimmer={false}
          className="size-full"
        >
          {picture}
          {field}
        </ascii.AsciiReveal>
      ) : (
        <>
          {picture}
          {field}
        </>
      )}
    </div>
  );
}

function SlotField({ seed, still, className }: { seed: number; still: boolean; className?: string }) {
  const ascii = useAsciiModule(true, false);
  if (!ascii) return null;
  const Field = ascii.AsciiSkeleton;
  return (
    <Field
      variant="terminal"
      rows={8}
      width="100%"
      height="100%"
      seed={seed}
      animate={!still}
      className={cn('pointer-events-none absolute inset-0', className)}
    />
  );
}

function seedFrom(value: string) {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % 997 || 1;
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
