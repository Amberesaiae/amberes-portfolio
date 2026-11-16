<script lang="ts">
	import { collage, work } from '#lib/data/board.ts';
	import { createPhysicsControls } from '#lib/physics/controls.js';
	import BoardHeader from './BoardHeader.svelte';
	import Collage from './Collage.svelte';
	import CollageControls from './CollageControls.svelte';
	import HeroCard from './HeroCard.svelte';
	import StatusColumn from './StatusColumn.svelte';
	import WorkGrid from './WorkGrid.svelte';

	interface Props {
		/** Bindable collage container for the physics gravity/scatter module. */
		collageEl?: HTMLElement | null;
	}
	let { collageEl = $bindable(null) }: Props = $props();
	const controls = createPhysicsControls();
	const hero = collage.find((c) => c.kind === 'hero');
</script>


<div class="board mx-auto w-full max-w-[1440px] overflow-x-clip bg-background pb-8" data-board style="container-type: inline-size">
	<BoardHeader>
		{#snippet aside()}
			<StatusColumn><CollageControls {controls} /></StatusColumn>
		{/snippet}
	</BoardHeader>
	{#if hero}
		<div class="px-4 pb-6 md:hidden" data-mobile-hero>
			<div class="aspect-video w-full"><HeroCard item={hero} /></div>
		</div>
	{/if}
	<Collage items={collage} {controls} bind:container={collageEl} />
	<h2 id="work" class="px-4 pt-8 pb-4 text-2xl font-medium md:px-[2.5cqw] md:pt-[1cqw]">Work</h2>
	<WorkGrid items={work} />
</div>
