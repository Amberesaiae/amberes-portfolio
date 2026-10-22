import { forwardRef, type ComponentPropsWithoutRef, type PointerEvent, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Props extends Omit<ComponentPropsWithoutRef<'div'>, 'title' | 'onPointerDown'> {
  title: string;
  /** the dialog names itself from this heading */
  titleId: string;
  focused: boolean;
  draggable: boolean;
  onPointerDown: (e: PointerEvent) => void;
  onDoubleClick: () => void;
  /** pushed to the right end — the view toggle, when the window has one */
  trailing?: ReactNode;
  children: ReactNode;
}

/**
 * Forwards its ref because the context menu wraps it with `asChild` — Radix
 * needs a real element to anchor to, not a component that swallows the ref.
 */
export const WindowTitleBar = forwardRef<HTMLDivElement, Props>(function WindowTitleBar(
  { title, titleId, focused, draggable, onPointerDown, onDoubleClick, trailing, children, ...rest },
  ref,
) {
  return (
    /*
     * A div, not a header. A header outside sectioning content is a banner,
     * and this bar sits inside a dialog — a second banner on every window.
     * The title is the window's h2, styled as the same label it always was.
     */
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onDoubleClick={onDoubleClick}
      className={cn(
        'flex shrink-0 items-center gap-3 border-b border-border px-3 py-2.5',
        draggable && 'cursor-grab active:cursor-grabbing',
        focused ? 'bg-foreground/[0.05]' : 'bg-transparent',
      )}
      {...rest}
    >
      {children}
      <h2
        id={titleId}
        className={cn(
          'type-label select-none',
          focused ? 'text-foreground/85' : 'text-muted-foreground',
        )}
      >
        {title}
      </h2>
      {trailing && <div className="ml-auto">{trailing}</div>}
    </div>
  );
});
