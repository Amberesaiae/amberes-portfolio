import type { ReactNode } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { useDesktopDispatch } from '@/desktop/providers/windowStore';
import type { WindowId } from '@/desktop/types';

interface Props {
  id: WindowId;
  maximized: boolean;
  children: ReactNode;
}

/** Right-click a title bar. Same three things the traffic lights do, named. */
export function WindowContextMenu({ id, maximized, children }: Props) {
  const dispatch = useDesktopDispatch();

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>

      <ContextMenuContent className="w-48">
        <ContextMenuItem onSelect={() => dispatch({ type: 'minimize', id })}>
          Minimise
        </ContextMenuItem>
        <ContextMenuItem onSelect={() => dispatch({ type: 'toggleMaximize', id })}>
          {maximized ? 'Restore' : 'Maximise'}
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onSelect={() => dispatch({ type: 'close', id })}>
          Close
          <ContextMenuShortcut>Esc</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
