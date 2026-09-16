import { Suspense, type ComponentType } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PaneLoader } from '@/desktop/effects/PaneLoader';
import type { PaneProps } from '@/desktop/config/panes';
import type { ViewMode } from '@/desktop/config/views';

/**
 * Wraps a lazy pane in its loading state and, unless the pane manages its own
 * scrolling (the reel and the terminal fill the frame), a styled scroll area.
 */
export function PaneShell({
  Pane,
  arg,
  view,
  scroll,
}: {
  Pane: ComponentType<PaneProps>;
  arg?: string;
  view?: ViewMode;
  scroll: boolean;
}) {
  const body = (
    <Suspense fallback={<PaneLoader />}>
      <Pane arg={arg} view={view} />
    </Suspense>
  );

  if (!scroll) return <div className="min-h-0 flex-1">{body}</div>;
  return <ScrollArea className="min-h-0 flex-1">{body}</ScrollArea>;
}
