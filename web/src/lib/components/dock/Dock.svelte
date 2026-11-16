<script lang="ts">
	import type { DockItemData } from '#lib/data/dock.ts';
	import DockDesktop from './DockDesktop.svelte';
	import DockMobile from './DockMobile.svelte';

	/**
	 * Amber Studio dock. Mount once, e.g. in the root layout/page.
	 * - `active`: id of the running/active item (shows the indicator dot).
	 * - `onaction`: called for action items (terminal, reel, games, archive).
	 * - `onnavigate`: called for anchor items before the default navigation; call `preventDefault`
	 *   on the event if you want to handle scrolling yourself.
	 */
	let {
		active = '',
		onaction,
		onnavigate
	}: {
		active?: string;
		onaction?: (item: DockItemData) => void;
		onnavigate?: (item: DockItemData, e: Event) => void;
	} = $props();

	function onselect(item: DockItemData, e: Event) {
		if (item.href) onnavigate?.(item, e);
		else onaction?.(item);
	}
</script>

<div
	class="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center pb-3 max-md:pb-0"
>
	<div class="hidden md:block"><DockDesktop {active} {onselect} /></div>
	<div class="w-full md:hidden"><DockMobile {active} {onselect} /></div>
</div>
