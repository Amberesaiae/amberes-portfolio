/** WCAG contrast helpers for the oklch design tokens (greyscale and general). */

export type Oklch = { l: number; c: number; h: number };

export function parseOklch(s: string): Oklch {
	const m = s.match(/oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)?\s*(?:\/[^)]*)?\)/i);
	if (!m) throw new Error(`Not an oklch() colour: ${s}`);
	return { l: parseFloat(m[1]) / (m[2] ? 100 : 1), c: parseFloat(m[3]), h: parseFloat(m[4] ?? '0') };
}

export function oklchToLinearSrgb({ l, c, h }: Oklch): [number, number, number] {
	const a = c * Math.cos((h * Math.PI) / 180);
	const b = c * Math.sin((h * Math.PI) / 180);
	const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
	const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
	const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
	const r = 4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_;
	const g = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_;
	const bl = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_;
	const clamp = (x: number) => Math.min(1, Math.max(0, x));
	return [clamp(r), clamp(g), clamp(bl)];
}

export function luminance(color: string): number {
	const [r, g, b] = oklchToLinearSrgb(parseOklch(color));
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(fg: string, bg: string): number {
	const a = luminance(fg);
	const b = luminance(bg);
	return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

export type ContrastPair = { name: string; fg: string; bg: string; min: number };

/** Required pairs for the grey board palette. Keep in sync with layout.css. */
export const boardPalette = {
	background: 'oklch(0.93 0 0)',
	foreground: 'oklch(0.15 0 0)',
	card: 'oklch(1 0 0)',
	cardForeground: 'oklch(0.15 0 0)',
	primary: 'oklch(0.18 0 0)',
	primaryForeground: 'oklch(0.98 0 0)',
	muted: 'oklch(0.96 0 0)',
	mutedForeground: 'oklch(0.45 0 0)',
	border: 'oklch(0.88 0 0)',
	ring: 'oklch(0.4 0 0)'
} as const;

export const boardContrastPairs: ContrastPair[] = [
	{ name: 'text on board grey', fg: boardPalette.foreground, bg: boardPalette.background, min: 4.5 },
	{ name: 'text on card', fg: boardPalette.cardForeground, bg: boardPalette.card, min: 4.5 },
	{ name: 'primary button text', fg: boardPalette.primaryForeground, bg: boardPalette.primary, min: 4.5 },
	{ name: 'muted text on board grey', fg: boardPalette.mutedForeground, bg: boardPalette.background, min: 4.5 },
	{ name: 'muted text on card', fg: boardPalette.mutedForeground, bg: boardPalette.card, min: 4.5 },
	{ name: 'muted text on muted', fg: boardPalette.mutedForeground, bg: boardPalette.muted, min: 4.5 },
	{ name: 'focus ring on board grey (1.4.11)', fg: boardPalette.ring, bg: boardPalette.background, min: 3 },
	{ name: 'focus ring on card (1.4.11)', fg: boardPalette.ring, bg: boardPalette.card, min: 3 },
	{ name: 'focus ring on primary/dark (1.4.11)', fg: 'oklch(0.98 0 0)', bg: boardPalette.primary, min: 3 },
	{ name: 'card edge vs board grey (informational, 1.4.11 if edge conveys boundary)', fg: boardPalette.border, bg: boardPalette.background, min: 1 }
];

export function checkBoardContrast() {
	return boardContrastPairs.map((p) => {
		const ratio = contrastRatio(p.fg, p.bg);
		return { ...p, ratio, pass: ratio >= p.min };
	});
}
