import { useCallback, useEffect, useRef, useState } from 'react';
import { WINDOW_DEFS, WINDOW_ORDER } from '@/desktop/config/windows';
import { useDesktop, useDesktopDispatch } from '@/desktop/providers/windowStore';
import { cn } from '@/lib/utils';
import { DockItem } from './DockItem';

/**
 * The navigation, in one place at the bottom.
 *
 * It replaces the folders that used to be scattered across the desktop. That
 * change buys three things: the wallpaper is clear again (which matters now
 * that a film can be playing on it), the same control works on a phone without
 * a separate grid, and nothing has to be dragged out of the way to see what is
 * behind it.
 *
 * On a narrow screen the row scrolls. It always did, but silently: the seventh
 * folder sat past the right edge with nothing to say it was there, so on a
 * phone the Legal window was simply undiscoverable. The edge now fades while
 * there is more to reach, and stops fading at the end — the oldest affordance
 * there is for "keep going".
 */
export function Dock() {
  const { windows, focused } = useDesktop();
  const dispatch = useDesktopDispatch();
  const row = useRef<HTMLElement>(null);
  const [edges, setEdges] = useState({ start: false, end: false });

  const measure = useCallback(() => {
    const el = row.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setEdges({ start: el.scrollLeft > 4, end: max > 4 && el.scrollLeft < max - 4 });
  }, []);

  useEffect(() => {
    measure();
    const el = row.current;
    if (!el) return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center pb-[max(12px,env(safe-area-inset-bottom))] [transform:translateZ(0)]">
      <div
        className={cn(
          'pointer-events-auto relative max-w-[calc(100vw-16px)] rounded-2xl',
          'border border-border bg-glass shadow-window-idle backdrop-blur-xl',
        )}
      >
        <nav
          ref={row}
          aria-label="Folders"
          onScroll={measure}
          className="flex items-end gap-0.5 overflow-x-auto rounded-2xl px-1.5 py-1.5 scrollbar-none sm:gap-1 sm:px-2"
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

        {/* Inert: a hint, never something to tap. */}
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-y-0 left-0 w-8 rounded-l-2xl',
            'bg-gradient-to-r from-glass to-transparent transition-opacity duration-200',
            edges.start ? 'opacity-100' : 'opacity-0',
          )}
        />
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-y-0 right-0 w-8 rounded-r-2xl',
            'bg-gradient-to-l from-glass to-transparent transition-opacity duration-200',
            edges.end ? 'opacity-100' : 'opacity-0',
          )}
        />
      </div>
    </div>
  );
}
