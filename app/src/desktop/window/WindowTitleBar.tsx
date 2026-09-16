import { forwardRef, type ComponentPropsWithoutRef, type PointerEvent, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/desktop/typography/Text';

interface Props extends Omit<ComponentPropsWithoutRef<'header'>, 'title' | 'onPointerDown'> {
  title: string;
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
export const WindowTitleBar = forwardRef<HTMLElement, Props>(function WindowTitleBar(
  { title, focused, draggable, onPointerDown, onDoubleClick, trailing, children, ...rest },
  ref,
) {
  return (
    <header
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
      <Label className={cn('select-none', focused ? 'text-foreground/85' : 'text-foreground/40')}>
        {title}
      </Label>
      {trailing && <div className="ml-auto">{trailing}</div>}
    </header>
  );
});
