// Dev-only: copy the temporary roydenso mock dock icons into static/_mock/dock/ and the intro mock media
// (reference/roydenso-intro) into static/_mock/intro/.
// Also exposes a guard: `node scripts/sync-mock-icons.mjs --guard` fails if static/_mock exists
// unless MOCKS_OK=1, so mock images can't be shipped by accident.
import { cpSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = resolve(root, '../reference/roydenso-dock');
const mockDir = resolve(root, 'static/_mock');
const dest = resolve(mockDir, 'dock');

if (process.argv.includes('--guard')) {
	if (existsSync(mockDir) && process.env.MOCKS_OK !== '1') {
		console.error(
			'\n[guard] web/static/_mock exists: temporary mock images would ship in this build.\n' +
				'Delete web/static/_mock, or set MOCKS_OK=1 for a local/preview build.\n'
		);
		process.exit(1);
	}
} else {
	syncIcons();
	syncIntro();
}

function syncIntro() {
	const introSrc = resolve(root, '../reference/roydenso-intro/assets/assets');
	if (!existsSync(introSrc)) {
		console.log('[mock-intro] reference/roydenso-intro not found, skipping (SVG/CSS stand-ins stay).');
		return;
	}
	const hero = (n) => `hero/${n}.webp`;
	const files = [
		'intro/paper/paper-grain-2048.webp',
		'intro/dust/plain/dust-1600.mp4',
		hero('showreel-tooth'),
		hero('hands-base-v2-640'),
		hero('hands-base-v2-1080'),
		...['left', 'right'].flatMap((s) => [384, 640, 1080].map((w) => hero(`hand-${s}-${w}`)).concat([hero(`hand-${s}-soft5`), hero(`hand-${s}-soft15`)])),
		...['phia-v2', 'fomo-hand-v1', 'joiner-v2', 'live-time-v4', 'phia-logo-v2', 'sabotage-v2', '01-v2', 'phia-feed-v2'].map((f) => hero(`showreel/${f}`)),
		...['current-phones', 'live-time-row-v2', 'ob1-phone', 'phia-tray-1280', 'reel-08'].map((f) => `intro/pieces/${f}.webp`),
		...['sabotage', 'make-them-hear-you', 'swatches', 'phia', 'skyline'].map((f) => `intro/cuts/${f}-v3-1280.webp`)
	];
	let n = 0;
	for (const f of files) {
		const from = resolve(introSrc, f);
		if (!existsSync(from)) {
			console.warn(`[mock-intro] missing ${f}`);
			continue;
		}
		mkdirSync(dirname(resolve(mockDir, 'intro', f)), { recursive: true });
		cpSync(from, resolve(mockDir, 'intro', f));
		n++;
	}
	console.log(`[mock-intro] copied ${n}/${files.length} files to static/_mock/intro/`);
}

function syncIcons() {
	if (!existsSync(src)) {
		console.log('[mock-icons] reference/roydenso-dock not found, skipping (Lucide fallback stays).');
		return;
	}
	mkdirSync(dest, { recursive: true });
	const files = readdirSync(src).filter((f) => f.endsWith('.png'));
	for (const f of files) cpSync(resolve(src, f), resolve(dest, f));
	console.log(`[mock-icons] copied ${files.length} icons to static/_mock/dock/`);
}
