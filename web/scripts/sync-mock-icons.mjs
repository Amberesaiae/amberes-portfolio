// Dev-only: copy the temporary roydenso mock dock icons into static/_mock/dock/ and the intro-film
// photographs (pieces, cuts, paper, dust) into static/_mock/intro/. Both are gitignored.
// Also exposes a guard: `node scripts/sync-mock-icons.mjs --guard` fails if static/_mock exists
// unless MOCKS_OK=1, so mock images can't be shipped by accident.
import { cpSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = resolve(root, '../reference/roydenso-dock');
const mockDir = resolve(root, 'static/_mock');
const dest = resolve(mockDir, 'dock');
const introSrc = resolve(root, '../reference/roydenso-intro/assets/assets/intro');
const introDest = resolve(mockDir, 'intro');

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

function syncIntro() {
	if (!existsSync(introSrc)) {
		console.log('[mock-intro] reference/roydenso-intro not found, skipping (SVG stand-ins stay).');
		return;
	}
	// Pieces, cuts, paper tooth, plain dust loop (hero hands/showreel belong to the board hero plate).
	cpSync(introSrc, introDest, { recursive: true });
	console.log('[mock-intro] copied intro assets to static/_mock/intro/');
}
