import { Check, Undo2 } from 'lucide-react';
import {
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from '@/components/ui/context-menu';
import { REEL } from '@/desktop/data/reel';
import { useDesktop, useDesktopDispatch } from '@/desktop/providers/windowStore';

/**
 * Setting the wallpaper from the wallpaper — the action with no other obvious
 * home now that the films play on the background.
 */
export function WallpaperSubmenu() {
  const { activeBackgroundVideo } = useDesktop();
  const dispatch = useDesktopDispatch();

  return (
    <ContextMenuSub>
      <ContextMenuSubTrigger>Wallpaper</ContextMenuSubTrigger>
      <ContextMenuSubContent className="w-48">
        {REEL.map((clip) => (
          <ContextMenuItem
            key={clip.id}
            onSelect={() => dispatch({ type: 'setReelBackground', src: clip.preview })}
          >
            {clip.title}
            {activeBackgroundVideo === clip.preview && <Check className="ml-auto size-3.5" />}
          </ContextMenuItem>
        ))}
        <ContextMenuSeparator />
        <ContextMenuItem
          disabled={!activeBackgroundVideo}
          onSelect={() => dispatch({ type: 'setReelBackground', src: null })}
        >
          <Undo2 />
          Restore original
        </ContextMenuItem>
      </ContextMenuSubContent>
    </ContextMenuSub>
  );
}
