import type { WindowId } from '@/desktop/types';

export interface ShellContext {
  /** print one line; ANSI escapes allowed */
  print: (line?: string) => void;
  clear: () => void;
  openWindow: (id: WindowId, arg?: string) => void;
  closeWindow: (id: WindowId) => void;
  closeAll: () => void;
}

export interface Command {
  desc: string;
  usage?: string;
  /** candidates for tab-completing the first argument */
  complete?: () => string[];
  run: (ctx: ShellContext, args: string[]) => void | Promise<void>;
}

export type CommandRegistry = Record<string, Command>;
