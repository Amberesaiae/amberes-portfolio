import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type BeamSize = 'sm' | 'md' | 'lg';
type BeamColor = 'sunset' | 'mono';

interface BorderBeamProps {
  size?: BeamSize;
  colorVariant?: BeamColor;
  theme?: 'light' | 'dark';
  active?: boolean;
  duration?: number;
  /** opacity of the travelling highlight */
  strength?: number;
  /** glow multiplier on the highlight */
  brightness?: number;
  borderRadius?: number;
  className?: string;
  children?: ReactNode;
}

const THICKNESS: Record<BeamSize, number> = { sm: 1, md: 1.5, lg: 2 };

/**
 * Travelling highlight around a rounded frame, CSS only.
 *
 * Local replacement for the unresolvable 'border-beam' import: a conic
 * gradient layer masked to the border band, rotating via @property
 * --beam-angle (see index.css). Inert overlay — no positioning, dragging or
 * hit-testing interference. Renders nothing when not active.
 */
export function BorderBeam({
  size = 'md',
  colorVariant = 'sunset',
  theme = 'dark',
  active = true,
  duration = 4,
  strength = 0.85,
  brightness = 1.35,
  borderRadius = 12,
  className,
  children,
}: BorderBeamProps) {
  if (!active) return <>{children}</>;

  const gradient =
    colorVariant === 'sunset'
      ? 'conic-gradient(from var(--beam-angle, 0deg), transparent 0deg, hsl(18 95% 58% / 0.95) 55deg, hsl(38 100% 66% / 0.95) 85deg, transparent 140deg)'
      : 'conic-gradient(from var(--beam-angle, 0deg), transparent 0deg, hsl(0 0% 100% / 0.9) 70deg, transparent 140deg)';

  const beam = {
    background: gradient,
    opacity: theme === 'light' ? Math.min(1, strength * 0.8) : strength,
    filter: `saturate(${brightness}) drop-shadow(0 0 6px hsl(20 95% 55% / 0.55))`,
    animation: `beam-rotate ${duration}s linear infinite`,
    padding: THICKNESS[size],
    borderRadius,
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
  } satisfies CSSProperties;

  return (
    <div className={cn('relative', className)} style={{ borderRadius }}>
      {children}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ borderRadius }}>
        <div className="size-full" style={beam} />
      </div>
    </div>
  );
}
