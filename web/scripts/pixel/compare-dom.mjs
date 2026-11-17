// Usage: node scripts/pixel/compare-dom.mjs [--a pixel-out/live] [--b pixel-out/local]
// Compares DOM measurements role-by-role (sites have different content, so match by role not text):
// site header (first N nav-ish text items), first big heading, body text, page background/colour, doc height.
import { readFileSync } from 'node:fs';
import { arg } from './common.mjs';
const A = arg('a', 'pixel-out/live'), B = arg('b', 'pixel-out/local');
const rows = [];
for (const vp of ['1440', '390']) {
	const a = JSON.parse(readFileSync(`${A}/measure-${vp}.json`)), b = JSON.parse(readFileSync(`${B}/measure-${vp}.json`));
	const hdr = (m) => m.text.filter((t) => t.y < 60 && t.h < 30 && t.fontSize !== '57.6px').slice(0, 5);
	const big = (m) => [...m.text].sort((x, y) => parseFloat(y.fontSize) - parseFloat(x.fontSize))[0];
	const row = (what, ta, tb) => rows.push({ vp, what, target: ta, ours: tb });
	row('doc height', a.docHeight, b.docHeight);
	row('body bg', a.bodyBg, b.bodyBg);
	row('body colour', a.bodyColor, b.bodyColor);
	row('body font', a.bodyFont.split(',')[0], b.bodyFont.split(',')[0]);
	const ha = hdr(a), hb = hdr(b);
	row('header text items (y<60)', ha.map((t) => t.text).join(' | '), hb.map((t) => t.text).join(' | '));
	for (const k of ['fontSize', 'lineHeight', 'letterSpacing', 'fontWeight']) row('header ' + k, ha[0]?.[k], hb[0]?.[k]);
	row('header first item x,y', ha[0] && `${ha[0].x},${ha[0].y}`, hb[0] && `${hb[0].x},${hb[0].y}`);
	const ga = big(a), gb = big(b);
	for (const k of ['fontSize', 'lineHeight', 'letterSpacing', 'fontWeight', 'fontFamily']) row('largest text ' + k, ga?.[k], gb?.[k]);
	row('largest text x,y,w,h', ga && `${ga.x},${ga.y},${ga.w},${ga.h}`, gb && `${gb.x},${gb.y},${gb.w},${gb.h}`);
	const cards = (m) => m.boxes.filter((x) => /board-card|card|tile/.test(x.cls));
	row('card-like boxes', a.boxes.filter((x) => x.tag === 'img').length + ' img', cards(b).length + ' cards');
}
console.log('| viewport | measure | target (live) | ours |\n| --- | --- | --- | --- |');
for (const r of rows) console.log(`| ${r.vp} | ${r.what} | ${String(r.target).replace(/\|/g, '/')} | ${String(r.ours).replace(/\|/g, '/')} |`);
