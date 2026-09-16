import type { ReactNode } from 'react';
import { LayoutGrid } from 'lucide-react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { useDesktopDispatch } from '@/desktop/providers/windowStore';
import type { ThemePreference } from '@/desktop/providers/useTheme';
import { OpenSubmenu } from './submenus/OpenSubmenu';
import { ThemeSubmenu } from './submenus/ThemeSubmenu';
import { WallpaperSubmenu } from './submenus/WallpaperSubmenu';

interface Props {
  onTidy: () => void;
  themePreference: ThemePreference;
  onSetTheme: (next: ThemePreference) => void;
  children: ReactNode;
}

/**
 * Right-click on the wallpaper. Composition only — each submenu owns its own
 * data and its own dispatching.
 */
export function DesktopContextMenu({ onTidy, themePreference, onSetTheme, children }: Props) {
  const dispatch = useDesktopDispatch();

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>

      <ContextMenuContent className="w-56">
        <ContextMenuLabel className="type-label text-muted-foreground/70">Desktop</ContextMenuLabel>

        <OpenSubmenu />
        <WallpaperSubmenu />
        <ThemeSubmenu preference={themePreference} onSet={onSetTheme} />

        <ContextMenuSeparator />

        <ContextMenuItem onSelect={onTidy}>
          <LayoutGrid />
          Tidy up
        </ContextMenuItem>
        <ContextMenuItem onSelect={() => dispatch({ type: 'closeAll' })}>
          Close all windows
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
