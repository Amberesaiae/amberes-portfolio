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
	class="board-card board-card--{item.kind} absolute rounded-lg motion-safe:transition-shadow motion-safe:hover:z-10 {item.kind === 'hero' ? 'shadow-tier-2' : 'shadow-tier-1 hover:shadow-tier-2'}"
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

<style>
	/* Two shadow tiers: tier 1 resting cards, tier 2 hero + hover. */
	.shadow-tier-1 {
		box-shadow: 0 1px 2px rgb(0 0 0 / 0.2), 0 6px 14px rgb(0 0 0 / 0.16);
	}
	.shadow-tier-2,
	.hover\:shadow-tier-2:hover {
		box-shadow: 0 4px 8px rgb(0 0 0 / 0.22), 0 28px 56px rgb(0 0 0 / 0.34);
	}
	/* Paper grain: fine SVG noise multiplied over the card. */
	.board-card::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		pointer-events: none;
		opacity: 0.6;
		mix-blend-mode: multiply;
		background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.35 0 0 0 0 0.33 0 0 0 0 0.3 0 0 0 1.6 -0.35'/></filter><rect width='160' height='160' filter='url(%23n)'/></svg>");
	}
</style>
