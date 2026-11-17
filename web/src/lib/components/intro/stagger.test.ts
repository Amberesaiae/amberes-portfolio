import { describe, expect, it } from 'vitest';
import css from './Intro.svelte?raw';
import { introStagger, introStaggerDuration, introTiming } from '#lib/data/intro.js';

/** Pull `transition: opacity <dur> <ease> <delay>?` out of the rule for a selector, in ms. */
function transition(selector: string): { duration: number; delay: number } {
	const start = css.indexOf(selector);
	expect(start, selector).toBeGreaterThan(-1);
	const rule = css.slice(start, css.indexOf('}', start));
	const m = rule.match(/transition:\s*opacity\s+([\d.]+)s\s+cubic-bezier\([^)]*\)(?:\s+([\d.]+)s)?/);
	expect(m, `transition in ${selector}`).not.toBeNull();
	return { duration: Math.round(+m![1] * 1000), delay: Math.round(+(m![2] ?? 0) * 1000) };
}

describe('intro hand-off stagger', () => {
	it('paper +150ms, header +350ms, hands +500ms', () => {
		expect(transition("[data-reveal='paper']").delay).toBe(introStagger.paper);
		expect(transition("[data-reveal='hands']").delay).toBe(introStagger.hands);
		// Header has its own rule after the shared one: the last `.site-header) {` block.
		const header = css.lastIndexOf(".site-header) {");
		expect(css.slice(header, css.indexOf('}', header))).toContain(`${introStagger.header / 1000}s`);
	});

	it('is ordered paper < header < hands and finishes inside the reveal tail', () => {
		expect(introStagger.paper).toBeLessThan(introStagger.header);
		expect(introStagger.header).toBeLessThan(introStagger.hands);
		const end = Math.max(
			introStagger.paper + introStaggerDuration.paper,
			introStagger.header + introStaggerDuration.header,
			introStagger.hands + introStaggerDuration.hands
		);
		expect(end).toBeLessThanOrEqual(introTiming.revealTail);
		expect(transition("[data-reveal='hands']").duration).toBe(introStaggerDuration.hands);
	});

	it('keeps total film under 3.0s even when the dev preload cap (350ms) is hit', () => {
		const film = introTiming.pan + introTiming.cutHold * 5 + introTiming.hands + introTiming.hold + introTiming.veil;
		expect(350 + film + introTiming.revealTail).toBeLessThanOrEqual(3000);
	});
});
