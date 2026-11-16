import type { PhysicsControls } from './controls.js';
import { createPhysicsWorld } from './engine.js';
import type { PhysicsOptions, PhysicsWorld } from './types.js';

export interface PhysicsActionParams extends PhysicsOptions {
	controls?: PhysicsControls;
}

/**
 * Svelte action: `<div use:physics={{ controls }}>` with `[data-physics-card]` children.
 * SSR-safe (actions only run in the browser).
 */
export function physics(node: HTMLElement, params: PhysicsActionParams = {}) {
	let world: PhysicsWorld | null = null;
	let dead = false;
	let current = params;

	createPhysicsWorld(node, {
		...params,
		onModeChange: (m) => {
			current.controls?._mode(m);
			current.onModeChange?.(m);
		}
	})
		.then((w) => {
			if (dead) return w.destroy();
			world = w;
			current.controls?._attach(w);
		})
		.catch(() => {});

	return {
		update(next: PhysicsActionParams) {
			if (next.controls !== current.controls) {
				current.controls?._attach(null);
				if (world) next.controls?._attach(world);
			}
			current = next;
			const { controls: _c, onModeChange: _o, ...rest } = next;
			world?.setOptions(rest);
		},
		destroy() {
			dead = true;
			current.controls?._attach(null);
			world?.destroy();
			world = null;
		}
	};
}
