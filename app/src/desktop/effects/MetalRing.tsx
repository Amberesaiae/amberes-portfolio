import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useEffectsEnabled } from './useEffectsEnabled';

/**
 * A chrome ring, drawn as a slowly rotating conic gradient rather than a WebGL
 * context.
 *
 * The idea is worth having — polished metal against a video of a plastic
 * handheld in a flower field is real material contrast — but a second GL
 * context next to the background video is not a trade worth making on a phone.
 * A conic gradient with a few hard stops reads as chrome and costs a compositor
 * layer.
 */
export function MetalRing({
  children,
  className,
  spinning = true,
}: {
  children: ReactNode;
  className?: string;
  spinning?: boolean;
}) {
  const { light } = useEffectsEnabled();

  return (
    <span className={cn('relative inline-grid place-items-center', className)}>
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-0 rounded-full p-[1.5px]',
          light && spinning && 'animate-[metal-spin_6s_linear_infinite]',
        )}
        style={{
          background:
            'conic-gradient(from 0deg, #f4f7fa 0deg, #8b97a3 38deg, #ffffff 74deg, #5d6874 120deg, #e8edf2 168deg, #7b8794 212deg, #ffffff 260deg, #6b7681 310deg, #f4f7fa 360deg)',
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
      {children}
    </span>
  );
}
