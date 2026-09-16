import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * The grid every "grid view" uses.
 *
 * Columns key off the *container*, not the viewport — a window can be dragged
 * narrow on a wide screen, so a media query would be answering the wrong
 * question. `@container` does the right one.
 */
export function CardGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="@container">
      <ul
        className={cn(
          'grid grid-cols-1 gap-3 @[560px]:grid-cols-2 @[860px]:grid-cols-3',
          className,
        )}
      >
        {children}
      </ul>
    </div>
  );
}
