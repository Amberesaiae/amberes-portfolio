import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Consistent padding for every pane. One place to change the rhythm. */
export function PaneBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('px-6 py-6 sm:px-8 sm:py-7', className)}>{children}</div>;
}
