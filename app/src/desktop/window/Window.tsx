import { motion, useDragControls } from 'framer-motion';
import { PANES } from '@/desktop/config/panes';
import { supportsViews } from '@/desktop/config/views';
import { WINDOW_DEFS } from '@/desktop/config/windows';
import { useIsMobile } from '@/desktop/providers/useIsMobile';
import { useDesktopDispatch } from '@/desktop/providers/windowStore';
import type { WindowState } from '@/desktop/types';
import { FocusBeam } from '@/desktop/effects/FocusBeam';
import { cn } from '@/lib/utils';
import { WindowContextMenu } from '@/desktop/menus/WindowContextMenu';
import { MobileSheet } from './MobileSheet';
import { PaneShell } from './PaneShell';
import { WindowControls } from './WindowControls';
import { WindowResizeHandles } from './WindowResizeHandles';
import { WindowTitleBar } from './WindowTitleBar';
import { useEscapeToClose } from './useEscapeToClose';
import { useViewMode } from '@/desktop/providers/useViewMode';
import { useWindowGeometry } from './useWindowGeometry';
import { useWindowResize } from './useWindowResize';
import { ViewToggle } from './ViewToggle';

/** Panes that fill the frame and do their own scrolling. */
const SELF_SCROLLING = new Set(['reel', 'terminal', 'games', 'contact']);

interface Props {
  win: WindowState;
  focused: boolean;
}

/**
 * Composition only: geometry, the chrome pieces, and the pane. Every behaviour
 * lives in its own hook or component beside this file.
 */
export default function Window({ win, focused }: Props) {
  const dispatch = useDesktopDispatch();
  const controls = useDragControls();
  const mobile = useIsMobile();
  const startResize = useWindowResize(win.id, win.w, win.h);
  const views = useViewMode(win.id);
  const geometry = useWindowGeometry(win);
  const def = WINDOW_DEFS[win.id];
  const hasViews = supportsViews(win.id);

  useEscapeToClose(win.id, focused);

  const pane = (
    <PaneShell
      Pane={PANES[win.id]}
      arg={win.arg}
      view={hasViews ? views.mode : undefined}
      scroll={!SELF_SCROLLING.has(win.id)}
    />
  );

  if (mobile) {
    return (
      <MobileSheet
        title={def.title}
        onClose={() => dispatch({ type: 'close', id: win.id })}
        trailing={hasViews ? <ViewToggle mode={views.mode} onChange={views.set} /> : undefined}
      >
        {pane}
      </MobileSheet>
    );
  }

  return (
    <motion.section
      role="dialog"
      aria-label={def.title}
      drag={!win.maximized}
      dragListener={false}
      dragControls={controls}
      dragMomentum={false}
      dragElastic={0}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1, x: geometry.x, y: geometry.y }}
      exit={
        win.minimized
          ? // Minimising drops the window toward the dock it will come back from.
            { opacity: 0, scale: 0.6, y: geometry.y + 260, transition: { duration: 0.22 } }
          : { opacity: 0, scale: 0.97, transition: { duration: 0.12 } }
      }
      transition={{ type: 'spring', stiffness: 520, damping: 42 }}
      onDragEnd={(_, info) =>
        dispatch({ type: 'move', id: win.id, x: win.x + info.offset.x, y: win.y + info.offset.y })
      }
      onPointerDown={() => dispatch({ type: 'focus', id: win.id })}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: geometry.width,
        height: geometry.height,
        zIndex: win.z,
      }}
      className={cn(
        'flex flex-col overflow-hidden rounded-xl border bg-glass backdrop-blur-2xl',
        focused ? 'border-white/20 shadow-window' : 'border-border shadow-window-idle',
      )}
    >
      <FocusBeam active={focused} />

      <WindowContextMenu id={win.id} maximized={win.maximized}>
        <WindowTitleBar
        title={def.title}
        focused={focused}
        draggable={!win.maximized}
        onPointerDown={(e) => {
          if (!win.maximized) controls.start(e);
        }}
        onDoubleClick={() => dispatch({ type: 'toggleMaximize', id: win.id })}
        trailing={hasViews ? <ViewToggle mode={views.mode} onChange={views.set} /> : undefined}
      >
        <WindowControls
          maximized={win.maximized}
          onClose={() => dispatch({ type: 'close', id: win.id })}
          onMinimize={() => dispatch({ type: 'minimize', id: win.id })}
          onToggleMaximize={() => dispatch({ type: 'toggleMaximize', id: win.id })}
        />
        </WindowTitleBar>
      </WindowContextMenu>

      {pane}

      {!win.maximized && <WindowResizeHandles onStart={startResize} />}
    </motion.section>
  );
}
