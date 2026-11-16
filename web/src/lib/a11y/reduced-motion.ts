import { readable, get, type Readable } from 'svelte/store';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * True when the user prefers reduced motion. SSR-safe (false on the server).
 * Subscribe with `$reducedMotion` in components; read once with `prefersReducedMotion()`.
 * Intro, physics and dock MUST gate motion on this (see docs/amber-studio/A11Y.md).
 */
export const reducedMotion: Readable<boolean> = readable(false, (set) => {
	if (typeof window === 'undefined' || !window.matchMedia) return;
	const mq = window.matchMedia(QUERY);
	set(mq.matches);
	const onChange = (e: MediaQueryListEvent) => set(e.matches);
	mq.addEventListener('change', onChange);
	return () => mq.removeEventListener('change', onChange);
});

export function prefersReducedMotion(): boolean {
	if (typeof window === 'undefined' || !window.matchMedia) return false;
	return window.matchMedia(QUERY).matches;
}

/** Convenience: pick a duration (ms) honouring the preference. */
export function motionDuration(ms: number): number {
	return get(reducedMotion) ? 0 : ms;
}
