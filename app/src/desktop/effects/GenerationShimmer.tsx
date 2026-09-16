import { cn } from '@/lib/utils';
import { useEffectsEnabled } from './useEffectsEnabled';

/**
 * The scan that runs across an image slot before its picture exists.
 *
 * Deliberately NOT img-fx. That library is a generation loader — a 591 KB
 * three.js scene built for AI image-gen UX, with an images pool and a reveal
 * cycle. A placeholder visible for milliseconds while a cached picture loads
 * does not need a WebGL context, and mounting one per slot meant every
 * visitor downloaded the shader chunk on first paint whether any image was
 * waiting or not. Two gradients hold the shape for essentially free; when a
 * surface actually generates imagery, img-fx is one import away.
 */
export function GenerationShimmer({ className }: { className?: string }) {
  const { light } = useEffectsEnabled();

  return (
    <span
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      {/* the latent field */}
      <span
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            'repeating-linear-gradient(115deg, hsl(var(--muted)) 0 2px, transparent 2px 7px)',
        }}
      />
      {/* the scanning band */}
      {light && (
        <span
          className="absolute inset-y-0 -left-1/2 w-1/2 animate-[shimmer-sweep_2.8s_ease-in-out_infinite]"
          style={{
            background:
              'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.16), hsl(var(--foreground) / 0.10), transparent)',
          }}
        />
      )}
    </span>
  );
}
