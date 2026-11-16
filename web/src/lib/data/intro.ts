/** Content + timing for the opening film. Placeholder art only: no photographs are shipped. */

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
	/** oklch hue for the placeholder. */
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
	{ id: 'tandohstay-phone', label: 'TandohStay', size: [2000, 1500], at: [0, 0], w: 1100, turn: -7, look: [0.5, 0.42, 0.6], hue: 62 },
	{ id: 'needbe-print', label: 'NeedBe', size: [2000, 1500], at: [1020, -420], w: 1050, turn: 9, look: [0.5, 0.5, 0.62], hue: 200 },
	{ id: 'continuum-laptop', label: 'Continuum', size: [2400, 1350], at: [1600, 330], w: 980, turn: -5, look: [0.3, 0.45, 0.62], hue: 285 },
	{ id: 'studio-tray', label: 'Amber Studio', size: [1600, 2000], at: [800, 800], w: 640, turn: 11, look: [0.5, 0.4, 0.72], hue: 48 },
	{ id: 'reel-08', label: 'Reel 08', size: [768, 515], at: [-80, 700], w: 860, turn: -9, look: [0.5, 0.55, 0.8], hue: 150 }
];

export const introCuts: readonly IntroCutData[] = [
	{ id: 'tandohstay', label: 'TandohStay', focus: 0.49, hue: 62 },
	{ id: 'needbe', label: 'NeedBe', focus: 0.73, hue: 200 },
	{ id: 'continuum', label: 'Continuum', focus: 0.36, hue: 285 },
	{ id: 'studio', label: 'Amber Studio', focus: 0.52, hue: 48 },
	{ id: 'skyline', label: 'Amber', focus: 0.33, centre: 0.33, drop: 0.06, hue: 35 }
];

/** Milliseconds. Total film is roughly 3s, then a ~1.7s staggered hand-off. */
export const introTiming = {
	/** Camera pan across the five pieces. */
	pan: 1700,
	/** Each full-bleed cut is held this long. */
	cutHold: 220,
	/** Veil fade-up before reveal. */
	veil: 400,
	/** Time from `reveal` until the film is unmounted (covers the longest stagger). */
	revealTail: 1700
} as const;

export const introStorageKey = 'amber-intro-seen';

/** Data URI of a tiny feTurbulence tile, used as paper tooth and film grain (no image files). */
export const noiseTile = (baseFrequency: number): string =>
	`url("data:image/svg+xml;utf8,${encodeURIComponent(
		`<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${baseFrequency}' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`
	)}")`;
