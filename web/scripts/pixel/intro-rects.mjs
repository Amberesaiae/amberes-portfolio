// Usage: node scripts/pixel/intro-rects.mjs --site live|local --at MS : dumps img/video rects at a given time after navigation, both viewports.
import { launch, VIEWPORTS, SITES, SEED_SCRIPT, arg } from './common.mjs';
const site = arg('site', 'local'), at = +arg('at', 3000), b = await launch();
for (const vp of VIEWPORTS) {
	const page = await (await b.newContext({ viewport: vp })).newPage();
	await page.addInitScript(SEED_SCRIPT);
	await page.goto(SITES[site].url, { waitUntil: 'commit' });
	await page.waitForTimeout(at);
	const r = await page.evaluate(() => [...document.querySelectorAll('img,video')].map((e) => { const b = e.getBoundingClientRect(); return { s: (e.currentSrc || e.src || '').split('/').slice(-1)[0].slice(0, 28), x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height), op: +getComputedStyle(e).opacity }; }).filter((x) => x.w > 80 && x.op > 0.05));
	console.log(site, vp.name, 'at', at); console.table(r);
}
await b.close();
