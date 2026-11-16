/** Pure helpers for the physics engine (unit-tested, no DOM / matter-js). */

export const easeInOutCubic = (t: number): number =>
	t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** Progress 0..1 of an eased return; zero/negative duration completes immediately. */
export function returnProgress(now: number, start: number, duration: number): number {
	if (duration <= 0) return 1;
	return Math.min(1, Math.max(0, (now - start) / duration));
}

/** Offset/angle remaining after easing from `from` toward layout (0). */
export function easedOffset(from: number, progress: number): number {
	return from * (1 - easeInOutCubic(progress));
}

/** Clamp a centre coordinate so a box of `size` stays inside [0, extent]. */
export function clampCenter(center: number, size: number, extent: number): number {
	const half = size / 2;
	return Math.min(Math.max(center, half), Math.max(half, extent - half));
}

/** Layout centre = visual bbox centre minus the translate currently applied. */
export function layoutCenter(visualCenter: number, appliedOffset: number): number {
	return visualCenter - appliedOffset;
}
