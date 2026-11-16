// Contrast check for the board palette tokens. Run: npm run a11y:contrast
// Uses Node's type stripping to import the same TS used by the app.
import { checkBoardContrast, boardPalette, toneFills, whiteOnToneContrast, labelContrast } from '../src/lib/a11y/contrast.ts';
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

// Text on board art: work-card scrim (parsed from WorkCard.svelte) and collage label colours per tone.
const wc = readFileSync(new URL('../src/lib/components/board/WorkCard.svelte', import.meta.url), 'utf8');
const scrim = Number(wc.match(/from-black\/(\d+)/)?.[1] ?? 0) / 100;
const op = (re) => Number(wc.match(re)?.[1] ?? 100) / 100;
const textBlocks = [['status label', op(/text-xs[^"]*opacity-(\d+)/)], ['blurb', op(/text-sm[^"]*opacity-(\d+)/)], ['title', 1]];
// The status label sits near the TOP of the gradient, where the scrim has faded to roughly half its strength.
for (const tone of Object.keys(toneFills))
	for (const [name, o] of textBlocks) {
		const r = whiteOnToneContrast(tone, scrim * 0.5, o);
		const min = name === 'title' ? 3 : 4.5;
		const ok = r >= min;
		console.log(`${ok ? 'PASS' : 'FAIL'} ${r.toFixed(2)}:1 (>= ${min}) work card ${name} on ${tone} (scrim ${scrim * 0.5}, opacity ${o})`);
		if (!ok) fail++;
	}
for (const tone of Object.keys(toneFills)) {
	const d = labelContrast(tone, 'dark'), l = labelContrast(tone, 'light');
	const ok = Math.max(d, l) >= 4.5;
	console.log(`${ok ? 'PASS' : 'FAIL'} tone ${tone}: dark label ${d.toFixed(2)}, light label ${l.toFixed(2)} (use ${d >= l ? 'dark' : 'light'}; one must be >= 4.5)`);
	if (!ok) fail++;
}
process.exit(fail || drift ? 1 : 0);
