import { REEL } from '@/desktop/data/reel';
import { paint as C } from '../ansi';
import type { CommandRegistry } from '../types';

/** The films, and putting one on the wallpaper. */
export const reelCommands: CommandRegistry = {
  reel: {
    desc: 'list the film clips',
    run: (ctx) => {
      ctx.print();
      REEL.forEach((c, i) =>
        ctx.print(
          `  ${C.dim(String(i + 1).padStart(2, '0'))} ${C.bold(c.id.padEnd(14))} ${C.dim(c.credit)}`,
        ),
      );
      ctx.print();
      ctx.print(C.dim('  `play <id>` to watch'));
      ctx.print();
    },
  },
  play: {
    desc: 'play a clip in the reel window',
    usage: 'play <clip-id>',
    complete: () => REEL.map((c) => c.id),
    run: (ctx, [id]) => {
      const clip = id ? REEL.find((c) => c.id === id) : REEL[0];
      if (!clip) return ctx.print(`  no clip called ${C.accent(id ?? '')}. try \`reel\``);
      ctx.openWindow('reel', clip.id);
      ctx.print(`  playing ${C.accent(clip.title)} — ${C.dim(clip.credit)}`);
    },
  },
};
