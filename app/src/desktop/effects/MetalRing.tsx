import { Suspense, lazy, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useEffectsEnabled } from './useEffectsEnabled';

/**
 * A chrome ring around whatever it wraps.
 *
 * `metal-fx` from libraries.dev — the real-time shader, not the rotating conic
 * gradient that stood in for it. The stand-in's comment argued a second GL
 * context was not worth it next to the background video; that video is gone
 * now, so the argument went with it.
 *
 * Lazy for the same reason as the shimmer: a shader belongs in its own chunk,
 * not in the bundle that paints the first screen.
 */
const MetalFx = lazy(() => import('metal-fx').then((m) => ({ default: m.MetalFx })));

export function MetalRing({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { heavy } = useEffectsEnabled();
  const bare = <span className={cn('block', className)}>{children}</span>;
  if (!heavy) return bare;

  return (
    <Suspense fallback={bare}>
      <MetalFx theme="auto" strength={0.9} borderRadius={999} className={cn('block', className)}>
        {children}
      </MetalFx>
    </Suspense>
  );
}
