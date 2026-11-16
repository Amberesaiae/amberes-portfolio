// Contrast check for the board palette tokens. Run: npm run a11y:contrast
// Uses Node's type stripping to import the same TS used by the app.
import { checkBoardContrast, boardPalette } from '../src/lib/a11y/contrast.ts';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/routes/layout.css', import.meta.url), 'utf8');
const map = { background: '--background', foreground: '--foreground', card: '--card', cardForeground: '--card-foreground', primary: '--primary', primaryForeground: '--primary-foreground', muted: '--muted', mutedForeground: '--muted-foreground', border: '--border', ring: '--ring' };
let drift = 0;
for (const [k, v] of Object.entries(map)) {
	const m = css.match(new RegExp(`${v}:\\s*(oklch\\([^)]*\\))`));
	if (!m || m[1].replace(/\s+/g, ' ') !== boardPalette[k]) { console.error(`DRIFT ${v}: css=${m?.[1]} contrast.ts=${boardPalette[k]}`); drift++; }
}
let fail = 0;
for (const r of checkBoardContrast()) {
	console.log(`${r.pass ? 'PASS' : 'FAIL'} ${r.ratio.toFixed(2)}:1 (>= ${r.min}) ${r.name}`);
	if (!r.pass) fail++;
}
process.exit(fail || drift ? 1 : 0);
