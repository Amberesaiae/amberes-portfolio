import type { Body, Constraint, Engine } from 'matter-js';
import { clampCenter, easedOffset, floorHeight, layoutCenter, nearestAngle, parseRotate, returnProgress } from './math.js';
import type { PhysicsMode, PhysicsOptions, PhysicsWorld } from './types.js';

type MatterModule = typeof import('matter-js');

interface Card {
	el: HTMLElement;
	body: Body;
	/** Layout centre relative to container. */
	cx: number;
	cy: number;
	/** Offset currently applied via translate. */
	ox: number;
	oy: number;
	/** Resting pose (radians) and the exact inline styles to put back. */
	rot0: number;
	origRotate: string;
	origTranslate: string;
	/** Ghost: collides only with walls until clear of overlaps. */
	ghost: boolean;
}

const STEP = 1000 / 60;
const CAT_WALL = 1;
const CAT_GHOST = 2;
const CAT_CARD = 4;
const WALL = 400;
const DEFAULTS = {
	selector: '[data-physics-card]',
	gravityY: 1.2,
	scatterForce: 14,
	returnDuration: 800,
	floor: 'viewport',
	floorInset: 0,
	drag: true,
	reducedMotion: 'auto'
} as const;

/**
 * Creates a Matter.js world bound to `container`. Browser only: matter-js is
 * imported dynamically, so calling this during SSR rejects.
 */
export async function createPhysicsWorld(
	container: HTMLElement,
	options: PhysicsOptions = {}
): Promise<PhysicsWorld> {
	if (typeof window === 'undefined') throw new Error('createPhysicsWorld is browser-only');
	const mod = await import('matter-js');
	const M = ((mod as { default?: MatterModule }).default ?? mod) as MatterModule;

	const opts = { ...DEFAULTS, ...options } as Required<Omit<PhysicsOptions, 'onModeChange'>> &
		Pick<PhysicsOptions, 'onModeChange'>;

	const engine: Engine = M.Engine.create({ gravity: { x: 0, y: 0, scale: 0.001 }, enableSleeping: true, positionIterations: 14, velocityIterations: 10 });
	let walls: Body[] = [];
	let cards: Card[] = [];
	let mode: PhysicsMode = 'idle';
	let destroyed = false;
	let raf = 0;
	let last = 0;
	let acc = 0;
	let returning: { start: number; from: Map<Card, { x: number; y: number; a: number }> } | null =
		null;
	let dragConstraint: Constraint | null = null;
	let dragEl: HTMLElement | null = null;

	const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
	const isReduced = () =>
		opts.reducedMotion === 'always' || (opts.reducedMotion === 'auto' && mq.matches);

	const setMode = (next: PhysicsMode) => {
		if (mode === next) return;
		mode = next;
		opts.onModeChange?.(mode);
	};

	// ---- layout ---------------------------------------------------------

	const clearEl = (c: Card) => {
		const el = c.el;
		el.style.translate = c.origTranslate;
		el.style.rotate = c.origRotate;
		el.style.willChange = '';
		el.style.touchAction = '';
		el.style.cursor = '';
		el.style.userSelect = '';
	};

	/** Current offset of card (from applied translate), used to recover layout centre. */
	let floorH = 0;
	const computeFloor = () => {
		const full = container.clientHeight;
		floorH =
			opts.floor === 'container'
				? full
				: floorHeight(container.getBoundingClientRect().top, full, window.innerHeight, opts.floorInset, 240);
	};
	const measure = (): { w: number; h: number } => ({
		w: container.clientWidth,
		h: floorH || container.clientHeight
	});

	const buildWalls = () => {
		computeFloor();
		if (walls.length) M.Composite.remove(engine.world, walls);
		const { w, h } = measure();
		const o = {
			isStatic: true,
			friction: 0.6,
			restitution: 0.2,
			collisionFilter: { category: CAT_WALL, mask: CAT_GHOST | CAT_CARD }
		};
		walls = [
			M.Bodies.rectangle(w / 2, h + WALL / 2, w + WALL * 2, WALL, o), // floor
			M.Bodies.rectangle(-WALL / 2, h / 2, WALL, h * 4 + WALL, o), // left
			M.Bodies.rectangle(w + WALL / 2, h / 2, WALL, h * 4 + WALL, o), // right
			M.Bodies.rectangle(w / 2, -WALL / 2, w + WALL * 2, WALL, o) // ceiling
		];
		M.Composite.add(engine.world, walls);
	};

	const collect = () => {
		const cr = container.getBoundingClientRect();
		const { w: W, h: H } = measure();
		const els = Array.from(container.querySelectorAll<HTMLElement>(opts.selector));
		// Remove bodies of cards no longer present.
		for (const c of cards) {
			if (!els.includes(c.el)) {
				M.Composite.remove(engine.world, c.body);
				clearEl(c);
			}
		}
		const next: Card[] = [];
		for (const el of els) {
			const existing = cards.find((c) => c.el === el);
			if (existing) {
				next.push(existing);
				continue;
			}
			// Measure with no offset applied: new cards are always at layout.
			const r = el.getBoundingClientRect();
			const w = el.offsetWidth || r.width;
			const h = el.offsetHeight || r.height;
			const cx = r.left - cr.left + r.width / 2;
			const cy = r.top - cr.top + r.height / 2;
			const bx = clampCenter(cx, w, W);
			const by = clampCenter(cy, h, H);
			const rot0 = parseRotate(getComputedStyle(el).rotate);
			const body = M.Bodies.rectangle(bx, by, w, h, {
				angle: rot0,
				chamfer: { radius: Math.min(10, w / 4, h / 4) },
				restitution: 0.15,
				friction: 0.6,
				frictionAir: 0.01,
				density: 0.002,
				sleepThreshold: 40,
				collisionFilter: { category: CAT_GHOST, mask: CAT_WALL | CAT_CARD }
			});
			M.Composite.add(engine.world, body);
			// cx/cy is the layout centre; the body may start clamped inside bounds.
			next.push({
				el,
				body,
				cx,
				cy,
				ox: 0,
				oy: 0,
				rot0,
				origRotate: el.style.rotate,
				origTranslate: el.style.translate,
				ghost: true
			});
		}
		cards = next;
	};

	const sync = () => {
		for (const c of cards) {
			const { x, y } = c.body.position;
			c.ox = x - c.cx;
			c.oy = y - c.cy;
			c.el.style.translate = `${c.ox.toFixed(2)}px ${c.oy.toFixed(2)}px`;
			c.el.style.rotate = `${c.body.angle.toFixed(4)}rad`;
		}
	};

	const prepare = (dragOn: boolean) => {
		for (const c of cards) {
			c.el.style.willChange = 'translate, rotate';
			if (dragOn) {
				c.el.style.touchAction = 'none';
				c.el.style.cursor = 'grab';
				c.el.style.userSelect = 'none';
			}
		}
	};

	// ---- loop -----------------------------------------------------------

	const frame = (now: number) => {
		raf = 0;
		if (destroyed) return;
		if (mode === 'returning' && returning) {
			const t = returnProgress(now, returning.start, opts.returnDuration);
			for (const [c, f] of returning.from) {
				c.el.style.translate = `${easedOffset(f.x, t).toFixed(2)}px ${easedOffset(f.y, t).toFixed(2)}px`;
				c.el.style.rotate = `${(c.rot0 + easedOffset(f.a, t)).toFixed(4)}rad`;
			}
			if (t >= 1) finishReturn();
			else raf = requestAnimationFrame(frame);
			return;
		}
		if (mode === 'idle') return;
		acc = Math.min(acc + (last ? now - last : STEP), STEP * 4);
		last = now;
		while (acc >= STEP) {
			M.Engine.update(engine, STEP);
			acc -= STEP;
			if (++stepCount % 3 === 0) solidify();
		}
		sync();
		// Everything asleep and nothing being dragged: stop burning frames.
		if (!dragConstraint && cards.every((c) => c.body.isSleeping)) return;
		raf = requestAnimationFrame(frame);
	};

	let stepCount = 0;
	/**
	 * Cards start as ghosts (walls only) so overlapping collage cards fall straight down
	 * instead of shoving each other sideways. Lowest first, a ghost turns solid once it
	 * overlaps no solid card. Ghosts still collide with solid cards and walls.
	 */
	const solidify = () => {
		const ghosts = cards.filter((c) => c.ghost).sort((a, b) => b.body.position.y - a.body.position.y);
		if (!ghosts.length) return;
		const solid = cards.filter((c) => !c.ghost).map((c) => c.body);
		for (const g of ghosts) {
			if (M.Query.collides(g.body, solid).length === 0) {
				g.ghost = false;
				g.body.collisionFilter.category = CAT_CARD;
				g.body.collisionFilter.mask = CAT_WALL | CAT_CARD | CAT_GHOST;
				solid.push(g.body);
			}
		}
	};

	const startLoop = () => {
		if (raf || destroyed || document.hidden) return;
		last = 0;
		acc = 0;
		raf = requestAnimationFrame(frame);
	};
	const stopLoop = () => {
		if (raf) cancelAnimationFrame(raf);
		raf = 0;
	};

	const onVisibility = () => {
		if (document.hidden) stopLoop();
		else if (mode !== 'idle') startLoop();
	};
	document.addEventListener('visibilitychange', onVisibility);

	// ---- drag -----------------------------------------------------------

	const toLocal = (e: PointerEvent) => {
		const r = container.getBoundingClientRect();
		return { x: e.clientX - r.left, y: e.clientY - r.top };
	};
	const onPointerDown = (e: PointerEvent) => {
		if (!opts.drag || isReduced() || mode === 'idle' || mode === 'returning') return;
		const el = (e.target as Element | null)?.closest<HTMLElement>(opts.selector);
		const card = el && cards.find((c) => c.el === el);
		if (!card) return;
		const p = toLocal(e);
		dragConstraint = M.Constraint.create({
			pointA: p,
			bodyB: card.body,
			pointB: { x: p.x - card.body.position.x, y: p.y - card.body.position.y },
			stiffness: 0.15,
			damping: 0.1,
			length: 0
		});
		M.Composite.add(engine.world, dragConstraint);
		dragEl = el;
		M.Sleeping.set(card.body, false);
		startLoop();
		el.setPointerCapture?.(e.pointerId);
		el.style.cursor = 'grabbing';
		e.preventDefault();
	};
	const onPointerMove = (e: PointerEvent) => {
		if (dragConstraint) dragConstraint.pointA = toLocal(e);
	};
	const endDrag = () => {
		if (dragConstraint) M.Composite.remove(engine.world, dragConstraint);
		if (dragEl) dragEl.style.cursor = 'grab';
		dragConstraint = null;
		dragEl = null;
	};
	container.addEventListener('pointerdown', onPointerDown);
	container.addEventListener('pointermove', onPointerMove);
	container.addEventListener('pointerup', endDrag);
	container.addEventListener('pointercancel', endDrag);

	// ---- resize ---------------------------------------------------------

	/** Re-derive layout centres (after resize/reflow) and pull bodies back inside. */
	const remeasure = () => {
		const cr = container.getBoundingClientRect();
		const { w: W, h: H } = measure();
		for (const c of cards) {
			const r = c.el.getBoundingClientRect();
			c.cx = layoutCenter(r.left - cr.left + r.width / 2, c.ox);
			c.cy = layoutCenter(r.top - cr.top + r.height / 2, c.oy);
			const w = c.el.offsetWidth;
			const h = c.el.offsetHeight;
			M.Body.setPosition(c.body, {
				x: clampCenter(c.body.position.x, w, W),
				y: clampCenter(c.body.position.y, h, H)
			});
			M.Sleeping.set(c.body, false);
		}
	};

	const ro = new ResizeObserver(() => {
		if (mode === 'idle' || mode === 'returning') return;
		buildWalls();
		remeasure();
		startLoop();
	});

	const onKey = (e: KeyboardEvent) => {
		if (e.key === 'Escape' && (mode === 'gravity' || mode === 'scatter')) world.restore();
	};
	window.addEventListener('keydown', onKey);
	ro.observe(container);
	const onWinResize = () => {
		if (mode === 'gravity' || mode === 'scatter') {
			buildWalls();
			remeasure();
			startLoop();
		}
	};
	window.addEventListener('resize', onWinResize);

	// ---- actions --------------------------------------------------------

	const activate = () => {
		if (mode === 'idle') {
			buildWalls();
			collect();
			prepare(opts.drag && !isReduced());
		} else {
			collect();
		}
	};

	const wake = () => {
		for (const c of cards) M.Sleeping.set(c.body, false);
	};

	function finishReturn() {
		for (const c of cards) {
			clearEl(c);
			M.Composite.remove(engine.world, c.body);
		}
		cards = [];
		returning = null;
		if (walls.length) M.Composite.remove(engine.world, walls);
		walls = [];
		setMode('idle');
	}

	const world: PhysicsWorld = {
		get mode() {
			return mode;
		},
		get reduced() {
			return isReduced();
		},
		gravity() {
			if (destroyed || mode === 'returning' || isReduced()) return;
			activate();
			engine.gravity.y = opts.gravityY;
			wake();
			setMode('gravity');
			startLoop();
		},
		scatter() {
			if (destroyed || mode === 'returning' || isReduced()) return;
			activate();
			engine.gravity.y = 0;
			wake();
			const f = opts.scatterForce;
			for (const c of cards) {
				const a = Math.random() * Math.PI * 2;
				const s = f * (0.5 + Math.random() * 0.8);
				M.Body.setVelocity(c.body, { x: Math.cos(a) * s, y: Math.sin(a) * s });
				M.Body.setAngularVelocity(c.body, (Math.random() - 0.5) * 0.3);
			}
			setMode('scatter');
			startLoop();
		},
		restore() {
			if (destroyed || mode === 'idle' || mode === 'returning') return;
			endDrag();
			stopLoop();
			if (isReduced() || opts.returnDuration <= 0) {
				finishReturn();
				return;
			}
			const from = new Map<Card, { x: number; y: number; a: number }>();
			for (const c of cards) {
				M.Sleeping.set(c.body, true);
				from.set(c, { x: c.body.position.x - c.cx, y: c.body.position.y - c.cy, a: nearestAngle(c.body.angle, c.rot0) - c.rot0 });
			}
			returning = { start: performance.now(), from };
			setMode('returning');
			startLoop();
			// Hidden tab: no frames will run, so snap straight home.
			if (document.hidden) finishReturn();
		},
		toggleGravity() {
			if (mode === 'gravity') world.restore();
			else world.gravity();
		},
		refresh() {
			if (destroyed || mode === 'idle' || mode === 'returning') return;
			buildWalls();
			collect();
			remeasure();
			prepare(opts.drag && !isReduced());
			startLoop();
		},
		setOptions(next) {
			Object.assign(opts, Object.fromEntries(Object.entries(next).filter(([, v]) => v !== undefined)));
			if (mode === 'gravity') engine.gravity.y = opts.gravityY;
		},
		destroy() {
			if (destroyed) return;
			destroyed = true;
			stopLoop();
			endDrag();
			document.removeEventListener('visibilitychange', onVisibility);
			container.removeEventListener('pointerdown', onPointerDown);
			container.removeEventListener('pointermove', onPointerMove);
			container.removeEventListener('pointerup', endDrag);
			container.removeEventListener('pointercancel', endDrag);
			ro.disconnect();
			window.removeEventListener('keydown', onKey);
			window.removeEventListener('resize', onWinResize);
			for (const c of cards) clearEl(c);
			cards = [];
			M.World.clear(engine.world, false);
			M.Engine.clear(engine);
			mode = 'idle';
		}
	};
	return world;
}
