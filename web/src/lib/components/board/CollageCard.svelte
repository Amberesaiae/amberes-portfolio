<script lang="ts">
	import { BOARD_WIDTH, HOUSE_ASPECT, type CollageItem } from '#lib/data/board.ts';
	import HouseCard from './HouseCard.svelte';
	import PortraitCard from './PortraitCard.svelte';
	import HeroCard from './HeroCard.svelte';

	interface Props { item: CollageItem }
	let { item }: Props = $props();

	const cqw = (px: number) => `${(px / BOARD_WIDTH) * 100}cqw`;
	const h = $derived(
		item.kind === 'portrait' ? 220 : item.kind === 'hero' ? (item.w * 9) / 16 : item.w / HOUSE_ASPECT
	);
</script>

<!-- Physics hook: every collage card carries .board-card + data-board-card/-kind/-id.
     Position is left/top; rotation uses the standalone `rotate` property so a physics
     module may freely drive `transform` without clobbering the resting pose. -->
<div
	class="board-card board-card--{item.kind} absolute motion-safe:transition-shadow motion-safe:hover:z-10 motion-safe:hover:shadow-xl"
	data-board-card
	data-physics-card
	data-card-kind={item.kind}
	data-card-id={item.id}
	style:left={cqw(item.x)}
	style:top={cqw(item.y)}
	style:width={cqw(item.w)}
	style:height={cqw(h)}
	style:rotate="{item.rot}deg"
>
	{#if item.kind === 'house'}
		<HouseCard {item} />
	{:else if item.kind === 'portrait'}
		<PortraitCard {item} />
	{:else}
		<HeroCard {item} />
	{/if}
</div>
