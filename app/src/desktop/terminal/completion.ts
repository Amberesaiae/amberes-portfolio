import type { CommandRegistry } from './types';

export interface Completion {
  /** the line to replace what was typed, when exactly one candidate matched */
  line?: string;
  /** every candidate, when more than one matched and they should be listed */
  candidates?: string[];
}

/**
 * Completes a command name on the first word, and a command's own candidates on
 * any later word. Returns what to do rather than doing it, so the shell stays
 * the only thing that writes to the terminal.
 */
export function complete(buffer: string, commands: CommandRegistry): Completion {
  const parts = buffer.split(/\s+/);
  const head = parts[0] ?? '';

  if (parts.length === 1) {
    const matches = Object.keys(commands).filter((name) => name.startsWith(head));
    if (matches.length === 1) return { line: `${matches[0]} ` };
    if (matches.length > 1) return { candidates: matches };
    return {};
  }

  const candidates = commands[head]?.complete?.();
  if (!candidates) return {};

  const partial = parts[parts.length - 1] ?? '';
  const matches = candidates.filter((c) => c.startsWith(partial));
  if (matches.length === 1) return { line: `${head} ${matches[0]}` };
  if (matches.length > 1) return { candidates: matches };
  return {};
}
