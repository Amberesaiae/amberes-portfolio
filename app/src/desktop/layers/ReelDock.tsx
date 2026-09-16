import { REEL } from '@/desktop/data/reel';
import { useDesktop, useDesktopDispatch } from '@/desktop/providers/windowStore';
import { ReelDockTile } from './ReelDockTile';

/**
 * The seven clips, always within reach along the bottom edge. Clicking one
 * opens the reel window on that clip; while that window is open the dock loops
 * pause, so the page never decodes eight videos at once.
 */
export function ReelDock() {
  const { windows } = useDesktop();
  const dispatch = useDesktopDispatch();
  const reelOpen = windows.reel.open && !windows.reel.minimized;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 pb-[max(14px,env(safe-area-inset-bottom))]">
      <div className="pointer-events-auto mx-auto flex max-w-full snap-x gap-2 overflow-x-auto px-3 pb-1 scrollbar-none md:w-fit md:justify-center md:overflow-visible md:rounded-2xl md:border md:border-white/10 md:bg-black/35 md:p-2 md:backdrop-blur-xl">
        {REEL.map((clip) => (
          <ReelDockTile
            key={clip.id}
            clip={clip}
            paused={reelOpen}
            onClick={() => dispatch({ type: 'open', id: 'reel', arg: clip.id })}
          />
        ))}
      </div>
    </div>
  );
}
