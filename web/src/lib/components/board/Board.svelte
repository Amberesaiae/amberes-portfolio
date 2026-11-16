<script lang="ts">
	import { collage, work } from '#lib/data/board.ts';
	import { createPhysicsControls } from '#lib/physics/controls.js';
	import BoardHeader from './BoardHeader.svelte';
	import Collage from './Collage.svelte';
	import CollageControls from './CollageControls.svelte';
	import WorkGrid from './WorkGrid.svelte';

	interface Props {
		/** Bindable collage container for the physics gravity/scatter module. */
		collageEl?: HTMLElement | null;
	}
	let { collageEl = $bindable(null) }: Props = $props();
	const controls = createPhysicsControls();
</script>

<!-- pb-32 clears the fixed 96px dock. -->
<div class="board mx-auto w-full max-w-[1440px] overflow-x-clip bg-background pb-32" data-board style="container-type: inline-size">
	<BoardHeader />
	<CollageControls {controls} />
	<Collage items={collage} {controls} bind:container={collageEl} />
	<WorkGrid items={work} />
</div>
