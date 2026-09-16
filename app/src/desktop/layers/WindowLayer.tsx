import { AnimatePresence } from 'framer-motion';
import { WINDOW_ORDER } from '@/desktop/config/windows';
import { useIsMobile } from '@/desktop/providers/useIsMobile';
import { useDesktop } from '@/desktop/providers/windowStore';
import Window from '@/desktop/window/Window';

export function WindowLayer() {
  const { windows, focused } = useDesktop();
  const mobile = useIsMobile();

  const visible = WINDOW_ORDER.filter((id) => windows[id].open && !windows[id].minimized);
  // Only one sheet is ever on screen on mobile: the focused one.
  const shown = mobile ? visible.filter((id) => id === focused).slice(0, 1) : visible;

  return (
    <AnimatePresence>
      {shown.map((id) => (
        <Window key={id} win={windows[id]} focused={focused === id} />
      ))}
    </AnimatePresence>
  );
}
