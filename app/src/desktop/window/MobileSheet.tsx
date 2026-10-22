import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ReactNode } from 'react';
import { useVisualViewportHeight } from './useVisualViewportHeight';

interface Props {
  title: string;
  /** the dialog names itself from this heading */
  titleId: string;
  onClose: () => void;
  trailing?: ReactNode;
  children: ReactNode;
}

/**
 * The mobile form of a window: a full-screen sheet. Dragging and resizing are
 * removed rather than approximated badly on a 390px screen.
 */
export function MobileSheet({ title, titleId, onClose, trailing, children }: Props) {
  useVisualViewportHeight();
  return (
    <motion.section
      role="dialog"
      aria-labelledby={titleId}
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 380, damping: 38 }}
      className="fixed inset-x-0 top-0 z-[1100] flex flex-col bg-background/95 backdrop-blur-2xl"
      style={{ height: 'var(--vv-h, 100dvh)', paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      {/* Same reason as the desktop title bar: a header here is a second banner. */}
      <div className="flex shrink-0 items-center gap-2 border-b border-border px-3 py-2.5">
        <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Back to desktop">
          <ChevronLeft />
        </Button>
        <h2 id={titleId} className="type-label text-foreground/80">
          {title}
        </h2>
        {trailing && <div className="ml-auto">{trailing}</div>}
      </div>
      {/* Flex column (not a plain block) so the pane wrapper's flex-1 resolves
        to a bounded height: every min-h-full / flex-1 below it then fills the
        frame instead of sizing to content, and footers land on the fold. */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">{children}</div>
    </motion.section>
  );
}
