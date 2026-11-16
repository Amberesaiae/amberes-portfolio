import { describe, expect, it } from 'vitest';
import { clampCenter, easeInOutCubic, easedOffset, layoutCenter, returnProgress } from './math.js';

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
