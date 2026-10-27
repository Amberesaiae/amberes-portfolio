import { useEffect, useState } from 'react';

type AsciiModule = typeof import('ascii-reveal');

/**
 * The reveal engine is a separate chunk. Home screen slots defer it to an
 * idle turn so it is not on the critical path of the first picture; a pane
 * that is already waiting for its own chunk loads it immediately.
 */
export function useAsciiModule(active: boolean, defer: boolean) {
  const [mod, setMod] = useState<AsciiModule | null>(null);

  useEffect(() => {
    if (!active) return;
    let cancel = false;
    const pull = () => {
      import('ascii-reveal').then((loaded) => {
        if (!cancel) setMod(loaded);
      });
    };

    if (!defer) {
      pull();
      return () => {
        cancel = true;
      };
    }

    const id = window.requestIdleCallback?.(() => pull(), { timeout: 8000 });
    const timer = id == null ? window.setTimeout(pull, 1600) : undefined;
    return () => {
      cancel = true;
      if (id != null) window.cancelIdleCallback(id);
      if (timer != null) window.clearTimeout(timer);
    };
  }, [active, defer]);

  return mod;
}
