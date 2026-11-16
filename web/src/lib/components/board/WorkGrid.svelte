<script lang="ts">
	import { GRID_PITCH, type WorkItem } from '#lib/data/board.ts';
	import WorkCard from './WorkCard.svelte';

	interface Props { items: WorkItem[] }
	let { items }: Props = $props();
	// Mobile-only rhythm; desktop stays square.
	const rhythm = ['max-md:aspect-square', 'max-md:aspect-[4/5]', 'max-md:aspect-[5/4]', 'max-md:aspect-[4/5]'];
	const cols = `repeat(3, ${GRID_PITCH * 100}%)`;
</script>

<!-- Mobile: one column of tiles. md+: rigid 3-up, 25.7% pitch, 12px gutter, centred. -->
<section
	class="work-grid grid grid-cols-1 gap-4 px-4 md:justify-center md:gap-x-0 md:gap-y-3 md:px-0 md:[grid-template-columns:var(--cols)]"
	style:--cols={cols}
	aria-labelledby="work"
	data-work-grid
>
	{#each items as item, i (item.id)}
		<div class="md:flex md:justify-center"><WorkCard {item} mobileAspect={rhythm[i % rhythm.length]} /></div>
	{/each}
</section>
