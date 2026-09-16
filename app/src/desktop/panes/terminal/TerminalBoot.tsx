import { Mono } from '@/desktop/typography/Text';

/**
 * What fills the terminal between the window opening and xterm being ready.
 *
 * A spinner would be wrong here — the pane is a terminal, so the honest
 * placeholder is the first line the real one is about to print, in the same
 * font, size and colour. The swap is then almost invisible rather than a flash
 * of empty black.
 */
export function TerminalBoot() {
  return (
    <div className="absolute inset-0 p-3.5" aria-hidden="true">
      <Mono className="mt-4 block text-muted-foreground">mainframe 6.9.4-amber (tty1)</Mono>
      <Mono className="mt-2 block text-subtle-foreground">
        <span className="inline-block h-[1.1em] w-[0.6em] translate-y-[0.15em] animate-pulse bg-primary" />
      </Mono>
    </div>
  );
}
