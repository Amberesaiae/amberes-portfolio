import { Mono } from '@/desktop/typography/Text';

/**
 * What fills the terminal between the window opening and xterm being ready.
 *
 * A spinner would be wrong here — the pane is a terminal, so the honest
 * placeholder is a prompt. It uses the same font, size and colour the real one
 * will, so the swap is almost invisible rather than a flash of empty black.
 */
export function TerminalBoot() {
  return (
    <div className="absolute inset-0 p-3.5" aria-hidden="true">
      <Mono className="block text-foreground/45">amber // terminal</Mono>
      <Mono className="mt-4 block text-foreground/30">
        <span className="text-primary">›</span>{' '}
        <span className="inline-block h-[1.1em] w-[0.6em] translate-y-[0.15em] animate-pulse bg-primary/70" />
      </Mono>
    </div>
  );
}
