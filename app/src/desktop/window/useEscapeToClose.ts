import { useEffect } from 'react';
import type { WindowId } from '@/desktop/types';
import { useDesktopDispatch } from '@/desktop/providers/windowStore';

/** Escape closes the focused window. The one global shortcut worth having. */
export function useEscapeToClose(id: WindowId, active: boolean) {
  const dispatch = useDesktopDispatch();

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dispatch({ type: 'close', id });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, dispatch, id]);
}
