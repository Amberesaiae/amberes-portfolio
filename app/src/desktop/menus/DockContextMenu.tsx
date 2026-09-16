import type { ReactNode } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { useDesktopDispatch } from '@/desktop/providers/windowStore';
import type { WindowDef } from '@/desktop/types';

interface Props {
  def: WindowDef;
  running: boolean;
  children: ReactNode;
}

/** Right-click a dock icon: the usual open / close, plus what it is. */
export function DockContextMenu({ def, running, children }: Props) {
  const dispatch = useDesktopDispatch();

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>

      <ContextMenuContent className="w-52">
        <ContextMenuLabel className="type-label text-subtle-foreground">
          {def.title}
        </ContextMenuLabel>
        <p className="type-small px-2 pb-1.5 text-muted-foreground">{def.hint}</p>

        <ContextMenuSeparator />

        <ContextMenuItem onSelect={() => dispatch({ type: 'open', id: def.id })}>
          {running ? 'Bring to front' : 'Open'}
        </ContextMenuItem>
        <ContextMenuItem
          disabled={!running}
          onSelect={() => dispatch({ type: 'minimize', id: def.id })}
        >
          Minimise
        </ContextMenuItem>
        <ContextMenuItem
          disabled={!running}
          onSelect={() => dispatch({ type: 'close', id: def.id })}
        >
          Close
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
