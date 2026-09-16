import { useRef } from 'react';
// This pane is lazy-loaded, so xterm's stylesheet is code-split with it.
import '@xterm/xterm/css/xterm.css';
import { TerminalBoot } from './TerminalBoot';
import { useXterm } from './useXterm';

/**
 * A real emulator rather than a hand-rolled imitation, so the shell gets
 * correct line editing, selection, copy/paste and ANSI colour for free.
 */
export default function TerminalPane() {
  const host = useRef<HTMLDivElement>(null);
  const ready = useXterm(host);

  return (
    <div className="relative h-full min-h-[200px] w-full bg-black/25 p-3.5">
      <div
        ref={host}
        className={`size-full transition-opacity duration-200 ${ready ? 'opacity-100' : 'opacity-0'}`}
      />
      {!ready && <TerminalBoot />}
    </div>
  );
}
