import { IDENTITY } from '@/desktop/config/identity';
import { paint as C } from '../ansi';
import type { CommandRegistry } from '../types';
import { aboutCommands } from './about';
import { navigationCommands } from './navigation';
import { reelCommands } from './reel';
import { workCommands } from './work';

/**
 * Every command the terminal knows, assembled from one file per subject.
 *
 * Adding a command is a single entry in whichever group it belongs to — that is
 * the whole extension story. `ctx` reaches into the window manager, so a
 * command can drive the rest of the site rather than only print.
 */
export const commands: CommandRegistry = {
  help: {
    desc: 'list every command',
    run: (ctx) => {
      const width = Math.max(...Object.keys(commands).map((k) => k.length));
      ctx.print();
      ctx.print(C.bold('  Commands'));
      Object.entries(commands)
        .sort(([a], [b]) => a.localeCompare(b))
        .forEach(([name, cmd]) =>
          ctx.print(`  ${C.accent(name.padEnd(width))}  ${C.dim(cmd.desc)}`),
        );
      ctx.print();
      ctx.print(C.dim('  Tab completes · ↑↓ history · Ctrl+L clears'));
      ctx.print();
    },
  },

  ...navigationCommands,
  ...workCommands,
  ...reelCommands,
  ...aboutCommands,

  clear: {
    desc: 'clear the screen',
    run: (ctx) => ctx.clear(),
  },
};

export const BANNER = [
  '',
  `  ${C.bold(IDENTITY.handle)} ${C.dim('// terminal')}`,
  `  ${C.dim('type')} ${C.accent('help')} ${C.dim('to see what it does')}`,
  '',
];
