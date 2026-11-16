import { describe, expect, it } from 'vitest';
import { clampCenter, nearestAngle, parseRotate, easeInOutCubic, easedOffset, layoutCenter, returnProgress } from './math.js';

describe('easeInOutCubic', () => {
	it('hits endpoints and midpoint', () => {
		expect(easeInOutCubic(0)).toBe(0);
		expect(easeInOutCubic(1)).toBe(1);
		expect(easeInOutCubic(0.5)).toBeCloseTo(0.5);
	});
	it('is monotonic', () => {
		let prev = -1;
		for (let i = 0; i <= 100; i++) {
			const v = easeInOutCubic(i / 100);
			expect(v).toBeGreaterThanOrEqual(prev);
			prev = v;
		}
	});
});

describe('returnProgress / easedOffset', () => {
	it('clamps to 0..1', () => {
		expect(returnProgress(0, 100, 800)).toBe(0);
		expect(returnProgress(500, 100, 800)).toBe(0.5);
		expect(returnProgress(5000, 100, 800)).toBe(1);
	});
	it('completes immediately for zero duration', () => {
		expect(returnProgress(0, 0, 0)).toBe(1);
	});
	it('eases from the offset to exactly layout (0)', () => {
		expect(easedOffset(120, 0)).toBe(120);
		expect(easedOffset(120, 1)).toBe(0);
		expect(easedOffset(-90, 0.5)).toBeCloseTo(-45);
	});
});

describe('clampCenter', () => {
	it('keeps the box inside the extent', () => {
		expect(clampCenter(-50, 100, 500)).toBe(50);
		expect(clampCenter(900, 100, 500)).toBe(450);
		expect(clampCenter(200, 100, 500)).toBe(200);
	});
	it('does not invert when the box is larger than the extent', () => {
		expect(clampCenter(10, 600, 500)).toBe(300);
	});
});

describe('layoutCenter', () => {
	it('subtracts the applied translate', () => {
		expect(layoutCenter(340, 40)).toBe(300);
	});
});

describe('parseRotate', () => {
	it('parses CSS angle units', () => {
		expect(parseRotate('180deg')).toBeCloseTo(Math.PI);
		expect(parseRotate('-1.5deg')).toBeCloseTo((-1.5 * Math.PI) / 180);
		expect(parseRotate('0.5turn')).toBeCloseTo(Math.PI);
		expect(parseRotate('0.2rad')).toBeCloseTo(0.2);
	});
	it('treats none/empty/garbage as 0', () => {
		expect(parseRotate('none')).toBe(0);
		expect(parseRotate('')).toBe(0);
		expect(parseRotate(undefined)).toBe(0);
	});
});

describe('nearestAngle', () => {
	it('unwraps multi-turn spins to the closest equivalent', () => {
		expect(nearestAngle(Math.PI * 4 + 0.3, 0)).toBeCloseTo(0.3);
		expect(nearestAngle(-Math.PI * 6 - 0.2, 0.1)).toBeCloseTo(-0.2);
	});
});
