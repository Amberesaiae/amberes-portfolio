import { Suspense, type ComponentType } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PaneLoader } from '@/desktop/effects/PaneLoader';
import { PaneReveal } from '@/desktop/effects/PaneReveal';
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
  decode = true,
}: {
  Pane: ComponentType<PaneProps>;
  arg?: string;
  view?: ViewMode;
  scroll: boolean;
  /** False for the terminal, whose DOM xterm has to own. */
  decode?: boolean;
}) {
  const body = (
    <Suspense fallback={<PaneLoader />}>
      <PaneReveal enabled={decode} fill={!scroll}>
        <Pane arg={arg} view={view} />
      </PaneReveal>
    </Suspense>
  );

  // No-scroll panes (chat, reel, terminal, games) fill the frame and scroll
  // internally. The flex column bounds their height so flex-1 children and
  // sticky footers resolve against something definite; a plain block wrapper
  // lets percentage heights go auto and the whole pane scrolls past instead.
  if (!scroll) return <div className="flex min-h-0 flex-1 flex-col">{body}</div>;
  return <ScrollArea className="min-h-0 flex-1">{body}</ScrollArea>;
}
