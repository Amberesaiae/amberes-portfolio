/**
 * Live-region announcer. `announce('Gravity on')` speaks politely to screen readers;
 * pass 'assertive' for urgent messages. Regions are mounted lazily on <body> and are
 * visually hidden, so no component needs to render one.
 */
type Politeness = 'polite' | 'assertive';

const regions: Partial<Record<Politeness, HTMLElement>> = {};

function region(p: Politeness): HTMLElement | null {
	if (typeof document === 'undefined') return null;
	let el = regions[p];
	if (el && el.isConnected) return el;
	el = document.createElement('div');
	el.setAttribute('data-a11y-announcer', p);
	el.setAttribute('aria-live', p);
	el.setAttribute('aria-atomic', 'true');
	el.setAttribute('role', p === 'assertive' ? 'alert' : 'status');
	Object.assign(el.style, {
		position: 'absolute',
		width: '1px',
		height: '1px',
		margin: '-1px',
		padding: '0',
		overflow: 'hidden',
		clip: 'rect(0 0 0 0)',
		whiteSpace: 'nowrap',
		border: '0'
	});
	document.body.appendChild(el);
	regions[p] = el;
	return el;
}

export function announce(message: string, politeness: Politeness = 'polite'): void {
	const el = region(politeness);
	if (!el) return;
	// Clear then set on next frame so repeated identical messages are re-announced.
	el.textContent = '';
	requestAnimationFrame(() => {
		el.textContent = message;
	});
}
