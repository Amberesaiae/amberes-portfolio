import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const created = vi.fn();
vi.mock('./engine.js', () => ({
	createPhysicsWorld: (...args: unknown[]) => {
		created(...args);
		return Promise.resolve({
			mode: 'idle',
			reduced: false,
			gravity: vi.fn(),
			scatter: vi.fn(),
			restore: vi.fn(),
			toggleGravity: vi.fn(),
			refresh: vi.fn(),
			setOptions: vi.fn(),
			destroy: vi.fn()
		});
	}
}));

function stubMedia(reduce: boolean) {
	const mq = { matches: reduce, addEventListener: vi.fn(), removeEventListener: vi.fn() };
	vi.stubGlobal('window', { matchMedia: () => mq });
}

const flush = () => new Promise((r) => setTimeout(r, 0));

describe('physics action', () => {
	beforeEach(() => {
		created.mockClear();
		vi.resetModules();
	});
	afterEach(() => vi.unstubAllGlobals());

	it('does not load or run the engine at mount', async () => {
		stubMedia(false);
		const { physics } = await import('./action.js');
		const a = physics({} as HTMLElement, {});
		await flush();
		expect(created).not.toHaveBeenCalled();
		a.destroy();
	});

	it('loads the engine lazily on first gravity()', async () => {
		stubMedia(false);
		const { physics } = await import('./action.js');
		const { createPhysicsControls } = await import('./controls.js');
		const controls = createPhysicsControls();
		const a = physics({} as HTMLElement, { controls });
		controls.gravity();
		await flush();
		expect(created).toHaveBeenCalledTimes(1);
		a.destroy();
	});

	it('under reduced motion never runs the engine and reports reduced', async () => {
		stubMedia(true);
		const { physics } = await import('./action.js');
		const { createPhysicsControls } = await import('./controls.js');
		const { get } = await import('svelte/store');
		const controls = createPhysicsControls();
		const a = physics({} as HTMLElement, { controls });
		controls.gravity();
		controls.scatter();
		controls.toggleGravity();
		await flush();
		expect(created).not.toHaveBeenCalled();
		expect(get(controls).reduced).toBe(true);
		expect(get(controls).mode).toBe('idle');
		a.destroy();
	});
});
