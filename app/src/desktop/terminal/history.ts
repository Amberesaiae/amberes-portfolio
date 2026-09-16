const LIMIT = 50;

/** Command history with a cursor. -1 means "the line being typed". */
export class History {
  private entries: string[] = [];
  private cursor = -1;

  push(line: string) {
    if (!line) return;
    this.entries.unshift(line);
    this.entries = this.entries.slice(0, LIMIT);
    this.cursor = -1;
  }

  reset() {
    this.cursor = -1;
  }

  /** `direction` is +1 for older, -1 for newer. Returns the line to show. */
  recall(direction: number): string | null {
    if (this.entries.length === 0) return null;
    this.cursor = Math.min(Math.max(this.cursor + direction, -1), this.entries.length - 1);
    return this.cursor === -1 ? '' : this.entries[this.cursor];
  }
}
