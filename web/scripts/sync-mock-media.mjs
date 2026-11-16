// Dev-only: copy the temporary roydenso mock board media into static/_mock/board/.
// Source: reference/roydenso-playground (user-authorised temporary mocks, never shipped).
// Picked by measured aspect ratio: landscape -> house cards (+ hero poster), portrait -> 160x220
// cards, near-square -> the 358px work tiles. Output names are house-NN / portrait-NN / square-NN.
import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = resolve(root, '../reference/roydenso-playground');
const dest = resolve(root, 'static/_mock/board');

const pad = (n) => String(n + 1).padStart(2, '0');
const groups = {
	house: [
		'0GMXUxaYvnYAZTlf3PwTHsHI0.webp',
		'0UG0l85fGFnlKKnONUR3l8Oiac.webp',
		'0mp0OHnlz8dlxBkAuMMjd138k.webp',
		'0vX8Juz42ur8ryTL2qdiMeOg.webp',
		'1drpBwQbdcmXRDfMZzpDxqDtStE.webp',
		'2a5OdmiWgO1ZoI8ICJLNmZ7hbFU.webp',
		'3MEmQf5xwvXKfLI8oj3c7WayZA.webp',
		'6T2TSxF47yqNsaJ4QU6uvHekkQc.webp',
		'6kDwD2LCoGojOjJQv1kgaigfhk.webp',
		'6rYOXZF43u6iyRsGmUFX9rWH8.webp',
		'6xpoEuWsKTZviJVTa1pJwpEzj3U.webp',
		'7aJPmv45DwDdtwnTh9ynJVy09k.webp',
		'7icJFLJOury5LSU5oEC6h4pIRfI.webp',
		'8aI1H7JApaDKjkSJNNoO8HrpoGk.webp',
		'9XaKw20pMEdhbCjtUWf2ugm5ME.webp',
		'ANaZaF9nIUfCyrdURSKvweoOTwE.webp',
		'CNrCmqtc7DU2hFsTlb0zcLGQmsQ.webp',
		'DA7JqJ2hFIxgL1aUdXQtR9z8Dh4.webp',
		'HXHMU9znP2Ceetj1SsnhSH0sjU.webp',
		'IoO7a0bLccWmIBEEWmqN4f26Q.webp',
		'K3ODMAcg3GwNbZ0VhZbWsshsAPc.webp',
		'M6HAxh15bvW4V3QFYHqTmJUOI.webp',
		'Nc605I5Ho9Tua79NkAK3hzuyDg.webp',
		'NjCtFU3t4fzJ6pV0qpJFBgnxfg.webp',
		'OQ2TGvM4kSkwRi3eAmnTg591BaA.webp',
		'R8hO9DLGzInJGQ6ONdn12M0wU08.webp',
		'TIng2YGoKBfo1IJIIvTYehW4RKY.webp',
		'VsVh74nO7m1Dic34JuIhskAPM0Q.webp',
		'W6NYtDB9a0eMWM4WiDgXA46tE.webp',
	],
	portrait: [
		'1aHVMndQZ8NRO1iq7ygvFeIXsI.webp',
		'90k9Jzm1XtImrWbJojro8oZfo4w.webp',
		'AnJx4EAieJKYxD9ewSannpMbZE.webp',
		'GkxsF1uS4i2dNaB1ZbPQMLFJzD8.webp',
		'IMderl38mjfxPSXFnkzCd8qzF8.webp',
		'LGQQxxJ6yH5QFnDS9gUdWLmUg.webp',
		'NifCIxY2UitarpSJBmdpnbO71k.webp',
		'ad7YZu5eXTVYpOw7QeRfvbfhqQ.webp',
		'ePb4mbFRJ5UUlC08HZA4ihZKI.webp',
		'hKDvZkKx7oLnzFb0OckvfH5I.webp',
		'jbGBljRri75VLWdMUdO5A4l6R4.webp',
		'qBAll0d0pLeQiIDkMeAL1gUcKQ.webp',
		'tL98futpdKFjmGsxJRarzejLdrg.webp',
		'wG57L1JYJJRl8NCFD1uWEzLgU.webp',
	],
	square: [
		'6wWvkt1N3QXb7avsjTGAtHANY.webp',
		'M8u9G4jdVmq0WR6NiR4t2pnesY.webp',
		'aQLj0xBFAoUq4RfvQeORNTyX0hI.webp',
		'aVomamqcZokDGNkq0e98i1jJPnI.webp',
		'gDWX2qLkoEpJDn66bEJL0KMnpM.webp',
		'hQAubQ4vbPyESSU2HOgawROk9E.webp',
		'jPdMIRkNEnbRdwjMMoMxpUnI.webp',
		'mUkW0iGdbk1I1JLbSqUw3lqgKFc.webp',
		'nvMaUC2veD9h421tRub9lWyoCfE.webp',
		'o5fCZhnF72cZZobIZVkg04xwv8.webp',
		'p7RD9047gIIworZkpQBzkrOzA4.webp',
		'yzAVgOUTRFLau2rmwYWPmVHOkn8.webp',
	]
};
const POSTER = 'WYwOfs18ObvfptvCGllUagAB7m0.webp';
const VIDEO = 'O5G5rjMIrGmf9DYKMWqieF0.webm';

export function syncMockBoard() {
	if (!existsSync(resolve(src, 'images'))) {
		console.log('[mock-board] reference/roydenso-playground not found, skipping (placeholders stay).');
		return;
	}
	mkdirSync(dest, { recursive: true });
	let n = 0;
	for (const [kind, files] of Object.entries(groups)) {
		files.forEach((f, i) => {
			cpSync(resolve(src, 'images', f), resolve(dest, `${kind}-${pad(i)}.webp`));
			n++;
		});
	}
	cpSync(resolve(src, 'images', POSTER), resolve(dest, 'hero-poster.webp'));
	cpSync(resolve(src, 'media', VIDEO), resolve(dest, 'hero.webm'));
	console.log(`[mock-board] copied ${n + 2} files to static/_mock/board/`);
}
