import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

export type OrbState = 'breathing' | 'working' | 'listening';

interface ThinkingOrbProps {
  state?: OrbState;
  /** intrinsic pixel size; overridden by style width/height when given */
  size?: number;
  theme?: 'auto' | 'light' | 'dark';
  /** animation speed multiplier */
  speed?: number;
  style?: CSSProperties;
  className?: string;
}

const ANIMATION: Record<OrbState, string> = {
  breathing: 'orb-breathe',
  working: 'orb-work',
  listening: 'orb-listen',
};

const BASE_DURATION: Record<OrbState, number> = {
  breathing: 3.2,
  working: 1.1,
  listening: 1.6,
};

/**
 * The assistant's face: a small glowing orb, CSS only.
 *
 * Local replacement for the unresolvable 'thinking-orbs' import. Reads its
 * colours from the theme tokens on <html data-theme> (see useTheme), so no
 * theme prop needs threading. States: breathing (idle), working (thinking),
 * listening (mic live). Honours the effect budget via the call-site fallbacks.
 */
export function ThinkingOrb({
  state = 'breathing',
  size = 64,
  theme = 'auto',
  speed = 1,
  style,
  className,
}: ThinkingOrbProps) {
  const { width, height, ...rest } = style ?? {};
  const dimension = width ?? size;

  const orb: CSSProperties = {
    width: dimension,
    height: height ?? dimension,
    borderRadius: '9999px',
    background:
      theme === 'light'
        ? 'radial-gradient(circle at 35% 30%, hsl(38 100% 72%), hsl(18 90% 55%) 55%, hsl(18 85% 40% / 0.9))'
        : 'radial-gradient(circle at 35% 30%, hsl(40 100% 70% / 0.95), hsl(20 95% 55% / 0.9) 55%, hsl(16 90% 42% / 0.55))',
    filter: 'blur(0.5px) saturate(1.2)',
    boxShadow:
      '0 0 12px hsl(20 95% 55% / 0.55), 0 0 32px hsl(20 95% 50% / 0.25), inset -2px -3px 8px hsl(0 0% 0% / 0.35)',
    animation: `${ANIMATION[state]} ${BASE_DURATION[state] / Math.max(speed, 0.1)}s ease-in-out infinite`,
    ...rest,
  };

  return (
    <span
      role="presentation"
      className={cn('inline-block shrink-0', className)}
      style={{ width: dimension, height: height ?? dimension }}
    >
      <span className="block size-full" style={orb} />
    </span>
  );
}
