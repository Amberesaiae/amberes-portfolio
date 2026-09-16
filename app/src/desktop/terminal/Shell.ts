import type { Terminal } from '@xterm/xterm';
import { ESC, paint as C } from './ansi';
import { BANNER, commands } from './commands';
import { complete } from './completion';
import { History } from './history';
import { LineBuffer } from './LineBuffer';
import type { ShellContext } from './types';

const PROMPT = `${C.accent('›')} `;

type Wiring = Pick<ShellContext, 'openWindow' | 'closeWindow' | 'closeAll'>;

/**
 * The shell loop: line editing, history, completion, dispatch. xterm draws;
 * this decides what the keystrokes mean. Commands live in `commands.ts` and
 * never touch the terminal directly — they get `ctx`.
 */
export class Shell {
  private readonly buffer = new LineBuffer();
  private busy = false;
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
    BANNER.forEach((line) => this.term.writeln(line));
    this.prompt();
    this.term.onData((data) => this.onData(data));
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
