import type { Terminal } from '@xterm/xterm';
import { ESC, paint as C } from './ansi';
import { BOOT, MOTD } from './boot';
import { commands } from './commands';
import { complete } from './completion';
import { History } from './history';
import { LineBuffer } from './LineBuffer';
import type { ShellContext } from './types';

/**
 * A shell prompt says who and where. `›` said neither, which made the pane look
 * like a chat box that had lost its avatar. This is the standard user@host:cwd
 * form, coloured the way a configured Linux shell colours it.
 */
const PROMPT = `${C.green('amber@mainframe')}${C.dim(':')}${C.accent('~')}${C.dim('$')} `;

type Wiring = Pick<ShellContext, 'openWindow' | 'closeWindow' | 'closeAll'>;

/**
 * The shell loop: line editing, history, completion, dispatch. xterm draws;
 * this decides what the keystrokes mean. Commands live in `commands.ts` and
 * never touch the terminal directly — they get `ctx`.
 */
export class Shell {
  private readonly buffer = new LineBuffer();
  private busy = false;
  private booting = true;
  private skip = false;
  private readonly history = new History();
  private readonly ctx: ShellContext;

  constructor(
    private readonly term: Terminal,
    wiring: Wiring,
  ) {
    this.ctx = {
      print: (line = '') => this.term.writeln(line),
      clear: () => {
        this.term.clear();
        this.term.write(`${ESC}[2J${ESC}[H`);
      },
      ...wiring,
    };
  }

  start() {
    // Input is live from the first frame: the boot is something to watch, never
    // something to wait through. Any keystroke skips to the prompt.
    this.term.onData((data) => {
      if (this.booting) {
        this.skip = true;
        return;
      }
      this.onData(data);
    });
    void this.boot();
  }

  /**
   * Print the boot sequence, then the motd, then hand over.
   *
   * `prefers-reduced-motion` and a skipped boot both take the same path: print
   * every line at once and stop. Nobody is trapped in an animation — WCAG 2.2.2
   * is about exactly this.
   */
  private async boot() {
    const still =
      this.skip ||
      (typeof matchMedia === 'function' &&
        matchMedia('(prefers-reduced-motion: reduce)').matches);

    for (const line of BOOT) {
      this.term.writeln(line.text);
      if (still || this.skip) continue;
      await new Promise((r) => setTimeout(r, line.pause));
    }

    MOTD().forEach((line) => this.term.writeln(line));
    this.booting = false;
    this.prompt();
    this.term.focus();
  }

  /* ------------------------------------------------------------- drawing */

  private prompt() {
    this.buffer.clear();
    this.term.write(`\r\n${PROMPT}`);
  }

  private redraw() {
    this.term.write(`\r${ESC}[K${PROMPT}${this.buffer.value}`);
    const back = this.buffer.tail;
    if (back > 0) this.term.write(`${ESC}[${back}D`);
  }

  private setLine(line: string) {
    this.buffer.set(line);
    this.redraw();
  }

  /* --------------------------------------------------------------- input */

  private onData(data: string) {
    if (this.busy) return;

    switch (data) {
      case '\r':
        void this.submit();
        return;

      case '': // Backspace
        if (this.buffer.backspace()) this.redraw();
        return;

      case '': // Ctrl+C
        this.term.write('^C');
        this.prompt();
        return;

      case '': // Ctrl+L
        this.ctx.clear();
        this.term.write(`${PROMPT}${this.buffer.value}`);
        return;

      case '\t':
        this.onTab();
        return;

      case `${ESC}[A`: {
        const line = this.history.recall(1);
        if (line !== null) this.setLine(line);
        return;
      }
      case `${ESC}[B`: {
        const line = this.history.recall(-1);
        if (line !== null) this.setLine(line);
        return;
      }
      case `${ESC}[C`:
        if (this.buffer.move(1)) this.term.write(`${ESC}[C`);
        return;
      case `${ESC}[D`:
        if (this.buffer.move(-1)) this.term.write(`${ESC}[D`);
        return;

      default:
        // Printable input only; other control and escape sequences are ignored.
        if (data >= ' ' && data !== ESC) {
          this.buffer.insert(data);
          this.redraw();
        }
    }
  }

  private onTab() {
    const result = complete(this.buffer.value, commands);
    if (result.line) {
      this.setLine(result.line);
      return;
    }
    if (result.candidates) {
      this.term.writeln('');
      this.term.writeln(`  ${result.candidates.join('  ')}`);
      this.term.write(`${PROMPT}${this.buffer.value}`);
    }
  }

  /* ------------------------------------------------------------ dispatch */

  private async submit() {
    const line = this.buffer.value.trim();
    this.term.writeln('');
    this.history.push(line);
    this.history.reset();

    if (!line) {
      this.prompt();
      return;
    }

    const [name, ...args] = line.split(/\s+/);
    const command = commands[name];

    if (!command) {
      this.term.writeln(
        `  ${C.dim('command not found:')} ${name} — try ${C.accent('help')}`,
      );
      this.prompt();
      return;
    }

    this.busy = true;
    try {
      await command.run(this.ctx, args);
    } catch (err) {
      this.term.writeln(
        `  ${C.red('error:')} ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      this.busy = false;
      this.prompt();
    }
  }
}
