import type { PhysicsOptions, PhysicsWorld } from './types.js';

/** Lazy: matter-js and the engine only load when this is called (browser only). */
export const createPhysicsWorld = (container: HTMLElement, options?: PhysicsOptions): Promise<PhysicsWorld> =>
	import('./engine.js').then((m) => m.createPhysicsWorld(container, options));

export { createPhysicsControls, type PhysicsControls } from './controls.js';
export { physics, type PhysicsActionParams } from './action.js';
export type {
	PhysicsMode,
	PhysicsOptions,
	PhysicsWorld,
	PhysicsControlsState,
	ReducedMotionPreference
} from './types.js';
