import { useMemo, useReducer, type ReactNode } from 'react';
import { DesktopDispatchContext, DesktopStateContext } from './windowStore';
import { makeInitialState, windowReducer } from './windowReducer';

export function DesktopProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(windowReducer, undefined, makeInitialState);
  const value = useMemo(() => state, [state]);

  return (
    <DesktopStateContext.Provider value={value}>
      <DesktopDispatchContext.Provider value={dispatch}>{children}</DesktopDispatchContext.Provider>
    </DesktopStateContext.Provider>
  );
}
