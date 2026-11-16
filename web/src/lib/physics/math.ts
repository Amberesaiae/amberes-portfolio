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

/** Parses a CSS `rotate` value ("5deg", "-0.1rad", "0.25turn", "none") to radians. */
export function parseRotate(value: string | null | undefined): number {
	if (!value) return 0;
	const m = /^\s*(-?\d*\.?\d+(?:e-?\d+)?)(deg|rad|turn|grad)?\s*$/i.exec(value);
	if (!m) return 0;
	const n = parseFloat(m[1]);
	switch ((m[2] ?? 'rad').toLowerCase()) {
		case 'deg':
			return (n * Math.PI) / 180;
		case 'turn':
			return n * 2 * Math.PI;
		case 'grad':
			return (n * Math.PI) / 200;
		default:
			return n;
	}
}

/** The angle equivalent to `angle` (mod 2π) that is closest to `target`. */
export function nearestAngle(angle: number, target: number): number {
	const tau = Math.PI * 2;
	return target + ((((angle - target + Math.PI) % tau) + tau) % tau) - Math.PI;
}

/**
 * Floor height inside the container: the container's bottom, or the viewport's bottom
 * (minus `inset`) when that is higher, never below `min` nor above `containerHeight`.
 */
export function floorHeight(
	containerTop: number,
	containerHeight: number,
	viewportHeight: number,
	inset: number,
	min: number
): number {
	const visible = viewportHeight - inset - containerTop;
	return Math.min(containerHeight, Math.max(Math.min(min, containerHeight), visible));
}
