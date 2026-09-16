import {
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from '@/components/ui/context-menu';
import { WINDOW_DEFS, WINDOW_ORDER } from '@/desktop/config/windows';
import { useDesktopDispatch } from '@/desktop/providers/windowStore';

/** Every folder, for anyone who has not worked out that the dock is the menu. */
export function OpenSubmenu() {
  const dispatch = useDesktopDispatch();

  return (
    <ContextMenuSub>
      <ContextMenuSubTrigger>Open</ContextMenuSubTrigger>
      <ContextMenuSubContent className="w-44">
        {WINDOW_ORDER.map((id) => (
          <ContextMenuItem key={id} onSelect={() => dispatch({ type: 'open', id })}>
            {WINDOW_DEFS[id].title}
          </ContextMenuItem>
        ))}
      </ContextMenuSubContent>
    </ContextMenuSub>
  );
}
