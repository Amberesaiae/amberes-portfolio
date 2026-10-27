import type { ReactNode } from 'react';
import { PaneLoader } from './PaneLoader';
import { useAsciiModule } from './useAsciiModule';
import { useSaveData } from './useSaveData';

/**
 * Decodes a pane once its chunk has landed.
 *
 * The suspense fallback is the wait; this is the arrival. The wave starts at
 * the top-left, the way a terminal fills. The terminal window is left out of
 * this — xterm owns that DOM, and a glyph pass would fight the emulator.
 * prefers-reduced-motion becomes the library's short fade. A save-data or 2G
 * link skips the canvas and shows the pane as it is.
 */
export function PaneReveal({
  enabled,
  fill,
  children,
}: {
  enabled: boolean;
  /** No-scroll panes fill the frame; the wrapper has to as well. */
  fill: boolean;
  children: ReactNode;
}) {
  const thin = useSaveData();
  const ascii = useAsciiModule(enabled && !thin, false);
  if (!enabled || thin) return children;
  // Hold the pane until the field is here, so it decodes once instead of
  // painting and then being torn down to animate.
  if (!ascii) return <PaneLoader />;

  const Reveal = ascii.AsciiReveal;
  return (
    <Reveal
      preset="terminal"
      duration="fast"
      origin="top-left"
      className={fill ? 'flex min-h-0 flex-1 flex-col' : undefined}
    >
      {children}
    </Reveal>
  );
}
