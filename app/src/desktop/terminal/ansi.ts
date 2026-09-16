export const ESC = '';

export type PaintFn = (s: string) => string;
export interface Paint {
  dim: PaintFn;
  bold: PaintFn;
  accent: PaintFn;
  green: PaintFn;
  red: PaintFn;
}

/** Codes tuned for the dark pane: light ink on near-black. */
const darkPaint: Paint = {
  dim: (s) => `${ESC}[2m${s}${ESC}[0m`,
  bold: (s) => `${ESC}[1m${s}${ESC}[0m`,
  accent: (s) => `${ESC}[38;5;209m${s}${ESC}[0m`,
  green: (s) => `${ESC}[38;5;114m${s}${ESC}[0m`,
  red: (s) => `${ESC}[38;5;203m${s}${ESC}[0m`,
};

/** Codes tuned for the light pane: dark ink on paper. The dark set washes
 * out here (light orange on white), so every hue moves several steps darker
 * and dim becomes an explicit gray instead of SGR faint. */
const lightPaint: Paint = {
  dim: (s) => `${ESC}[38;5;243m${s}${ESC}[0m`,
  bold: (s) => `${ESC}[1m${s}${ESC}[0m`,
  accent: (s) => `${ESC}[38;5;166m${s}${ESC}[0m`,
  green: (s) => `${ESC}[38;5;28m${s}${ESC}[0m`,
  red: (s) => `${ESC}[38;5;124m${s}${ESC}[0m`,
};

let active: Paint = darkPaint;

/**
 * The terminal's own small palette, matched to the site's tokens.
 *
 * A stable delegating object: call sites keep `paint as C` and read the
 * current theme's codes at call time. useXterm calls setPaintTheme before
 * booting the shell (and reboots on theme change), so there is exactly one
 * theme in play and no call site needs threading.
 */
export const paint: Paint = {
  dim: (s) => active.dim(s),
  bold: (s) => active.bold(s),
  accent: (s) => active.accent(s),
  green: (s) => active.green(s),
  red: (s) => active.red(s),
};

export function setPaintTheme(mode: 'light' | 'dark'): void {
  active = mode === 'light' ? lightPaint : darkPaint;
}

/** Full xterm palette per mode, so SGR colors render on both grounds. */
export function xtermTheme(mode: 'light' | 'dark'): Record<string, string> {
  return mode === 'light'
    ? {
        background: 'rgba(0,0,0,0)',
        foreground: '#1a2129',
        cursor: '#d64f00',
        selectionBackground: 'rgba(214,79,0,0.22)',
        black: '#1a2129',
        red: '#b02a2a',
        green: '#1e7e34',
        yellow: '#9a6a00',
        blue: '#1a56db',
        magenta: '#9333ea',
        cyan: '#0e7490',
        white: '#6b7280',
        brightBlack: '#9ca3af',
        brightRed: '#d92d20',
        brightGreen: '#12805c',
        brightYellow: '#b54708',
        brightBlue: '#2e90fa',
        brightMagenta: '#a855f7',
        brightCyan: '#0e9384',
        brightWhite: '#101828',
      }
    : {
        background: 'rgba(0,0,0,0)',
        foreground: '#e3e8ec',
        cursor: '#ff8a3d',
        selectionBackground: 'rgba(255,138,61,0.28)',
        black: '#2a343d',
        red: '#e06c75',
        green: '#98c379',
        yellow: '#e5c07b',
        blue: '#61afef',
        magenta: '#c678dd',
        cyan: '#56b6c2',
        white: '#abb2bf',
        brightBlack: '#5c6773',
        brightRed: '#f44747',
        brightGreen: '#73c991',
        brightYellow: '#ffcc66',
        brightBlue: '#4fc1ff',
        brightMagenta: '#d183e8',
        brightCyan: '#6dd5d2',
        brightWhite: '#ffffff',
      };
}

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
