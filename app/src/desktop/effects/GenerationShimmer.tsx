import { Suspense, lazy } from 'react';
import { useEffectsEnabled } from './useEffectsEnabled';
import { cn } from '@/lib/utils';

/**
 * The scan that runs across an image slot before its picture exists.
 *
 * This is `img-fx` — the real WebGL generation loader from libraries.dev, not
 * the two-gradient approximation that stood here. The stand-in was written to
 * avoid a GL context; the library ships one worth the cost, so it gets used as
 * published rather than imitated.
 *
 * It is loaded lazily, and that is not a nicety. `img-fx` takes three.js as a
 * peer dependency, and importing it directly put ~580 KB of WebGL into the
 * first chunk — the entry bundle went from 282 KB to 862 KB for a placeholder
 * that most visitors never see, because the pictures are cached. Behind
 * `lazy()` it becomes its own chunk, fetched only when a slot is actually
 * waiting on an image.
 *
 * Below the effect budget it never loads at all: the fallback is a tinted
 * panel, no shader, no canvas, nothing to schedule.
 */
const ImageGeneration = lazy(() =>
  import('img-fx').then((m) => ({ default: m.ImageGeneration })),
);

function Panel({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn('block size-full bg-foreground/[0.05]', className)} />
  );
}

export function GenerationShimmer({ className }: { className?: string }) {
  const { heavy } = useEffectsEnabled();

  if (!heavy) return <Panel className={className} />;

  return (
    <Suspense fallback={<Panel className={className} />}>
      <ImageGeneration
        aria-hidden="true"
        preset="pixels-organic"
        theme="auto"
        strength={0.85}
        className={cn('block size-full', className)}
      >
        <span className="block size-full bg-foreground/[0.04]" />
      </ImageGeneration>
    </Suspense>
  );
}
