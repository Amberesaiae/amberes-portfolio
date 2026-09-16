import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * The type scale, as components. Six steps, defined once in index.css; call
 * sites choose a step rather than inventing a font-size, which is what keeps
 * the whole interface on one grid.
 */
interface TextProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

function make(step: string, defaultTag: ElementType, extra = '') {
  return function Component({ as, className, children, ...rest }: TextProps) {
    const Tag = as ?? defaultTag;
    return (
      <Tag className={cn(step, extra, className)} {...rest}>
        {children}
      </Tag>
    );
  };
}

/** Window-level headings. One per pane at most. */
export const Display = make('type-display', 'h2', 'text-foreground');

/** Section and row headings. */
export const Title = make('type-title', 'h3', 'text-foreground');

/** Running prose. Capped at a readable measure by default. */
export const Body = make('type-body', 'p', 'text-foreground/80 measure');

/** Secondary prose — descriptions, captions. */
export const Small = make('type-small', 'p', 'text-muted-foreground measure');

/** Mono, uppercase, wide. Eyebrows, metadata, the chrome. */
export const Label = make('type-label', 'span', 'text-muted-foreground');

/** Mono at reading size. Values, timestamps, counts. */
export const Mono = make('type-mono', 'span', 'text-muted-foreground');
