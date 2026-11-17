// Shared helpers for the pixel-fidelity harness. Own area: web/scripts/pixel/**
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';

export const VIEWPORTS = [
	{ name: '1440', width: 1440, height: 900 },
	{ name: '390', width: 390, height: 844 }
];
export const SCROLLS = [0, 900, 1800, 2700];
export const FRAME_STEP_MS = 250;
export const FRAME_COUNT = 21; // t = 0..5000ms every 250ms (spec: first 3s; the rest catches our longer film)

export const SITES = {
	live: { url: 'https://roydenso.com/', settleMs: 6500, gate: null },
	local: { url: 'http://127.0.0.1:5173/', settleMs: 5500, gate: 'amber-intro-seen' }
};

export function chromePath() {
	const c = [
		process.env.PIXEL_CHROME,
		'/opt/pw-browsers/chromium-1243/chrome-linux64/chrome',
		'/opt/pw-browsers/chromium/chrome'
	].filter(Boolean);
	return c.find((p) => existsSync(p));
}

export async function launch() {
	const executablePath = chromePath();
	return chromium.launch({ ...(executablePath ? { executablePath } : {}), args: ['--no-sandbox'] });
}

/** Fixed Math.random (mulberry32) so physics scatter is reproducible. */
export const SEED_SCRIPT = `(() => { let a = 0x9e3779b9; Math.random = () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; })();`;

export function arg(name, def) {
	const i = process.argv.indexOf('--' + name);
	return i > -1 ? process.argv[i + 1] : def;
}
