import { writable, type Readable } from 'svelte/store';
import { introStorageKey } from '#lib/data/intro.js';

/** idle: not decided yet (SSR / before mount). play: film running. reveal: page fading up. done: nothing on screen. */
export type IntroPhase = 'idle' | 'play' | 'reveal' | 'done';

const phase = writable<IntroPhase>('idle');

export const introPhase: Readable<IntroPhase> = { subscribe: phase.subscribe };

let seenInMemory = false;

function hasSeen(): boolean {
	if (seenInMemory) return true;
	try {
		return sessionStorage.getItem(introStorageKey) === '1';
	} catch {
		return false;
	}
}

function markSeen(): void {
	seenInMemory = true;
	try {
		sessionStorage.setItem(introStorageKey, '1');
	} catch {
		/* storage blocked: the film may replay, which is acceptable */
	}
}

function prefersReducedMotion(): boolean {
	return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Decide whether to play. Returns true when the film starts. Call once on mount, client only. */
export function beginIntro(): boolean {
	if (prefersReducedMotion() || hasSeen()) {
		phase.set('done');
		return false;
	}
	markSeen();
	phase.set('play');
	return true;
}

/** Film finished or was skipped: hand off to the page. */
export function revealIntro(): void {
	phase.update((p) => (p === 'play' ? 'reveal' : p));
}

/** Remove the film and the `data-intro` attribute. */
export function completeIntro(): void {
	phase.set('done');
}

/** Inline script run before hydration so the page is hidden from first paint. Mirrors the gate above. */
export function introEarlyGate(): string {
	const key = JSON.stringify(introStorageKey);
	const rm = "matchMedia('(prefers-reduced-motion: reduce)').matches";
	return `<script>(function(){var d=document.documentElement;try{if(${rm})return;var s=false;try{s=sessionStorage.getItem(${key})==='1'}catch(e){}if(!s)d.dataset.intro='play'}catch(e){}})()<\/script>`;
}
