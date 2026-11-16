<script lang="ts">
	import { BOARD_WIDTH, COLLAGE_HEIGHT, type CollageItem } from '#lib/data/board.ts';
	import CollageCard from './CollageCard.svelte';

	interface Props {
		items: CollageItem[];
		/** Bindable container element: the physics module attaches here. */
		container?: HTMLElement | null;
	}
	let { items, container = $bindable(null) }: Props = $props();
</script>

<!-- Desktop only: dropped entirely below the md breakpoint. -->
<div
	bind:this={container}
	class="relative hidden w-full md:block"
	data-board-collage
	style:aspect-ratio="{BOARD_WIDTH} / {COLLAGE_HEIGHT}"
>
	{#each items as item (item.id)}
		<CollageCard {item} />
	{/each}
</div>
