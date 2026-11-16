// @ts-nocheck
// Run: npx vite dev --port 5199 & NODE_PATH=$(npm root -g) node src/lib/components/dock/dock.e2e.mjs
import { chromium } from 'playwright';
const url = process.env.URL ?? 'http://localhost:5199/dock-demo';
const b = await chromium.launch({ executablePath: process.env.CHROMIUM });
let fail = 0;
const ok = (c, m) => (console.log(c ? 'PASS' : 'FAIL', m), c || fail++);
for (const reduced of [false, true]) {
	const p = await b.newPage({ viewport: { width: 1280, height: 720 }, reducedMotion: reduced ? 'reduce' : 'no-preference' });
	await p.goto(url);
	await p.waitForTimeout(Number(process.env.WAIT ?? 800));
	ok((await p.locator('nav[aria-label="Dock"]').count()) === 1, 'single Dock landmark');
	const box = await p.locator('nav[aria-label="Dock"] div.pointer-events-auto').boundingBox();
	await p.mouse.move(box.x + box.width / 2, box.y + 30, { steps: 6 });
	await p.waitForTimeout(600);
	const widths = await p.$$eval('nav[aria-label="Dock"] a', (as) => as.map((a) => a.parentElement.getBoundingClientRect().width));
	const grew = Math.max(...widths) > 70;
	ok(reduced ? !grew : grew, `magnification ${reduced ? 'off under' : 'on without'} reduced motion (max slot ${Math.max(...widths).toFixed(0)}px)`);
	await p.close();
}
await b.close();
process.exit(fail ? 1 : 0);
