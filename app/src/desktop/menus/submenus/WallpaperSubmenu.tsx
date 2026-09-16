import { Film } from 'lucide-react';
import { ContextMenuItem } from '@/components/ui/context-menu';
import { REEL } from '@/desktop/data/reel';
import { useDesktopDispatch } from '@/desktop/providers/windowStore';

/**
 * One item where a submenu used to be.
 *
 * It listed every film so you could set it as the wallpaper. Films no longer go
 * on the wallpaper — they play in the Reel — so a list of seven titles here
 * would be a second, worse copy of that window. This opens the real one.
 */
export function WallpaperSubmenu() {
  const dispatch = useDesktopDispatch();

  return (
    <ContextMenuItem onSelect={() => dispatch({ type: 'open', id: 'reel' })}>
      <Film />
      Films
      <span className="ml-auto text-subtle-foreground">{REEL.length}</span>
    </ContextMenuItem>
  );
}
