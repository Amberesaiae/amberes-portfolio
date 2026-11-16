<script lang="ts">
	import { type DockIconKey, type DockItemData } from '#lib/data/dock.ts';
	import DockTile from './DockTile.svelte';
	import DockIcon from './DockIcon.svelte';

	let {
		items = [],
		active = '',
		disabled = new Set<string>(),
		onselect
	}: { items?: DockItemData[]; active?: string; disabled?: Set<string>; onselect: (item: DockItemData, e: Event) => void } = $props();

	let hot = $state(-1); // index under the thumb during drag-along (-1 none)
	let moreOpen = $state(false);
	let nav: HTMLElement;
	let startIdx = -1;
	let dragged = false;
	let suppressClick = false;

	const mobileItems = $derived(items.filter((i) => i.mobile));
	const moreItems = $derived(items.filter((i) => !i.mobile));
	// Items rendered in the bar: the mobile set plus the "More" stack as the last slot.
	const slots = $derived([...mobileItems.map((i) => i.id), ...(moreItems.length ? ['more'] : [])]);

	function indexAt(x: number, y: number): number {
		const el = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-dock-idx]');
		return el && nav.contains(el) ? Number(el.dataset.dockIdx) : -1;
	}
	function down(e: PointerEvent) {
		if (e.pointerType === 'mouse') return;
		startIdx = hot = indexAt(e.clientX, e.clientY);
		dragged = false;
	}
	function move(e: PointerEvent) {
		if (startIdx < 0 || e.pointerType === 'mouse') return;
		const i = indexAt(e.clientX, e.clientY);
		if (i !== startIdx) dragged = true;
		hot = i;
	}
	function up(e: PointerEvent) {
		if (startIdx < 0) return;
		const i = hot;
		hot = -1;
		if (dragged && i >= 0) {
			suppressClick = true;
			setTimeout(() => (suppressClick = false), 400);
			nav.querySelector<HTMLElement>(`[data-dock-idx="${i}"]`)?.click();
		}
		startIdx = -1;
		dragged = false;
	}
	function cancel() {
		hot = -1;
		startIdx = -1;
		dragged = false;
	}
	function clickCapture(e: MouseEvent) {
		if (suppressClick && e.isTrusted) {
			e.stopPropagation();
			e.preventDefault();
			suppressClick = false;
		}
	}
	function pick(item: DockItemData, e: Event) {
		if (disabled.has(item.id)) {
			e.preventDefault();
			return;
		}
		moreOpen = false;
		onselect(item, e);
	}
	function keydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && moreOpen) {
			moreOpen = false;
			nav.querySelector<HTMLElement>('[data-more]')?.focus();
		}
	}
</script>

<svelte:window onpointerdown={(e) => moreOpen && !nav.contains(e.target as Node) && (moreOpen = false)} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	bind:this={nav}
	class="pointer-events-auto relative mx-auto w-full max-w-md px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
	onpointerdowncapture={down}
	onpointermove={move}
	onpointerup={up}
	onpointercancel={cancel}
	onclickcapture={clickCapture}
	onkeydown={keydown}
>
	{#if moreOpen && moreItems.length}
		<ul
			id="dock-more"
			class="absolute right-3 bottom-full mb-2 flex min-w-44 flex-col rounded-2xl border border-black/10 bg-white/90 p-1.5 shadow-xl backdrop-blur-xl"
		>
			{#each moreItems as item (item.id)}
				<li>
					<button
						type="button"
						aria-disabled={disabled.has(item.id) || undefined}
						class="flex min-h-11 w-full aria-disabled:opacity-45 items-center gap-3 rounded-xl px-3 text-left text-sm outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 active:bg-black/5"
						onclick={(e) => pick(item, e)}
					>
						<DockIcon icon={item.icon} class="size-5" />
						{item.label}{disabled.has(item.id) ? ' · soon' : ''}
					</button>
				</li>
			{/each}
		</ul>
	{/if}
	<div
		class="flex touch-none items-end justify-around rounded-[1.6rem] border border-black/10 bg-white/70 px-2 pt-2 pb-1.5 shadow-[0_10px_30px_-12px_rgb(0_0_0/0.35)] backdrop-blur-xl"
	>
		{#each slots as id, i (id)}
			{@const item = mobileItems.find((m) => m.id === id)}
			<div class="relative flex min-w-16 flex-col items-center" data-dock-idx={i}>
				{#if item}
					{#if item.href}
						<a href={item.href} aria-current={active === item.id ? 'page' : undefined} data-dock-idx={i} class="flex min-h-11 min-w-11 flex-col items-center gap-0.5 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2" onclick={(e) => pick(item, e)}>
							{@render face('size-11', item.icon, item.label, hot === i, item.iconSrc)}
						</a>
					{:else}
						<button type="button" data-dock-idx={i} class="flex min-h-11 min-w-11 flex-col items-center gap-0.5 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2" onclick={(e) => pick(item, e)}>
							{@render face('size-11', item.icon, item.label, hot === i, item.iconSrc)}
						</button>
					{/if}
				{:else}
					<button
						type="button"
						data-more
						data-dock-idx={i}
						aria-expanded={moreOpen}
						aria-controls="dock-more"
						class="flex min-h-11 min-w-11 flex-col items-center gap-0.5 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
						onclick={() => (moreOpen = !moreOpen)}
					>
						{@render face('size-11', 'more', 'More', hot === i)}
					</button>
				{/if}
				{#if item && active === item.id}
					<span class="mt-0.5 size-1 rounded-full bg-neutral-900" aria-hidden="true"></span>
				{:else}
					<span class="mt-0.5 size-1" aria-hidden="true"></span>
				{/if}
			</div>
		{/each}
	</div>
</div>

{#snippet face(size: string, icon: DockIconKey | 'more', label: string, lifted: boolean, iconSrc?: string)}
	<span
		class="block origin-bottom transition-transform duration-150 motion-reduce:transition-none {size} {lifted ? '-translate-y-1 scale-125 motion-reduce:scale-100' : ''}"
	>
		<DockTile {icon} {iconSrc} />
	</span>
	<span class="text-[11px] leading-none text-neutral-700 {lifted ? 'font-semibold' : ''}">{label}</span>
{/snippet}
