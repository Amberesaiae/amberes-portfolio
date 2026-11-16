import { writable, type Readable } from 'svelte/store';
import type { PhysicsControlsState, PhysicsWorld } from './types.js';

export interface PhysicsControls extends Readable<PhysicsControlsState> {
	gravity(): void;
	scatter(): void;
	restore(): void;
	toggleGravity(): void;
	refresh(): void;
	/** Used by PhysicsLayer / the action; not for consumers. */
	_attach(world: PhysicsWorld | null): void;
	_mode(mode: PhysicsControlsState['mode']): void;
}

/** One controls store per physics layer (no module-level shared state). */
export function createPhysicsControls(): PhysicsControls {
	const state = writable<PhysicsControlsState>({ mode: 'idle', ready: false, reduced: false });
	let world: PhysicsWorld | null = null;
	return {
		subscribe: state.subscribe,
		gravity: () => world?.gravity(),
		scatter: () => world?.scatter(),
		restore: () => world?.restore(),
		toggleGravity: () => world?.toggleGravity(),
		refresh: () => world?.refresh(),
		_attach(w) {
			world = w;
			state.set({ mode: w?.mode ?? 'idle', ready: !!w, reduced: w?.reduced ?? false });
		},
		_mode(mode) {
			state.update((s) => ({ ...s, mode, reduced: world?.reduced ?? s.reduced }));
		}
	};
}
