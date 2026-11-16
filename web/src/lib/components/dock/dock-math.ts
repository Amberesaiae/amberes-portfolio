/** Raised-cosine falloff: 1 at the pointer, 0 at `radius`, smooth at both ends. */
export function magnifyScale(distance: number, radius: number, max: number): number {
	const t = Math.min(Math.abs(distance) / radius, 1);
	const f = 0.5 * (1 + Math.cos(Math.PI * t));
	return 1 + (max - 1) * f;
}
