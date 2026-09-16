import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Label } from './Text';

/** A labelled divider that opens a section inside a pane. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('mb-4 flex items-center gap-3', className)}>
      <Label className="shrink-0 text-muted-foreground/70">{children}</Label>
      <span className="h-px flex-1 bg-border" aria-hidden="true" />
    </div>
  );
}
