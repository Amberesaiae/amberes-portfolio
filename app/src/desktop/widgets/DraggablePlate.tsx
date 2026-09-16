import { motion, useMotionValue } from 'framer-motion';
import { useCallback, type KeyboardEvent, type ReactNode } from 'react';
import { ICON_SNAP } from '@/desktop/config/layout';
import type { Point } from '@/desktop/types';
import { cn } from '@/lib/utils';

const snap = (n: number) => Math.round(n / ICON_SNAP) * ICON_SNAP;

/** One arrow press nudges; holding Shift moves it a visible distance. */
const STEP = ICON_SNAP;
const BIG_STEP = ICON_SNAP * 8;

const KEYS: Record<string, Point> = {
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
};

interface Props {
  position: Point;
  onDragEnd: (x: number, y: number) => void;
  draggable: boolean;
  label: string;
  className?: string;
  children: ReactNode;
}

/**
 * A panel that lives on the desktop rather than in a window: glass, movable by
 * its whole surface, never on top of a window. left/top holds the truth, the
 * gesture only writes a transform.
 *
 * It is movable by keyboard as well as by pointer. Dragging was mouse-only,
 * which made arranging the desktop — the one thing this surface is *for* —
 * impossible without a pointer, and that is WCAG 2.1.1. Focus it and the arrow
 * keys move it; Shift moves it faster. The keys only act when the plate itself
 * has focus, so arrowing inside a gallery or a link list still does what it
 * should.
 */
export function DraggablePlate({
  position,
  onDragEnd,
  draggable,
  label,
  className,
  children,
}: Props) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      const dir = KEYS[e.key];
      if (!dir || e.target !== e.currentTarget) return;
      e.preventDefault();
      const step = e.shiftKey ? BIG_STEP : STEP;
      onDragEnd(snap(position.x + dir.x * step), snap(position.y + dir.y * step));
    },
    [onDragEnd, position.x, position.y],
  );

  return (
    <motion.section
      aria-label={draggable ? `${label} — arrow keys move this panel` : label}
      tabIndex={draggable ? 0 : undefined}
      onKeyDown={draggable ? onKeyDown : undefined}
      drag={draggable}
      dragMomentum={false}
      dragElastic={0}
      style={
        draggable
          ? { x, y, left: position.x, top: position.y, position: 'absolute' }
          : { position: 'relative' }
      }
      onDragEnd={(_, info) => {
        onDragEnd(snap(position.x + info.offset.x), snap(position.y + info.offset.y));
        x.set(0);
        y.set(0);
      }}
      className={cn(
        'z-10 rounded-xl border border-white/10 bg-glass backdrop-blur-xl',
        'shadow-window-idle',
        // Stacked on a phone, a plate whose content is wider than the screen
        // widens the whole document and every section scrolls sideways.
        !draggable && 'w-full max-w-[calc(100vw-2rem)]',
        draggable && 'cursor-grab active:cursor-grabbing',
        className,
      )}
    >
      {children}
    </motion.section>
  );
}
