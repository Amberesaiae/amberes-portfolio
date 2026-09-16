import { projects } from '@/data/projects';
import { paint as C, wrap } from '../ansi';
import type { CommandRegistry } from '../types';

/** Reading the work without leaving the keyboard. */
export const workCommands: CommandRegistry = {
  work: {
    desc: 'list projects',
    run: (ctx) => {
      ctx.print();
      projects.forEach((p) => {
        const dot =
          p.status === 'shipped'
            ? C.green('●')
            : p.status === 'in-progress'
              ? C.accent('●')
              : C.dim('●');
        ctx.print(`  ${dot} ${C.bold(p.id.padEnd(16))} ${C.dim(`${p.year} · ${p.category}`)}`);
      });
      ctx.print();
      ctx.print(C.dim('  `cat <id>` for detail'));
      ctx.print();
    },
  },
  cat: {
    desc: 'read a project',
    usage: 'cat <project-id>',
    complete: () => projects.map((p) => p.id),
    run: (ctx, [id]) => {
      const p = projects.find((x) => x.id === id);
      if (!p) return ctx.print(`  no project called ${C.accent(id ?? '')}. try \`work\``);
      ctx.print();
      ctx.print(`  ${C.bold(p.title)}  ${C.dim(p.year)}`);
      if (p.client) ctx.print(`  ${C.dim(p.client)}`);
      ctx.print();
      wrap(p.description, 68).forEach((l) => ctx.print(`  ${l}`));
      ctx.print();
      ctx.print(`  ${C.dim('stack')}  ${p.stack.join(' · ')}`);
      if (p.link) ctx.print(`  ${C.dim('live')}   ${C.accent(p.link)}`);
      ctx.print();
    },
  },
};
