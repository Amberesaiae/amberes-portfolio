export const ESC = '';

/** The terminal's own small palette, matched to the site's tokens. */
export const paint = {
  dim: (s: string) => `${ESC}[2m${s}${ESC}[0m`,
  bold: (s: string) => `${ESC}[1m${s}${ESC}[0m`,
  accent: (s: string) => `${ESC}[38;5;209m${s}${ESC}[0m`,
  green: (s: string) => `${ESC}[38;5;114m${s}${ESC}[0m`,
  red: (s: string) => `${ESC}[38;5;203m${s}${ESC}[0m`,
};

/** Naive word wrap — good enough for prose in a fixed-width pane. */
export function wrap(text: string, width: number): string[] {
  const out: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    if ((line + word).length > width) {
      out.push(line.trimEnd());
      line = '';
    }
    line += `${word} `;
  }
  if (line.trim()) out.push(line.trimEnd());
  return out;
}
