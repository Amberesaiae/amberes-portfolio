import { cn } from '@/lib/utils';
import { useEffectsEnabled } from './useEffectsEnabled';

/**
 * The scan that runs across an image slot before its picture exists.
 *
 * Borrowed from the generation-loader idea — a band sweeping a latent field —
 * but drawn as two gradients rather than a WebGL pass, since the job here is to
 * hold a shape, not to render one.
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
