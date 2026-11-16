<script lang="ts">
	import { onMount } from 'svelte';
	import {
		dockItems,
		DOCK_BASE,
		DOCK_MAX_SCALE,
		DOCK_RADIUS,
		type DockItemData
	} from '#lib/data/dock.ts';
	import { magnifyScale } from './dock-math';
	import DockTile from './DockTile.svelte';

	let {
		active = '',
		onselect
	}: { active?: string; onselect: (item: DockItemData, e: Event) => void } = $props();

	const GAP = 8; // dead space between tiles (part of each slot's width)
	let nav: HTMLElement;
	let slots: HTMLElement[] = $state([]);
	let tiles: HTMLElement[] = $state([]);
	let reduced = false;

	// Pointer x relative to the dock's centre; null when away. Spring state lives outside Svelte reactivity.
	let target: number | null = null;
	let x = 0;
	let v = 0;
	let influence = 0; // 0..1 eases magnification in/out
	let raf = 0;
	let last = 0;

	// Rest layout (all scale 1): slot widths and separators, used for stable centres.
	const sepAfter = dockItems.map((it, i) => i < dockItems.length - 1 && dockItems[i + 1].group !== it.group);
	const SEP = 17;
	const restWidths = dockItems.map((_, i) => DOCK_BASE + GAP + (sepAfter[i] ? SEP : 0));
	const total = restWidths.reduce((a, b) => a + b, 0);
	const restCentres = (() => {
		let acc = -total / 2;
		return restWidths.map((w) => {
			const c = acc + (DOCK_BASE + GAP) / 2;
			acc += w;
			return c;
		});
	})();

	function frame(t: number) {
		const dt = Math.min((t - last) / 1000 || 0.016, 0.05);
		last = t;
		const goal = target;
		if (goal !== null) {
			// Spring the pointer value so fast cursor moves do not snap (k~400, c~30 in mass-1 units).
			const a = 400 * (goal - x) - 30 * v;
			v += a * dt;
			x += v * dt;
		}
		const inGoal = goal !== null ? 1 : 0;
		influence += (inGoal - influence) * Math.min(1, dt * 14);
		let settled = goal === null && influence < 0.002;
		for (let i = 0; i < dockItems.length; i++) {
			const s = reduced
				? 1
				: 1 + (magnifyScale(x - restCentres[i], DOCK_RADIUS, DOCK_MAX_SCALE) - 1) * influence;
			slots[i].style.width = `${(DOCK_BASE + GAP) * s}px`;
			tiles[i].style.transform = `scale(${s})`;
		}
		if (settled) {
			raf = 0;
			for (let i = 0; i < dockItems.length; i++) {
				slots[i].style.width = '';
				tiles[i].style.transform = '';
			}
			return;
		}
		raf = requestAnimationFrame(frame);
	}
	function kick() {
		if (!raf) {
			last = performance.now();
			raf = requestAnimationFrame(frame);
		}
	}
	function rel(e: PointerEvent) {
		const r = nav.getBoundingClientRect();
		return e.clientX - (r.left + r.width / 2);
	}
	function move(e: PointerEvent) {
		if (e.pointerType !== 'mouse') return;
		const nx = rel(e);
		if (target === null) {
			x = nx;
			v = 0;
		}
		target = nx;
		kick();
	}
	function leave() {
		target = null;
		kick();
	}
	function focusOn(i: number, e: FocusEvent) {
		// Keyboard focus magnifies that item like a hover would.
		if (!(e.currentTarget as HTMLElement).matches(':focus-visible')) return;
		target = restCentres[i];
		x = target;
		v = 0;
		kick();
	}

	function keydown(e: KeyboardEvent) {
		const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
		if (!keys.includes(e.key)) return;
		const els = slots.map((s) => s.querySelector<HTMLElement>('a,button')!);
		const cur = els.indexOf(document.activeElement as HTMLElement);
		let n = cur;
		if (e.key === 'ArrowRight') n = (cur + 1) % els.length;
		if (e.key === 'ArrowLeft') n = (cur - 1 + els.length) % els.length;
		if (e.key === 'Home') n = 0;
		if (e.key === 'End') n = els.length - 1;
		e.preventDefault();
		els[n].focus();
	}

	onMount(() => {
		const mq = matchMedia('(prefers-reduced-motion: reduce)');
		reduced = mq.matches;
		const h = () => (reduced = mq.matches);
		mq.addEventListener('change', h);
		return () => {
			mq.removeEventListener('change', h);
			cancelAnimationFrame(raf);
		};
	});
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<nav
	bind:this={nav}
	aria-label="Dock"
	class="pointer-events-auto flex items-end rounded-[1.6rem] border border-black/10 bg-white/55 px-2 pt-2 pb-2 shadow-[0_18px_40px_-14px_rgb(0_0_0/0.35)] backdrop-blur-xl"
	onpointermove={move}
	onpointerleave={leave}
	onfocusout={(e) => {
		if (!nav.contains(e.relatedTarget as Node | null)) leave();
	}}
	onkeydown={keydown}
>
	{#each dockItems as item, i (item.id)}
		<div class="flex items-end" style="height:{DOCK_BASE}px">
			<div
				bind:this={slots[i]}
				class="group relative flex shrink-0 justify-center"
				style="width:{DOCK_BASE + GAP}px;height:{DOCK_BASE}px"
			>
				{#if item.href}
					<a
						href={item.href}
						aria-label={item.label}
						aria-current={active === item.id ? 'page' : undefined}
						class="relative block rounded-[28%] outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
						style="width:{DOCK_BASE}px;height:{DOCK_BASE}px"
						onclick={(e) => onselect(item, e)}
						onfocus={(e) => focusOn(i, e)}
					>
						<span bind:this={tiles[i]} class="block h-full w-full origin-bottom will-change-transform">
							<DockTile icon={item.icon} />
						</span>
					</a>
				{:else}
					<button
						type="button"
						aria-label={item.label}
						class="relative block rounded-[28%] outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
						style="width:{DOCK_BASE}px;height:{DOCK_BASE}px"
						onclick={(e) => onselect(item, e)}
						onfocus={(e) => focusOn(i, e)}
					>
						<span bind:this={tiles[i]} class="block h-full w-full origin-bottom will-change-transform">
							<DockTile icon={item.icon} />
						</span>
					</button>
				{/if}
				<span
					role="presentation"
					class="pointer-events-none absolute bottom-full left-1/2 mb-[calc(var(--dock-lift,0px)+10px)] -translate-x-1/2 rounded-md bg-neutral-900/90 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100"
					style="--dock-lift:{DOCK_BASE * (DOCK_MAX_SCALE - 1)}px"
				>
					{item.label}
				</span>
				<span
					class="absolute -bottom-1.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-neutral-900 transition-opacity {active === item.id ? 'opacity-100' : 'opacity-0'}"
					aria-hidden="true"
				></span>
			</div>
			{#if sepAfter[i]}
				<span class="mx-2 mb-1 h-10 w-px self-end bg-black/15" aria-hidden="true"></span>
			{/if}
		</div>
	{/each}
</nav>
