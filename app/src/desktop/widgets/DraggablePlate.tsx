import { useCallback, useLayoutEffect, useRef, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { GripHorizontal } from 'lucide-react';
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
 * A panel that lives on the desktop rather than in a window.
 *
 * It has a grab bar, and that is the fix for a real problem: the whole surface
 * used to be the drag target, but every control inside it — the work rows, the
 * gallery arrows, the film cards — stopped the pointer event so their clicks
 * would land. The result was a plate you could only move by finding the few
 * pixels of padding none of them covered. Which is to say: not movable.
 *
 * So the drag target is explicit. The body never starts a drag from a control,
 * and the bar is just the visible hint. The bar appears on hover or focus so
 * five of these do not read as a row of tool palettes at rest.
 *
 * Keyboard still moves it without touching the bar — WCAG 2.1.1 does not care
 * how pretty the handle is.
 *
 * The drag is pointer events, not a motion library. The plate is on the first
 * screen, and pulling an animation runtime in just to translate it was on the
 * mobile critical path.
 */
export function DraggablePlate({
  position,
  onDragEnd,
  draggable,
  label,
  className,
  children,
}: Props) {
  const el = useRef<HTMLElement>(null);
  const drag = useRef<{ id: number; x: number; y: number } | null>(null);

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

  // Drop the in-flight translate once left/top have caught up, before paint,
  // so the plate does not flash back to where it started.
  useLayoutEffect(() => {
    if (el.current) el.current.style.transform = '';
  }, [position.x, position.y]);

  /**
   * Grab the card anywhere that is not a control.
   *
   * The handle alone would work, but a plate you can only move by its bar is
   * still a plate you have to aim at. Everything interactive inside already
   * stops pointer-down so its own click lands, which means anything that
   * reaches here is dead space — the picture, the padding, a heading — and is
   * safe to treat as the grab surface. The closest() check covers the controls
   * that do not stop propagation.
   */
  const begin = (e: PointerEvent<HTMLElement>) => {
    if (!draggable || e.button !== 0) return;
    const target = e.target as HTMLElement | null;
    if (target?.closest('button, a, input, textarea, select, [role="button"], [contenteditable]')) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
  };

  const move = (e: PointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId || !el.current) return;
    const x = e.clientX - d.x;
    const y = e.clientY - d.y;
    el.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const end = (e: PointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId || !el.current) return;
    drag.current = null;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    const nx = snap(position.x + dx);
    const ny = snap(position.y + dy);
    el.current.style.transform = `translate3d(${nx - position.x}px, ${ny - position.y}px, 0)`;
    onDragEnd(nx, ny);
  };

  return (
    <section
      ref={el}
      aria-label={draggable ? `${label} — drag the bar, or use arrow keys` : label}
      tabIndex={draggable ? 0 : undefined}
      onKeyDown={draggable ? onKeyDown : undefined}
      onPointerDown={draggable ? begin : undefined}
      onPointerMove={draggable ? move : undefined}
      onPointerUp={draggable ? end : undefined}
      onPointerCancel={draggable ? end : undefined}
      style={
        draggable
          ? { left: position.x, top: position.y, position: 'absolute', touchAction: 'none' }
          : { position: 'relative' }
      }
      className={cn(
        'group/plate z-10 rounded-xl border border-white/10 bg-glass backdrop-blur-xl',
        'shadow-window-idle',
        draggable && 'cursor-grab active:cursor-grabbing',
        // Stacked on a phone, a plate whose content is wider than the screen
        // widens the whole document and every section scrolls sideways.
        !draggable && 'w-full max-w-[calc(100vw-2rem)]',
        className,
      )}
    >
      {draggable && (
        <span
          aria-hidden="true"
          className={cn(
            'absolute inset-x-0 -top-1 z-20 flex h-5 cursor-grab items-center justify-center',
            'opacity-0 transition-opacity duration-150 active:cursor-grabbing',
            'group-hover/plate:opacity-100 group-focus-within/plate:opacity-100',
          )}
        >
          <GripHorizontal className="size-4 text-foreground/45" />
        </span>
      )}
      {children}
    </section>
  );
}
