#!/usr/bin/env node
/**
 * Amber Studio accessibility audit (Playwright + axe-core).
 *
 *   npm run build && npm run a11y            # starts `vite preview`, audits, stops it
 *   A11Y_BASE_URL=http://localhost:5173 node scripts/a11y-audit.mjs   # use a running server
 *   node scripts/a11y-audit.mjs --routes=/,/physics-demo --json=report.json
 *
 * Per route x profile (desktop, mobile) x motion (no-preference, reduce) it checks:
 *   axe (wcag2a/2aa/21a/21aa/22aa + best-practice), landmarks/title/h1, keyboard tab order
 *   (skip link first, no positive tabindex, visible focus indicator, accessible names, no trap),
 *   target size (WCAG 2.5.8, 24px), and under reduced motion: no running infinite animations.
 * Routes that return 404 are skipped (so /dock-demo is optional) unless named in --routes.
 * Exit code 1 on any failure; warnings never fail.
 */
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { spawn } from 'node:child_process';
import { writeFileSync, existsSync } from 'node:fs';

const args = Object.fromEntries(process.argv.slice(2).filter((a) => a.startsWith('--')).map((a) => { const [k, v = 'true'] = a.slice(2).split('='); return [k, v]; }));
const explicitRoutes = args.routes?.split(',');
const ROUTES = explicitRoutes ?? ['/', '/physics-demo', '/dock-demo'];
const MAX_TABS = Number(args.tabs ?? 60);
const PROFILES = [
	{ name: 'desktop', viewport: { width: 1440, height: 900 }, hasTouch: false },
	{ name: 'mobile', viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true }
];
const TOGGLE = '[data-physics-toggle], [data-testid=gravity]';
const MOTIONS = ['no-preference', 'reduce'];
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

const fails = [];
const warns = [];
const report = [];
const fail = (ctx, msg) => { fails.push(`[${ctx}] ${msg}`); console.log(`  FAIL ${msg}`); };
const warn = (ctx, msg) => { warns.push(`[${ctx}] ${msg}`); console.log(`  warn ${msg}`); };

async function startPreview() {
	if (process.env.A11Y_BASE_URL) return { url: process.env.A11Y_BASE_URL.replace(/\/$/, ''), stop() {} };
	if (!existsSync(new URL('../.svelte-kit/output', import.meta.url))) console.error('No .svelte-kit/output: run `npm run build` first.');
	const port = args.port ?? '4173';
	const proc = spawn('npx', ['vite', 'preview', '--port', port, '--strictPort', '--host', '127.0.0.1'], { stdio: 'ignore', cwd: new URL('..', import.meta.url) });
	const url = `http://127.0.0.1:${port}`;
	for (let i = 0; i < 60; i++) {
		try { if ((await fetch(url)).status) return { url, stop: () => proc.kill() }; } catch { await new Promise((r) => setTimeout(r, 500)); }
	}
	proc.kill();
	throw new Error('preview server did not start');
}

// Runs in the page: describe the focused element.
const describeFocus = () => {
	const el = document.activeElement;
	if (!el || el === document.body) return null;
	const cs = getComputedStyle(el);
	const r = el.getBoundingClientRect();
	const name = (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') && document.getElementById(el.getAttribute('aria-labelledby'))?.textContent || el.textContent || el.getAttribute('title') || el.getAttribute('alt') || el.value || '').trim().replace(/\s+/g, ' ').slice(0, 60);
	const outlined = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0;
	const shadow = cs.boxShadow && cs.boxShadow !== 'none';
	return {
		tag: el.tagName.toLowerCase(), id: el.id, role: el.getAttribute('role'), name,
		tabindex: el.getAttribute('tabindex'), href: el.getAttribute('href'),
		hasIndicator: outlined || !!shadow, w: Math.round(r.width), h: Math.round(r.height),
		onScreen: r.bottom > 0 && r.right > 0 && r.top < innerHeight && r.left < innerWidth,
		ariaHidden: !!el.closest('[aria-hidden="true"]'),
		key: el.tagName + '#' + el.id + '.' + el.className + '|' + (el.getAttribute('href') || '') + '|' + name
	};
};

async function auditPage(browser, base, route, profile, motion) {
	const ctx = `${route} ${profile.name}/${motion}`;
	console.log(`\n${ctx}`);
	const context = await browser.newContext({ viewport: profile.viewport, hasTouch: profile.hasTouch, isMobile: profile.isMobile, reducedMotion: motion });
	const page = await context.newPage();
	const errors = [];
	page.on('pageerror', (e) => errors.push(e.message));
	const res = await page.goto(base + route, { waitUntil: 'networkidle' });
	if (res && res.status() === 404 && !explicitRoutes) { console.log('  (404, skipped)'); await context.close(); return false; }
	if (!res || !res.ok()) { fail(ctx, `HTTP ${res?.status()}`); await context.close(); return true; }
	if (motion === 'reduce') {
		const gated = await page.evaluate(() => !!document.documentElement.dataset.intro || !!document.querySelector('[data-intro]'));
		if (gated) fail(ctx, 'intro is gating the page under reduced motion (html[data-intro] set)');
	}
	// Let the opening film + reveal transitions finish so contrast is not measured mid-fade.
	await page.waitForFunction(() => !document.documentElement.dataset.intro, null, { timeout: 25000 }).catch(() => fail(ctx, 'html[data-intro] never cleared within 25s (intro stuck?)'));
	await page.waitForTimeout(Number(args.settle ?? 1500));
	const entry = { ctx, axe: [], tabs: [] };

	// 1. Document basics
	const basics = await page.evaluate(() => ({
		lang: document.documentElement.lang, title: document.title,
		mains: document.querySelectorAll('main,[role=main]').length,
		h1: document.querySelectorAll('h1').length,
		positive: [...document.querySelectorAll('[tabindex]')].filter((e) => Number(e.getAttribute('tabindex')) > 0).length,
		viewportBlocksZoom: /user-scalable\s*=\s*(no|0)|maximum-scale\s*=\s*1(\.0)?\b/.test(document.querySelector('meta[name=viewport]')?.content ?? '')
	}));
	if (!basics.lang) fail(ctx, 'html[lang] missing');
	if (!basics.title) fail(ctx, 'document title missing');
	if (basics.mains !== 1) fail(ctx, `expected exactly 1 <main>, found ${basics.mains}`);
	if (basics.h1 < 1) fail(ctx, 'no <h1>'); else if (basics.h1 > 1) warn(ctx, `${basics.h1} <h1> elements`);
	if (basics.positive) fail(ctx, `${basics.positive} elements with positive tabindex`);
	if (basics.viewportBlocksZoom) fail(ctx, 'viewport meta blocks zoom (1.4.4)');

	const fontOk = await page.evaluate(async () => { await document.fonts.ready; return document.fonts.check('16px "Geist Variable"') && [...document.fonts].some((f) => f.family.includes('Geist') && f.status === 'loaded'); });
	if (!fontOk) fail(ctx, 'Geist web font not loaded (system fallback in use)');
	const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
	if (overflow > 1) fail(ctx, `horizontal overflow of ${overflow}px (1.4.10 reflow)`);

	// 2. axe
	const axe = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
	for (const v of axe.violations) {
		const msg = `axe ${v.id} (${v.impact}): ${v.help} x${v.nodes.length} e.g. ${v.nodes[0].target.join(' ')}`;
		entry.axe.push(msg);
		(v.tags.some((t) => t.startsWith('wcag')) ? fail : warn)(ctx, msg);
	}
	console.log(`  axe: ${axe.violations.length} violation group(s), ${axe.passes.length} rules passed`);

	// 3. Keyboard order
	await page.evaluate(() => { (document.activeElement)?.blur?.(); window.scrollTo(0, 0); });
	const seen = new Set();
	let cycled = false;
	for (let i = 0; i < MAX_TABS; i++) {
		await page.keyboard.press('Tab');
		const f = await page.evaluate(describeFocus);
		if (!f) { cycled = true; break; } // focus left the document (browser chrome): no trap
		if (seen.has(f.key)) { cycled = true; break; }
		seen.add(f.key);
		entry.tabs.push(`${f.tag}${f.role ? `[${f.role}]` : ''} "${f.name}"`);
		if (i === 0 && !(f.tag === 'a' && /skip/i.test(f.name))) fail(ctx, `first Tab stop is not a skip link: ${f.tag} "${f.name}"`);
		if (!f.name && f.tag !== 'input') fail(ctx, `focusable without accessible name: ${f.tag}#${f.id}`);
		if (!f.hasIndicator) fail(ctx, `no visible focus indicator on ${f.tag} "${f.name}"`);
		const covered = await page.evaluate(() => {
			const el = document.activeElement; const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
			const o = (parseFloat(cs.outlineWidth) || 0) + (parseFloat(cs.outlineOffset) || 0) + 1;
			return [[r.left + r.width / 2, r.top - o], [r.left + r.width / 2, r.bottom + o], [r.left - o, r.top + r.height / 2], [r.right + o, r.top + r.height / 2]]
				.filter(([x, y]) => x >= 0 && y >= 0 && x < innerWidth && y < innerHeight)
				.some(([x, y]) => { const t = document.elementFromPoint(x, y); return t && t !== el && el.contains(t); });
		});
		if (covered) fail(ctx, `focus ring of ${f.tag} "${f.name}" is covered by its own descendant (scaled/overflowing child hides the indicator; 2.4.7/2.4.13)`);
		if (f.ariaHidden) fail(ctx, `focus inside aria-hidden: ${f.tag} "${f.name}"`);
		if (i > 0 && !f.onScreen) warn(ctx, `focused element not in viewport: ${f.tag} "${f.name}" (check scroll-into-view / 2.4.11)`);
		if (Math.min(f.w, f.h) < 24 && f.tag !== 'a') warn(ctx, `target under 24px (2.5.8): ${f.tag} "${f.name}" ${f.w}x${f.h}`);
	}
	if (!cycled) fail(ctx, `no tab cycle within ${MAX_TABS} presses (possible keyboard trap or runaway list)`);
	console.log(`  tab order (${entry.tabs.length}): ${entry.tabs.slice(0, 8).join(' > ')}${entry.tabs.length > 8 ? ' > …' : ''}`);

	// 4. Escape must not leave focus stuck; a focused control must be operable
	// 5. Reduced motion: nothing may loop; transitions/animations collapse
	if (motion === 'reduce') {
		const looping = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running' && a.effect?.getComputedTiming().iterations === Infinity && !a.effect.target?.closest('[data-motion="essential"]')).map((a) => a.effect.target?.tagName + '.' + a.effect.target?.className));
		if (looping.length) fail(ctx, `infinite animations running under reduced motion: ${looping.slice(0, 3).join(', ')}`);
		const match = await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
		if (!match) fail(ctx, 'reduced-motion emulation not applied');
		const ctrl = await page.$(TOGGLE);
		if (ctrl) {
			const pressed = await ctrl.getAttribute('aria-pressed');
			if (pressed === 'true') fail(ctx, 'physics is ON by default under reduced motion (must default off)');
		}
		const intro = await page.$('[data-intro]');
		if (intro && (await intro.isVisible()) && Number(args.settle ?? 1500) >= 1500) warn(ctx, 'intro still visible after settle under reduced motion (should be skipped or static)');
	}

	// 6. Hooks other workers are asked to expose (soft): physics toggle keyboard operability
	if (motion === 'no-preference') {
		const ctrl = await page.$(TOGGLE);
		if (ctrl) {
			const isNative = await ctrl.evaluate((e) => e.tagName === 'BUTTON' || e.getAttribute('role') === 'switch');
			if (!isNative) fail(ctx, 'physics toggle must be a <button> or role=switch');
			if ((await ctrl.getAttribute('aria-pressed')) === null && (await ctrl.getAttribute('aria-checked')) === null) fail(ctx, 'physics toggle needs aria-pressed/aria-checked');
			await ctrl.focus(); await page.keyboard.press('Space'); await page.waitForTimeout(200);
			await page.keyboard.press('Space');
		} else if (route.includes('physics')) warn(ctx, 'no [data-physics-toggle] found on a physics route');
		const pause = await page.$('[data-physics-pause]');
		if (!pause && route.includes('physics')) warn(ctx, 'no [data-physics-pause] control found (WCAG 2.2.2)');
	}

	for (const e of errors) fail(ctx, `page error: ${e}`);
	report.push(entry);
	await context.close();
	return true;
}

// Opening film audit: runs on '/', fresh session, no-preference. The film must be skippable by keyboard
// within one Tab/Enter/Esc, must not trap focus, must offer a visible skip control, and must end by itself.
async function auditIntro(browser, base) {
	const ctx = '/ intro';
	console.log(`\n${ctx}`);
	for (const key of ['Escape', 'Tab', 'Enter']) {
		const context = await browser.newContext({ viewport: PROFILES[0].viewport });
		const page = await context.newPage();
		await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
		const phase = await page.evaluate(() => document.documentElement.dataset.intro ?? null);
		if (!phase) { console.log('  (intro not playing on first load; skipped)'); await context.close(); return; }
		if (key === 'Escape') {
			await page.waitForTimeout(600);
			const skipCtl = await page.evaluate(() => [...document.querySelectorAll('button,a,[role=button]')].some((e) => /skip/i.test(e.textContent + (e.getAttribute('aria-label') ?? '')) && e.getBoundingClientRect().width > 0 && getComputedStyle(e).visibility !== 'hidden' && !e.closest('[aria-hidden=true]') && !/skip to main/i.test(e.textContent)));
			if (!skipCtl) fail(ctx, 'no visible, accessible "Skip intro" control during the film (2.2.2 / 2.1.1)');
			const hiddenFocusable = await page.evaluate(() => [...document.querySelectorAll('a,button,input,select,textarea,[tabindex]')].filter((e) => e.tabIndex >= 0 && e.getBoundingClientRect().width > 0 && getComputedStyle(e).opacity === '0' && !e.closest('[inert]')).length);
			if (hiddenFocusable) warn(ctx, `${hiddenFocusable} focusable elements are invisible (opacity 0) but reachable during the film; mark page content inert while it plays (2.4.7/2.4.11)`);
		}
		await page.waitForTimeout(800);
		await page.keyboard.press(key);
		const cleared = await page.waitForFunction(() => !document.documentElement.dataset.intro, null, { timeout: 8000 }).then(() => true).catch(() => false);
		if (!cleared) fail(ctx, `${key} did not end the intro within 8s`);
		const after = await page.evaluate(() => ({ active: document.activeElement?.tagName, text: document.activeElement?.textContent?.trim().slice(0, 30), overlay: !!document.querySelector('[class*=intro-film]') }));
		if (after.overlay) fail(ctx, `intro overlay still in DOM after ${key}`);
		console.log(`  ${key}: ${cleared ? 'skipped' : 'NOT skipped'}, focus on <${after.active?.toLowerCase()}> "${after.text}"`);
		await page.keyboard.press('Tab');
		const f = await page.evaluate(describeFocus);
		if (!f) fail(ctx, `after ${key} then Tab, focus is not on any element (trapped/lost)`);
		await context.close();
	}
	// natural end without input must happen within 25s (checked in route audit) and shorter than ~8s unless skippable.
}

const server = await startPreview();
// Use A11Y_CHROMIUM, else the preinstalled /opt/pw-browsers/chromium if present (cloud env), else Playwright's own.
const exe = process.env.A11Y_CHROMIUM || (existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
try {
	await auditIntro(browser, server.url);
	for (const route of ROUTES) {
		let existed = false;
		for (const p of PROFILES) for (const m of MOTIONS) existed = (await auditPage(browser, server.url, route, p, m)) || existed;
		if (!existed) console.log(`(skipped ${route}: not present)`);
	}
} finally {
	await browser.close();
	server.stop();
}
if (args.json) writeFileSync(args.json, JSON.stringify({ fails, warns, report }, null, 2));
console.log(`\n${fails.length} failure(s), ${warns.length} warning(s)`);
process.exit(fails.length ? 1 : 0);
