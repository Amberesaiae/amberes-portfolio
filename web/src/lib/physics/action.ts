import type { PhysicsControls } from './controls.js';
import type { PhysicsMode, PhysicsOptions, PhysicsWorld } from './types.js';

export interface PhysicsActionParams extends PhysicsOptions {
	controls?: PhysicsControls;
}

type Method = 'gravity' | 'scatter' | 'restore' | 'toggleGravity' | 'refresh';

/**
 * Svelte action: `<div use:physics={{ controls }}>` with `[data-physics-card]` children.
 *
 * Nothing heavy loads at mount: the engine (and matter-js) is imported on the first
 * gravity/scatter call. Under prefers-reduced-motion the engine is never loaded and
 * gravity/scatter are disabled (`$controls.reduced` is true).
 */
export function physics(node: HTMLElement, params: PhysicsActionParams = {}) {
	let current = params;
	let world: PhysicsWorld | null = null;
	let loading: Promise<PhysicsWorld | null> | null = null;
	let dead = false;
	let mode: PhysicsMode = 'idle';

	const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
	const reduced = () =>
		current.reducedMotion === 'always' || (current.reducedMotion !== 'never' && mq.matches);

	const load = (): Promise<PhysicsWorld | null> => {
		loading ??= import('./engine.js').then(async ({ createPhysicsWorld }) => {
			if (dead) return null;
			const w = await createPhysicsWorld(node, {
				...current,
				onModeChange: (m) => {
					mode = m;
					current.controls?._mode(m);
					current.onModeChange?.(m);
				}
			});
			if (dead) {
				w.destroy();
				return null;
			}
			world = w;
			return w;
		});
		return loading;
	};

	const call = (method: Method) => {
		if (dead) return;
		if (method === 'gravity' || method === 'scatter' || method === 'toggleGravity') {
			if (reduced()) return;
		} else if (!world) return; // restore/refresh before anything ran: nothing to do
		void load().then((w) => w?.[method]());
	};

	const proxy = {
		get mode() {
			return mode;
		},
		get reduced() {
			return reduced();
		},
		gravity: () => call('gravity'),
		scatter: () => call('scatter'),
		restore: () => call('restore'),
		toggleGravity: () => call('toggleGravity'),
		refresh: () => call('refresh'),
		setOptions: (o: Partial<PhysicsOptions>) => world?.setOptions(o),
		destroy: () => {}
	} satisfies PhysicsWorld;

	const onMq = () => current.controls?._attach(proxy);
	mq.addEventListener('change', onMq);
	current.controls?._attach(proxy);

	return {
		update(next: PhysicsActionParams) {
			if (next.controls !== current.controls) {
				current.controls?._attach(null);
				next.controls?._attach(proxy);
			}
			current = next;
			const { controls: _c, onModeChange: _o, ...rest } = next;
			world?.setOptions(rest);
		},
		destroy() {
			dead = true;
			mq.removeEventListener('change', onMq);
			current.controls?._attach(null);
			world?.destroy();
			world = null;
		}
	};
}
