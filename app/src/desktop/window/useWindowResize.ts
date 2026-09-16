import { useCallback, type PointerEvent } from 'react';
import type { WindowId } from '@/desktop/types';
import { useDesktopDispatch } from '@/desktop/providers/windowStore';
import type { ResizeEdge } from './WindowResizeHandles';

/**
 * Pointer-driven resize. Listeners go on `window` rather than the grip so the
 * gesture survives the pointer leaving the 4px target.
 */
export function useWindowResize(id: WindowId, w: number, h: number) {
  const dispatch = useDesktopDispatch();

  return useCallback(
    (e: PointerEvent, edge: ResizeEdge) => {
      e.preventDefault();
      e.stopPropagation();

      const startX = e.clientX;
      const startY = e.clientY;

      const onMove = (ev: globalThis.PointerEvent) => {
        dispatch({
          type: 'resize',
          id,
          w: edge === 's' ? w : w + (ev.clientX - startX),
          h: edge === 'e' ? h : h + (ev.clientY - startY),
        });
      };
      const onUp = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    },
    [dispatch, id, w, h],
  );
}
