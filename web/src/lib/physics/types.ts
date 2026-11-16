export type PhysicsMode = 'idle' | 'gravity' | 'scatter' | 'returning';

export type ReducedMotionPreference = 'auto' | 'always' | 'never';

export interface PhysicsOptions {
	/** Attribute selector for cards inside the container. */
	selector?: string;
	/** Gravity strength (Matter units, 1 = default). */
	gravityY?: number;
	/** Scatter impulse magnitude (px/step velocity). */
	scatterForce?: number;
	/** Duration of the eased return in ms. */
	returnDuration?: number;
	/** Allow dragging cards with the pointer while physics is active. */
	drag?: boolean;
	/** 'auto' follows prefers-reduced-motion. */
	reducedMotion?: ReducedMotionPreference;
	/** Called whenever the mode changes. */
	onModeChange?: (mode: PhysicsMode) => void;
}

export interface PhysicsWorld {
	readonly mode: PhysicsMode;
	/** True when animation is suppressed (states are applied instantly). */
	readonly reduced: boolean;
	/** Cards fall and stack on the container floor. */
	gravity(): void;
	/** Impulse burst, no gravity; cards bounce inside the container. */
	scatter(): void;
	/** Ease cards back to their layout positions. */
	restore(): void;
	/** gravity() when idle/scatter, otherwise restore(). */
	toggleGravity(): void;
	/** Re-query cards and container size (call after layout changes). */
	refresh(): void;
	setOptions(options: Partial<PhysicsOptions>): void;
	destroy(): void;
}

export interface PhysicsControlsState {
	mode: PhysicsMode;
	ready: boolean;
	reduced: boolean;
}
