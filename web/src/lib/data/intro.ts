/** Content + timing for the opening film. Placeholder art only: no photographs are shipped. */

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

/** Milliseconds. Whole sequence (play + reveal) lands inside ~2.6s after the film mounts. */
export const introTiming = {
	/** Camera pan across the five pieces. */
	pan: 700,
	/** Each full-bleed cut is held this long. */
	cutHold: 150,
	/** Veil fade-up before reveal (also the delay before the hand-off starts). */
	veil: 100,
	/** Time from `reveal` until the film is unmounted (covers the longest stagger). */
	revealTail: 800,
	/** Film fade-out when revealing. */
	fade: 600
} as const;

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
