import { projects } from '@/data/projects';
import { WINDOW_DEFS, WINDOW_ORDER } from '@/desktop/config/windows';
import { REEL } from '@/desktop/data/reel';
import type { WindowId } from '@/desktop/types';
import { paint as C, wrap } from './ansi';
import type { CommandRegistry } from './types';

const isWindowId = (s: string): s is WindowId => (WINDOW_ORDER as string[]).includes(s);

/**
 * Every command the terminal knows.
 *
 * Adding one is a single entry here — that is the whole extension story, and
 * the reason this is a real shell loop rather than a hardcoded script. `ctx`
 * reaches into the window manager, so a command can drive the rest of the site.
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

  whoami: {
    desc: 'the short version',
    run: (ctx) => {
      ctx.print();
      ctx.print(`  ${C.bold('Lamptey Odartei Isaiah')} ${C.dim('· amber')}`);
      ctx.print(`  ${C.dim('Marine engineer, welder, builder of software. Accra, Ghana.')}`);
      ctx.print();
      ctx.print(C.dim('  `open about` for the long version'));
      ctx.print();
    },
  },

  contact: {
    desc: 'open the contact form',
    run: (ctx) => {
      ctx.openWindow('contact');
      ctx.print(`  ${C.dim('or just:')} isaiahamber5@gmail.com`);
    },
  },

  clear: {
    desc: 'clear the screen',
    run: (ctx) => ctx.clear(),
  },
};

export const BANNER = [
  '',
  `  ${C.bold('amber')} ${C.dim('// terminal')}`,
  `  ${C.dim('type')} ${C.accent('help')} ${C.dim('to see what it does')}`,
  '',
];
