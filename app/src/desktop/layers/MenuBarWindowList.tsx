import { WINDOW_DEFS, WINDOW_ORDER } from '@/desktop/config/windows';
import { useDesktop, useDesktopDispatch } from '@/desktop/providers/windowStore';
import { cn } from '@/lib/utils';

/** Open windows, including minimised ones — this is where they go to wait. */
export function MenuBarWindowList() {
  const { windows, focused } = useDesktop();
  const dispatch = useDesktopDispatch();

  const open = WINDOW_ORDER.filter((id) => windows[id].open);

  return (
    <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto scrollbar-none">
      {open.map((id) => {
        const win = windows[id];
        const active = focused === id && !win.minimized;
        return (
          <button
            key={id}
            type="button"
            onClick={() => dispatch({ type: 'focus', id })}
            className={cn(
              'type-label shrink-0 rounded-md px-2.5 py-1 transition-colors',
              active
                ? 'bg-white/15 text-foreground'
                : 'text-muted-foreground hover:bg-white/10 hover:text-foreground/85',
              win.minimized && 'opacity-55',
            )}
          >
            {WINDOW_DEFS[id].title}
          </button>
        );
      })}
    </nav>
  );
}
