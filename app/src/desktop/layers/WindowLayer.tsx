import { lazy, Suspense, useState } from 'react';
import { WINDOW_ORDER } from '@/desktop/config/windows';
import { useDesktop } from '@/desktop/providers/windowStore';

const WindowStack = lazy(() => import('./WindowStack'));

/**
 * Nothing is open on first paint. The window chrome — and the animation
 * runtime it drags — loads the first time a folder is opened, then stays
 * mounted so a window can still animate closed.
 */
export function WindowLayer() {
  const { windows } = useDesktop();
  const anyOpen = WINDOW_ORDER.some((id) => windows[id].open && !windows[id].minimized);
  const [mounted, setMounted] = useState(false);
  if (anyOpen && !mounted) setMounted(true);

  if (!mounted) return null;

  return (
    <Suspense fallback={null}>
      <WindowStack />
    </Suspense>
  );
}
