import { BackgroundVideo } from './layers/BackgroundVideo';
import { Dock } from './layers/Dock';
import { MenuBar } from './layers/MenuBar';
import { WidgetLayer } from './layers/WidgetLayer';
import { WindowLayer } from './layers/WindowLayer';
import { DesktopContextMenu } from './menus/DesktopContextMenu';
import { useDocumentTitle } from './providers/useDocumentTitle';
import { useIsMobile } from './providers/useIsMobile';
import { useRouteSync } from './providers/useRouteSync';
import { useTheme } from './providers/useTheme';
import { useWidgetPositions } from './widgets/useWidgetPositions';

/**
 * Five layers over one surface.
 *
 * The surface is usually the background plate and sometimes one of the films —
 * picking a film in the Reel makes it the wallpaper, so the desktop itself is
 * the player. That is why navigation moved into a dock: the middle of the
 * screen has to stay clear.
 */
export default function Desktop() {
  const widgets = useWidgetPositions();
  const mobile = useIsMobile();
  const theme = useTheme();

  useRouteSync();
  useDocumentTitle();

  const layers = (
    <>
      <BackgroundVideo />
      <MenuBar onTidy={widgets.tidy} theme={theme.resolved} onToggleTheme={theme.toggle} />
      <WidgetLayer widgets={widgets} />
      <WindowLayer />
      <Dock />
    </>
  );

  // The mobile desktop scrolls, because the plates may not fit above the dock;
  // the background stays fixed behind it either way.
  // Touch has no right-click, so the menu is only mounted where it can be used.
  if (mobile) return <div className="min-h-[100svh] pb-28">{layers}</div>;

  return (
    <DesktopContextMenu
      onTidy={widgets.tidy}
      themePreference={theme.preference}
      onSetTheme={theme.set}
    >
      <div className="relative h-[100svh] w-full overflow-hidden">{layers}</div>
    </DesktopContextMenu>
  );
}
