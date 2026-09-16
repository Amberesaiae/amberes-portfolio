import { WINDOW_DEFS, WINDOW_ORDER } from '@/desktop/config/windows';
import type { WindowId } from '@/desktop/types';
import { paint as C } from '../ansi';
import type { CommandRegistry } from '../types';

const isWindowId = (s: string): s is WindowId => (WINDOW_ORDER as string[]).includes(s);

/** Moving around the desktop: what exists, what to open, what to close. */
export const navigationCommands: CommandRegistry = {
  ls: {
    desc: 'list the folders on the desktop',
    run: (ctx) => {
      ctx.print();
      WINDOW_ORDER.forEach((id) =>
        ctx.print(`  ${C.accent(id.padEnd(9))}  ${C.dim(WINDOW_DEFS[id].hint)}`),
      );
      ctx.print();
    },
  },
  open: {
    desc: 'open a folder',
    usage: 'open <folder>',
    complete: () => [...WINDOW_ORDER],
    run: (ctx, [name]) => {
      if (!name) return ctx.print(C.dim('  usage: open <folder> — try `ls`'));
      if (!isWindowId(name)) return ctx.print(`  no folder called ${C.accent(name)}. try \`ls\``);
      ctx.openWindow(name);
      ctx.print(`  opening ${C.accent(name)}…`);
    },
  },
  close: {
    desc: 'close a folder, or all of them',
    usage: 'close <folder|all>',
    complete: () => ['all', ...WINDOW_ORDER],
    run: (ctx, [name]) => {
      if (!name || name === 'all') {
        ctx.closeAll();
        return ctx.print('  desktop cleared');
      }
      if (!isWindowId(name)) return ctx.print(`  no folder called ${C.accent(name)}`);
      ctx.closeWindow(name);
    },
  },
};
