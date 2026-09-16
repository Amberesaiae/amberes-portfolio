import { createContext, useContext, useMemo, type Dispatch } from 'react';
import type { WindowId } from '@/desktop/types';
import type { DesktopAction, DesktopState } from './windowReducer';

export const DesktopStateContext = createContext<DesktopState | null>(null);
export const DesktopDispatchContext = createContext<Dispatch<DesktopAction> | null>(null);

export function useDesktop(): DesktopState {
  const state = useContext(DesktopStateContext);
  if (!state) throw new Error('useDesktop must be used inside <DesktopProvider>');
  return state;
}

export function useDesktopDispatch(): Dispatch<DesktopAction> {
  const dispatch = useContext(DesktopDispatchContext);
  if (!dispatch) throw new Error('useDesktopDispatch must be used inside <DesktopProvider>');
  return dispatch;
}

/** Stable handle for anything that drives windows — the terminal, the dock. */
export function useWindowActions() {
  const dispatch = useDesktopDispatch();
  return useMemo(
    () => ({
      open: (id: WindowId, arg?: string) => dispatch({ type: 'open', id, arg }),
      close: (id: WindowId) => dispatch({ type: 'close', id }),
      closeAll: () => dispatch({ type: 'closeAll' }),
      focus: (id: WindowId) => dispatch({ type: 'focus', id }),
    }),
    [dispatch],
  );
}
