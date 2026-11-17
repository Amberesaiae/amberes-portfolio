// Usage: node scripts/pixel/diff.mjs [--a pixel-out/live] [--b pixel-out/local] [--out pixel-out/diff]
// Pixel diff of every same-named PNG in A (target) and B (ours). Outputs diff overlays, side-by-sides
// (target | ours | diff) and results.json with overall + per-region mismatch %.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { arg } from './common.mjs';

const A = resolve(arg('a', 'pixel-out/live'));
const B = resolve(arg('b', 'pixel-out/local'));
const OUT = resolve(arg('out', 'pixel-out/diff'));
mkdirSync(OUT, { recursive: true });
const read = (p) => PNG.sync.read(readFileSync(p));

/** Regions as fractions of the compared image: header band then a 3x3 grid. */
function regions(w, h, vpName) {
	const hb = vpName === '390' ? 64 : 72;
	const r = [{ name: 'header', x: 0, y: 0, w, h: hb }];
	const rows = ['top', 'mid', 'bottom'], cols = ['left', 'centre', 'right'];
	const bodyH = h - hb;
	rows.forEach((rn, ri) => cols.forEach((cn, ci) => r.push({ name: `${rn}-${cn}`, x: Math.round((w * ci) / 3), y: hb + Math.round((bodyH * ri) / 3), w: Math.round(w / 3), h: Math.round(bodyH / 3) })));
	return r;
}

function crop(png, w, h) {
	const out = new PNG({ width: w, height: h });
	out.data.fill(0);
	for (let y = 0; y < Math.min(h, png.height); y++) png.data.copy(out.data, y * w * 4, y * png.width * 4, y * png.width * 4 + Math.min(w, png.width) * 4);
	return out;
}

const results = [];
const files = readdirSync(A).filter((f) => f.endsWith('.png') && existsSync(`${B}/${f}`)).sort();
for (const f of files) {
	const a = read(`${A}/${f}`), b0 = read(`${B}/${f}`);
	const full = f.includes('-full');
	// full-page shots differ in height by design: compare the common top region and report the heights
	const w = Math.min(a.width, b0.width), h = Math.min(a.height, b0.height);
	const ca = crop(a, w, h), cb = crop(b0, w, h);
	const diff = new PNG({ width: w, height: h });
	const total = pixelmatch(ca.data, cb.data, diff.data, w, h, { threshold: 0.1, includeAA: false, alpha: 0.35 });
	const vp = f.includes('-390-') ? '390' : '1440';
	const reg = [];
	if (!full) {
		for (const r of regions(w, h, vp)) {
			const ra = new PNG({ width: r.w, height: r.h }), rb = new PNG({ width: r.w, height: r.h });
			PNG.bitblt(ca, ra, r.x, r.y, r.w, r.h, 0, 0); PNG.bitblt(cb, rb, r.x, r.y, r.w, r.h, 0, 0);
			const n = pixelmatch(ra.data, rb.data, null, r.w, r.h, { threshold: 0.1, includeAA: false });
			reg.push({ region: r.name, pct: +((n / (r.w * r.h)) * 100).toFixed(1) });
		}
	}
	writeFileSync(`${OUT}/diff-${f}`, PNG.sync.write(diff));
	// side-by-side: target | ours | diff
	const sbs = new PNG({ width: w * 3 + 8, height: h });
	sbs.data.fill(40);
	PNG.bitblt(ca, sbs, 0, 0, w, h, 0, 0); PNG.bitblt(cb, sbs, 0, 0, w, h, w + 4, 0); PNG.bitblt(diff, sbs, 0, 0, w, h, 2 * w + 8, 0);
	writeFileSync(`${OUT}/sbs-${f}`, PNG.sync.write(sbs));
	results.push({ file: f, w, h, targetSize: [a.width, a.height], oursSize: [b0.width, b0.height], mismatchPct: +((total / (w * h)) * 100).toFixed(1), regions: reg });
}
writeFileSync(`${OUT}/results.json`, JSON.stringify(results, null, 1));
for (const r of results) console.log(r.file.padEnd(34), String(r.mismatchPct).padStart(5) + '%', r.regions.map((x) => x.pct).join(' '));
const mean = (xs) => (xs.reduce((s, x) => s + x, 0) / (xs.length || 1)).toFixed(1);
console.log('mean intro', mean(results.filter((r) => r.file.startsWith('intro')).map((r) => r.mismatchPct)), 'mean pages', mean(results.filter((r) => r.file.startsWith('page')).map((r) => r.mismatchPct)));
