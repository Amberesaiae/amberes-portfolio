<script lang="ts">
	import { BOARD_WIDTH, COLLAGE_HEIGHT, type CollageItem } from '#lib/data/board.ts';
	import PhysicsLayer from '#lib/components/physics/PhysicsLayer.svelte';
	import type { PhysicsControls } from '#lib/physics/controls.js';
	import CollageCard from './CollageCard.svelte';

	interface Props {
		items: CollageItem[];
		/** Bindable container element: the physics module attaches here. */
		container?: HTMLElement | null;
		controls?: PhysicsControls;
	}
	let { items, container = $bindable(null), controls }: Props = $props();
</script>

<!-- Desktop only: dropped entirely below the md breakpoint. Physics is idle until a control is used. -->
<PhysicsLayer {controls} class="hidden w-full md:block">
	<div
		bind:this={container}
		class="relative w-full"
		data-board-collage
		style:aspect-ratio="{BOARD_WIDTH} / {COLLAGE_HEIGHT}"
	>
		{#each items as item (item.id)}
			<CollageCard {item} />
		{/each}
	</div>
</PhysicsLayer>
