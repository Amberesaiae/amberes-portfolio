import { useEffect, useRef, useState, type RefObject } from 'react';
import { useTheme } from '@/desktop/providers/useTheme';
import { useWindowActions } from '@/desktop/providers/windowStore';
import { setPaintTheme, xtermTheme } from '@/desktop/terminal/ansi';

/**
 * Boots xterm into `host` and tears it down cleanly. The library, its addon and
 * the shell all load dynamically, so the terminal costs nothing until its
 * folder is opened.
 */
export function useXterm(host: RefObject<HTMLDivElement>) {
  const actions = useWindowActions();
  const { resolved } = useTheme();
  const [ready, setReady] = useState(false);
  const actionsRef = useRef(actions);
  actionsRef.current = actions;

  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;

    void (async () => {
      const [{ Terminal }, { FitAddon }, { Shell }] = await Promise.all([
        import('@xterm/xterm'),
        import('@xterm/addon-fit'),
        import('@/desktop/terminal/Shell'),
      ]);

      // xterm measures one character to size its grid. Doing that before Geist
      // Mono has loaded gives it the fallback's metrics and a terminal whose
      // columns are wrong for the rest of the session.
      await document.fonts?.ready?.catch?.(() => undefined);

      if (disposed || !host.current) return;

      // Paint codes resolve at call time, so setting the theme before boot
      // covers boot lines, motd, prompt and every command. The effect
      // re-runs on theme change, rebooting the shell into the new palette.
      setPaintTheme(resolved);

      const term = new Terminal({
        fontFamily: '"Geist Mono Variable", ui-monospace, monospace',
        fontSize: 12,
        lineHeight: 1.55,
        letterSpacing: 0.2,
        cursorBlink: true,
        convertEol: true,
        allowTransparency: true,
        theme: xtermTheme(resolved),
      });

      const fit = new FitAddon();
      term.loadAddon(fit);
      term.open(host.current);
      fit.fit();

      new Shell(term, {
        openWindow: (id, arg) => actionsRef.current.open(id, arg),
        closeWindow: (id) => actionsRef.current.close(id),
        closeAll: () => actionsRef.current.closeAll(),
      }).start();

      term.focus();
      setReady(true);

      // Refit when the window is resized by its grip.
      const observer = new ResizeObserver(() => {
        try {
          fit.fit();
        } catch {
          /* the pane can measure as zero mid-animation */
        }
      });
      observer.observe(host.current);

      cleanup = () => {
        observer.disconnect();
        term.dispose();
      };
    })();

    return () => {
      disposed = true;
      setReady(false);
      cleanup?.();
    };
  }, [host, resolved]);

  return ready;
}
