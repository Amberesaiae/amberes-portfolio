import { WINDOW_DEFS, WINDOW_ORDER } from '@/desktop/config/windows';
import { useDesktop, useDesktopDispatch } from '@/desktop/providers/windowStore';
import { DockItem } from './DockItem';

/**
 * The navigation, in one place at the bottom.
 *
 * It replaces the folders that used to be scattered across the desktop. That
 * change buys three things: the wallpaper is clear again (which matters now
 * that a film can be playing on it), the same control works on a phone without
 * a separate grid, and nothing has to be dragged out of the way to see what is
 * behind it.
 */
export function Dock() {
  const { windows, focused } = useDesktop();
  const dispatch = useDesktopDispatch();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center pb-[max(12px,env(safe-area-inset-bottom))]">
      <nav
        aria-label="Folders"
        className="pointer-events-auto flex max-w-[calc(100vw-16px)] items-end gap-1 overflow-x-auto rounded-2xl border border-border bg-glass px-2 py-1.5 shadow-window-idle backdrop-blur-xl scrollbar-none"
      >
        {WINDOW_ORDER.map((id) => (
          <DockItem
            key={id}
            def={WINDOW_DEFS[id]}
            running={windows[id].open}
            focused={focused === id && !windows[id].minimized}
            onOpen={() => dispatch({ type: 'open', id })}
          />
        ))}
      </nav>
    </div>
  );
}
