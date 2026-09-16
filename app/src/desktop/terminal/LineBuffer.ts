/**
 * The line being typed, and where the cursor is in it.
 *
 * Pulled out of the shell so the editing rules are testable on their own and
 * the shell is left deciding what keystrokes mean rather than how a string is
 * spliced.
 */
export class LineBuffer {
  private text = '';
  private cursor = 0;

  get value() {
    return this.text;
  }

  get position() {
    return this.cursor;
  }

  /** Characters between the cursor and the end, for redrawing. */
  get tail() {
    return this.text.length - this.cursor;
  }

  clear() {
    this.text = '';
    this.cursor = 0;
  }

  set(next: string) {
    this.text = next;
    this.cursor = next.length;
  }

  insert(chunk: string) {
    this.text = this.text.slice(0, this.cursor) + chunk + this.text.slice(this.cursor);
    this.cursor += chunk.length;
  }

  /** Delete the character before the cursor. Returns false at the start. */
  backspace(): boolean {
    if (this.cursor === 0) return false;
    this.text = this.text.slice(0, this.cursor - 1) + this.text.slice(this.cursor);
    this.cursor -= 1;
    return true;
  }

  /** Move by `delta`; returns false when already at the end it is moving to. */
  move(delta: number): boolean {
    const next = this.cursor + delta;
    if (next < 0 || next > this.text.length) return false;
    this.cursor = next;
    return true;
  }
}
