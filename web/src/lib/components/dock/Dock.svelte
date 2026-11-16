<script lang="ts">
	import { onMount } from 'svelte';
	import { dockItems, type DockItemData } from '#lib/data/dock.ts';
	import DockDesktop from './DockDesktop.svelte';
	import DockMobile from './DockMobile.svelte';
	import DockSheet from './DockSheet.svelte';

	/**
	 * Amber Studio dock. Mount once (root layout). Works with zero props:
	 * - Anchor items scroll to their `#id` target if it exists on the page; otherwise they are
	 *   shown disabled ("soon") rather than being dead links. "Work" falls back to the page top.
	 * - Action items are disabled until an `onaction` handler is supplied.
	 * - `active` defaults to a scroll-spy over the existing anchor targets.
	 */
	let {
		active: activeProp,
		onaction,
		onnavigate
	}: {
		active?: string;
		onaction?: (item: DockItemData) => void;
		onnavigate?: (item: DockItemData, e: Event) => void;
	} = $props();

	let spy = $state('');
	let mode = $state<'desktop' | 'mobile' | null>(null); // null until mounted (render one variant only)
	let sheet = $state<DockItemData | null>(null);
	let present = $state(new Set<string>());
	const active = $derived(activeProp ?? spy);

	const targetOf = (item: DockItemData) =>
		item.href ? document.getElementById(item.href.slice(1)) : null;

	// All items stay visible. Actions without an `onaction` handler open a placeholder sheet.
	const visible = dockItems;
	const disabled = $derived(
		new Set(
			visible
				.filter((i) => i.href && i.id !== 'work' && !present.has(i.id))
				.map((i) => i.id)
		)
	);

	function scan() {
		present = new Set(dockItems.filter((i) => i.href && targetOf(i)).map((i) => i.id));
	}

	onMount(() => {
		const mq = matchMedia('(min-width: 768px)');
		const setMode = () => (mode = mq.matches ? 'desktop' : 'mobile');
		setMode();
		mq.addEventListener('change', setMode);
		scan();
		const mo = new MutationObserver(scan);
		mo.observe(document.body, { childList: true, subtree: true });
		const io = new IntersectionObserver(
			(entries) => {
				for (const en of entries) {
					const it = dockItems.find((i) => i.href === `#${en.target.id}`);
					if (it && en.isIntersecting) spy = it.id;
				}
			},
			{ rootMargin: '-40% 0px -50% 0px' }
		);
		dockItems.forEach((i) => {
			const t = targetOf(i);
			if (t) io.observe(t);
		});
		return () => {
			mq.removeEventListener('change', setMode);
			mo.disconnect();
			io.disconnect();
		};
	});

	function onselect(item: DockItemData, e: Event) {
		if (!item.href) return onaction ? onaction(item) : (sheet = item);
		onnavigate?.(item, e);
		if (e.defaultPrevented) return;
		const t = targetOf(item) ?? (item.id === 'work' ? document.getElementById('content') : null);
		e.preventDefault();
		if (!t) return;
		const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
		t.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
		if (item.id !== 'work') history.replaceState(null, '', item.href);
		spy = item.id;
	}
</script>

<nav
	aria-label="Dock"
	class="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center pb-3 max-md:pb-0"
>
	{#if mode === 'desktop'}
		<DockDesktop items={visible} {active} {disabled} {onselect} />
	{:else if mode === 'mobile'}
		<div class="w-full"><DockMobile items={visible} {active} {disabled} {onselect} /></div>
	{/if}
</nav>

<DockSheet item={sheet} onclose={() => (sheet = null)} />
