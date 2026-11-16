<script lang="ts">
	import { collage, work } from '#lib/data/board.ts';
	import BoardHeader from './BoardHeader.svelte';
	import Collage from './Collage.svelte';
	import WorkGrid from './WorkGrid.svelte';

	interface Props {
		/** Bindable collage container for the physics gravity/scatter module. */
		collageEl?: HTMLElement | null;
	}
	let { collageEl = $bindable(null) }: Props = $props();
</script>

<div class="board mx-auto w-full max-w-[1440px] overflow-x-clip bg-background pb-16" data-board style="container-type: inline-size">
	<BoardHeader />
	<Collage items={collage} bind:container={collageEl} />
	<WorkGrid items={work} />
</div>
