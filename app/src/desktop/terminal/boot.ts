import { IDENTITY } from '@/desktop/config/identity';
import { paint as C } from './ansi';

/** One printed line, and how long to wait before the next one. */
export interface BootLine {
  text: string;
  /** ms to pause *after* printing this line */
  pause: number;
}

const ok = (what: string) => `  ${C.green('[  OK  ]')} ${what}`;

/**
 * The boot sequence.
 *
 * A terminal that is instantly ready is a text box with a monospace font. A
 * real one comes up in stages, and the couple of seconds it takes are the whole
 * reason the pane is enjoyable rather than decorative. The units named here are
 * the site's own subsystems, so the sequence is telling the truth about what it
 * just started rather than cosplaying a kernel log.
 *
 * Total run is ~1.4s. Anyone who does not want to watch it can press a key, and
 * anyone who prefers no motion at all gets the last frame immediately — see
 * useBootSequence.
 */
export const BOOT: BootLine[] = [
  { text: '', pause: 90 },
  { text: `  ${C.dim('mainframe')} ${C.dim('6.9.4-amber')} ${C.dim('(tty1)')}`, pause: 220 },
  { text: '', pause: 60 },
  { text: ok('Mounted /work'), pause: 70 },
  { text: ok('Mounted /reel'), pause: 70 },
  { text: ok('Started window-manager.service'), pause: 90 },
  { text: ok('Started assistant.socket'), pause: 70 },
  { text: `  ${C.dim('[      ]')} Reached target Graphical Interface`, pause: 180 },
  { text: '', pause: 120 },
];

/** The motd, printed once the boot lines have finished. */
export const MOTD = (): string[] => [
  `  ${C.accent('◆')}  ${C.bold(IDENTITY.name)}`,
  `     ${C.dim(IDENTITY.title)}`,
  `     ${C.dim(`${IDENTITY.location} · ${IDENTITY.email}`)}`,
  '',
  `  ${C.dim('Type')} ${C.accent('help')} ${C.dim('for commands,')} ${C.accent('open work')} ${C.dim('to jump straight in.')}`,
  '',
];
