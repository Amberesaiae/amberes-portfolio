import { motion, useMotionValue } from 'framer-motion';
import { useRef } from 'react';
import { ICON_SNAP } from '@/desktop/config/layout';
import type { Point, WindowDef } from '@/desktop/types';
import { cn } from '@/lib/utils';
import { FolderGlyph } from './FolderGlyph';

const MOVED = 4; // px of travel before a press counts as a drag, not a click
const snap = (n: number) => Math.round(n / ICON_SNAP) * ICON_SNAP;

interface Props {
  def: WindowDef;
  position: Point;
  selected: boolean;
  /** this folder's window is open */
  active: boolean;
  draggable: boolean;
  /** touch layout: one tap opens, because there is no double-click there */
  openOnSingleClick: boolean;
  onSelect: () => void;
  onOpen: () => void;
  onDragEnd: (x: number, y: number) => void;
  /** lets the layer switch the gooey filter on only while a drag is live */
  onDragStateChange?: (dragging: boolean) => void;
}

export function FolderIcon({
  def,
  position,
  selected,
  active,
  draggable,
  openOnSingleClick,
  onSelect,
  onOpen,
  onDragEnd,
  onDragStateChange,
}: Props) {
  /* Position lives in left/top; the gesture only ever writes the transform,
     which is zeroed once the new left/top is committed. Letting framer own both
     makes them fight. */
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const dragged = useRef(false);

  const open = () => {
    if (!dragged.current) onOpen();
  };

  return (
    <motion.button
      type="button"
      drag={draggable}
      dragMomentum={false}
      dragElastic={0}
      style={
        draggable
          ? { x, y, left: position.x, top: position.y, position: 'absolute' }
          : { x, y, position: 'relative' }
      }
      onDragStart={() => {
        dragged.current = true;
        onDragStateChange?.(true);
      }}
      onDragEnd={(_, info) => {
        onDragStateChange?.(false);
        onDragEnd(snap(position.x + info.offset.x), snap(position.y + info.offset.y));
        x.set(0);
        y.set(0);
        // Swallow the click that ends a real drag; let a pure click through.
        if (Math.hypot(info.offset.x, info.offset.y) < MOVED) dragged.current = false;
        else setTimeout(() => (dragged.current = false), 0);
      }}
      onClick={(e) => {
        if (e.detail === 0) return; // keyboard activation — see onKeyDown
        if (openOnSingleClick || e.detail >= 2) open();
        else onSelect();
      }}
      onPointerUp={(e) => {
        // A touch on a pointer-layout device (tablet) still opens on one tap.
        if (!openOnSingleClick && e.pointerType === 'touch') open();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      aria-label={`${def.title} — ${def.hint}`}
      className={cn(
        'group flex w-24 cursor-pointer flex-col items-center gap-3 rounded-xl px-2 py-2.5',
        'text-center outline-none transition-colors',
        selected ? 'bg-white/15 backdrop-blur-sm' : 'hover:bg-white/10',
      )}
    >
      <FolderGlyph def={def} active={active} />
      <span className="type-label on-video">{def.title}</span>
    </motion.button>
  );
}
