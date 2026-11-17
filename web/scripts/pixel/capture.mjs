// Usage: node scripts/pixel/capture.mjs --site live|local [--url URL] [--out DIR] [--only intro|pages|measure]
// Captures, per viewport: intro film frames (every 250ms for 3s), settled viewport shots at scroll
// 0/900/1800/2700, a full-page shot, and a DOM measurement dump (measure.json).
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { launch, VIEWPORTS, SCROLLS, FRAME_STEP_MS, FRAME_COUNT, SITES, SEED_SCRIPT, arg } from './common.mjs';
import { measureFn } from './measure-fn.mjs';

const site = arg('site', 'local');
const cfg = SITES[site];
const url = arg('url', cfg.url);
const out = resolve(arg('out', `pixel-out/${site}`));
const only = arg('only', 'all');
mkdirSync(out, { recursive: true });

const browser = await launch();

async function newPage(vp, { gate }) {
	const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1, reducedMotion: 'no-preference' });
	const page = await ctx.newPage();
	await page.addInitScript(SEED_SCRIPT);
	if (gate && cfg.gate) await page.addInitScript(`try{sessionStorage.setItem(${JSON.stringify(cfg.gate)},'1')}catch(e){}`);
	await page.clock?.setFixedTime?.(new Date('2026-01-15T12:00:00Z')).catch(() => {});
	return { ctx, page };
}

for (const vp of VIEWPORTS) {
	// 1. intro film: fresh context, no gate; screenshot on a fixed schedule from navigation start
	if (only === 'all' || only === 'intro') {
		const { ctx, page } = await newPage(vp, { gate: false });
		const cdp = await ctx.newCDPSession(page);
		const frames = [];
		cdp.on('Page.screencastFrame', async (f) => {
			frames.push({ ts: f.metadata.timestamp * 1000, data: f.data });
			cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {});
		});
		await cdp.send('Page.startScreencast', { format: 'png', everyNthFrame: 1, maxWidth: vp.width, maxHeight: vp.height });
		const t0 = Date.now();
		await page.goto(url, { waitUntil: 'commit' }).catch(() => {});
		await new Promise((r) => setTimeout(r, FRAME_COUNT * FRAME_STEP_MS + 600));
		await cdp.send('Page.stopScreencast').catch(() => {});
		const log = [];
		const base = frames.length ? frames[0].ts : 0; // t=0 is the first painted frame
		for (let i = 0; i < FRAME_COUNT; i++) {
			const target = i * FRAME_STEP_MS;
			let pick = null;
			for (const f of frames) if (f.ts - base <= target) pick = f;
			if (pick) writeFileSync(`${out}/intro-${vp.name}-${String(target).padStart(4, '0')}.png`, Buffer.from(pick.data, 'base64'));
			log.push({ target, actual: pick ? Math.round(pick.ts - base) : null });
		}
		writeFileSync(`${out}/intro-${vp.name}-timing.json`, JSON.stringify({ firstFrameAfterNavMs: frames.length ? Math.round(frames[0].ts - t0 / 1) : null, frames: frames.length, log }));
		await ctx.close();
	}
	// 2. settled pages (intro skipped by gate / waited out)
	if (only === 'all' || only === 'pages' || only === 'measure') {
		const { ctx, page } = await newPage(vp, { gate: true });
		await page.goto(url, { waitUntil: 'load' }).catch(() => {});
		await page.waitForTimeout(cfg.settleMs);
		await page.addStyleTag({ content: '*{caret-color:transparent!important}' });
		const docH = await page.evaluate(() => document.documentElement.scrollHeight);
		if (only !== 'measure') {
			for (const y of SCROLLS) {
				await page.evaluate((y) => window.scrollTo(0, y), y);
				await page.waitForTimeout(1200);
				await page.screenshot({ path: `${out}/page-${vp.name}-scroll${y}.png` });
			}
			await page.evaluate(() => window.scrollTo(0, 0));
			await page.waitForTimeout(600);
			await page.screenshot({ path: `${out}/page-${vp.name}-full.png`, fullPage: true, timeout: 30000 }).catch((e) => console.log('full failed', e.message));
		}
		await page.evaluate(() => window.scrollTo(0, 0));
		await page.waitForTimeout(400);
		const m = await page.evaluate(measureFn);
		m.docHeight = docH;
		writeFileSync(`${out}/measure-${vp.name}.json`, JSON.stringify(m, null, 1));
		await ctx.close();
	}
}
await browser.close();
console.log('captured', site, '->', out);
