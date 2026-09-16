import { IDENTITY } from '@/desktop/config/identity';
import { paint as C } from '../ansi';
import type { CommandRegistry } from '../types';

/** Who he is and how to reach him. */
export const aboutCommands: CommandRegistry = {
  whoami: {
    desc: 'the short version',
    run: (ctx) => {
      ctx.print();
      ctx.print(`  ${C.bold(IDENTITY.name)} ${C.dim(`\u00b7 ${IDENTITY.handle}`)}`);
      ctx.print(`  ${C.dim(IDENTITY.title)}`);
      ctx.print(`  ${C.dim(IDENTITY.location)}`);
      ctx.print();
      ctx.print(C.dim('  `open about` for the long version'));
      ctx.print();
    },
  },
  contact: {
    desc: 'open the contact form',
    run: (ctx) => {
      ctx.openWindow('contact');
      ctx.print(`  ${C.dim('or just:')} ${IDENTITY.email}`);
    },
  },
};
