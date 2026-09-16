import { motion, useMotionValue } from 'framer-motion';
import type { ReactNode } from 'react';
import { ICON_SNAP } from '@/desktop/config/layout';
import type { Point } from '@/desktop/types';
import { cn } from '@/lib/utils';

const snap = (n: number) => Math.round(n / ICON_SNAP) * ICON_SNAP;

interface Props {
  position: Point;
  onDragEnd: (x: number, y: number) => void;
  draggable: boolean;
  label: string;
  className?: string;
  children: ReactNode;
}

/**
 * A panel that lives on the desktop rather than in a window: glass, draggable
 * by its whole surface, never on top of a window. Same position mechanism as
 * the folders — left/top holds the truth, the gesture only writes a transform.
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

  return (
    <motion.section
      aria-label={label}
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
        draggable && 'cursor-grab active:cursor-grabbing',
        className,
      )}
    >
      {children}
    </motion.section>
  );
}
