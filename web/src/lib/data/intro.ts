/**
 * Content + timing for the opening film. Placeholder art only: no photographs are shipped.
 * Dev-only exception: temporary roydenso mock media (see `introMock`), never present in a production bundle.
 */

export type IntroScene = 'phone' | 'print' | 'laptop' | 'tray' | 'reel';

export interface IntroPieceData {
	id: string;
	label: string;
	/** Source aspect of the (future) photograph, px. */
	size: [number, number];
	/** Top-left position on the virtual board, px. */
	at: [number, number];
	/** Rendered width on the board, px. */
	w: number;
	/** Rotation in degrees. */
	turn: number;
	/** Light focus x, y (0-1) and strength (0-1) for the placeholder highlight. */
	look: [number, number, number];
	/** Which flat-lay stand-in to draw (see IntroScene). */
	scene: IntroScene;
	/** oklch hue for the placeholder (kept near-neutral: ink and paper, no saturated plates). */
	hue: number;
}

export interface IntroCutData {
	id: string;
	label: string;
	/** Vertical crop anchor (0-1) of the held card inside the frame. */
	focus: number;
	/** Optional horizontal centre override (0-1). */
	centre?: number;
	/** Optional extra downward offset (fraction of frame height). */
	drop?: number;
	hue: number;
}

export const introPieces: readonly IntroPieceData[] = [
	{ id: 'tandohstay-phone', label: 'TandohStay', size: [2000, 1500], at: [0, 0], w: 1100, turn: -7, look: [0.5, 0.42, 0.6], scene: 'phone', hue: 75 },
	{ id: 'needbe-print', label: 'NeedBe', size: [2000, 1500], at: [1020, -420], w: 1050, turn: 9, look: [0.5, 0.5, 0.62], scene: 'print', hue: 85 },
	{ id: 'continuum-laptop', label: 'Continuum', size: [2400, 1350], at: [1600, 330], w: 980, turn: -5, look: [0.3, 0.45, 0.62], scene: 'laptop', hue: 70 },
	{ id: 'studio-tray', label: 'Amber Studio', size: [1600, 2000], at: [800, 800], w: 640, turn: 11, look: [0.5, 0.4, 0.72], scene: 'tray', hue: 80 },
	{ id: 'reel-08', label: 'Reel 08', size: [768, 515], at: [-80, 700], w: 860, turn: -9, look: [0.5, 0.55, 0.8], scene: 'reel', hue: 90 }
];

export const introCuts: readonly IntroCutData[] = [
	{ id: 'tandohstay', label: 'TandohStay', focus: 0.49, hue: 75 },
	{ id: 'needbe', label: 'NeedBe', focus: 0.73, hue: 85 },
	{ id: 'continuum', label: 'Continuum', focus: 0.36, hue: 70 },
	{ id: 'studio', label: 'Amber Studio', focus: 0.52, hue: 80 },
	{ id: 'skyline', label: 'Amber', focus: 0.33, centre: 0.33, drop: 0.06, hue: 65 }
];

/** Milliseconds. Film = pan 400 + 5 cuts x 80 + hands 320 + veil 60 = 1.18s (0.86s without mock hands) + 850ms reveal tail (longest stagger: hands 500 + 350). Dev preload is capped at 350ms. */
export const introTiming = {
	/** Camera pan across the five pieces. */
	pan: 400,
	/** Each full-bleed cut is held this long. */
	cutHold: 80,
	/** Veil fade-up before reveal (also the delay before the hand-off starts). */
	veil: 60,
	/** Hero plate settling: hands go soft15 -> soft5 -> sharp while showreel stills flicker in the card. */
	hands: 320,
	/** Showreel still swap interval inside the held card (teardown: 500ms, compressed to fit the film). */
	reelStep: 64,
	/** Time from `reveal` until the film is unmounted (covers the longest stagger). */
	revealTail: 850,
	/** Film fade-out when revealing. */
	fade: 600
} as const;

/** Hand-off stagger (ms) after `reveal`, from the teardown: paper +150, header +350, hands +500. Mirrored in Intro.svelte CSS and checked by stagger.test.ts. */
export const introStagger = { paper: 150, header: 350, hands: 500 } as const;
/** Duration (ms) of each staggered fade; delay + duration must stay <= introTiming.revealTail. */
export const introStaggerDuration = { base: 500, paper: 500, header: 500, hands: 350 } as const;

export const introStorageKey = 'amber-intro-seen';

/** Data URI of a tiny feTurbulence tile, used as paper tooth and film grain (no image files). */
export const noiseTile = (baseFrequency: number): string =>
	`url("data:image/svg+xml;utf8,${encodeURIComponent(
		`<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${baseFrequency}' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`
	)}")`;

/** Opaque grey paper tooth (fibres + fine grain). Opaque so hard-light visibly modulates the print beneath. */
export const paperTile = (): string =>
	`url("data:image/svg+xml;utf8,${encodeURIComponent(
		"<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='p'><feTurbulence type='fractalNoise' baseFrequency='0.9 0.5' numOctaves='3' seed='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/><feComponentTransfer><feFuncR type='linear' slope='2.2' intercept='-0.55'/><feFuncG type='linear' slope='2.2' intercept='-0.55'/><feFuncB type='linear' slope='2.2' intercept='-0.55'/></feComponentTransfer></filter><rect width='100%' height='100%' filter='url(#p)'/></svg>"
	)}")`;

/** Dust specks, hairs and a few scratches on black, for `screen` blending. */
export const dustTile = (): string =>
	`url("data:image/svg+xml;utf8,${encodeURIComponent(
		"<svg xmlns='http://www.w3.org/2000/svg' width='420' height='320'><rect width='100%' height='100%' fill='black'/><g fill='white'><circle cx='40' cy='60' r='1.6' opacity='.9'/><circle cx='120' cy='210' r='1.1' opacity='.7'/><circle cx='210' cy='40' r='2.2' opacity='.8'/><circle cx='300' cy='150' r='1.3' opacity='.9'/><circle cx='360' cy='270' r='1.8' opacity='.6'/><circle cx='90' cy='290' r='1' opacity='.8'/><circle cx='250' cy='250' r='1.4' opacity='.7'/><circle cx='170' cy='120' r='.9' opacity='.9'/><circle cx='395' cy='60' r='1.2' opacity='.7'/><circle cx='20' cy='170' r='1.5' opacity='.6'/></g><g fill='none' stroke='white' stroke-linecap='round'><path d='M60 120 q18 -14 40 -6 t30 10' stroke-width='.8' opacity='.7'/><path d='M280 60 q10 24 4 46' stroke-width='.7' opacity='.6'/><path d='M330 220 l34 -9' stroke-width='.6' opacity='.8'/><path d='M150 30 q-6 18 8 30' stroke-width='.6' opacity='.5'/></g></svg>"
	)}")`;

/** Temporary mock media (DEV ONLY). Copied into static/_mock/intro by scripts/sync-mock-icons.mjs; absent in production. */
export interface IntroMock {
	paper: string;
	dust: string;
	tooth: string;
	base: { src: string; srcset: string };
	hands: { left: HandSet; right: HandSet };
	reel: string[];
	pieces: Record<string, string>;
	cuts: Record<string, string>;
}
export interface HandSet {
	soft15: string;
	soft5: string;
	srcset: string;
}

function buildMock(): IntroMock | undefined {
	if (!import.meta.env.DEV) return undefined; // dead-code-eliminated in production: no `_mock` string ships
	const m = (p: string) => `/_mock/intro/${p}`;
	const hand = (side: 'left' | 'right', widths: number[]): HandSet => ({
		soft15: m(`hero/hand-${side}-soft15.webp`),
		soft5: m(`hero/hand-${side}-soft5.webp`),
		srcset: widths.map((w) => `${m(`hero/hand-${side}-${w}.webp`)} ${w}w`).join(', ')
	});
	return {
		paper: m('intro/paper/paper-grain-2048.webp'),
		dust: m('intro/dust/plain/dust-1600.mp4'),
		tooth: m('hero/showreel-tooth.webp'),
		base: { src: m('hero/hands-base-v2-640.webp'), srcset: `${m('hero/hands-base-v2-640.webp')} 640w, ${m('hero/hands-base-v2-1080.webp')} 727w` },
		hands: { left: hand('left', [384, 640, 1080]), right: hand('right', [384, 640, 1080]) },
		reel: ['phia-v2', 'fomo-hand-v1', 'joiner-v2', 'live-time-v4', 'phia-logo-v2', 'sabotage-v2', '01-v2', 'phia-feed-v2'].map((f) => m(`hero/showreel/${f}.webp`)),
		pieces: {
			'tandohstay-phone': m('intro/pieces/current-phones.webp'),
			'needbe-print': m('intro/pieces/live-time-row-v2.webp'),
			'continuum-laptop': m('intro/pieces/ob1-phone.webp'),
			'studio-tray': m('intro/pieces/phia-tray-1280.webp'),
			'reel-08': m('intro/pieces/reel-08.webp')
		},
		cuts: {
			tandohstay: m('intro/cuts/sabotage-v3-1280.webp'),
			needbe: m('intro/cuts/make-them-hear-you-v3-1280.webp'),
			continuum: m('intro/cuts/swatches-v3-1280.webp'),
			studio: m('intro/cuts/phia-v3-1280.webp'),
			skyline: m('intro/cuts/skyline-v3-1280.webp')
		}
	};
}

export const introMock: IntroMock | undefined = buildMock();

/** Files the first frames need; the film waits for these only (cuts, hands and reel stills warm in the background). */
export function introMockCritical(m: IntroMock): string[] {
	return [m.paper, ...Object.values(m.pieces)];
}

/** Every URL the film needs before it can start with mock media. The hand srcset is skipped: one width is enough to warm. */
export function introMockUrls(m: IntroMock): string[] {
	return [
		m.paper, m.tooth, m.base.src, m.base.srcset.split(' ')[2],
		m.hands.left.soft15, m.hands.left.soft5, m.hands.right.soft15, m.hands.right.soft5,
		...m.reel.slice(0, 6), m.hands.left.srcset.split(' ')[2], m.hands.right.srcset.split(' ')[2],
		...Object.values(m.pieces), ...Object.values(m.cuts)
	];
}
