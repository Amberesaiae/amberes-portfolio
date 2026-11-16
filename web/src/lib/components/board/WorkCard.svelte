<script lang="ts">
	import type { WorkItem } from '#lib/data/board.ts';
	import Placeholder from './Placeholder.svelte';

	interface Props { item: WorkItem }
	let { item }: Props = $props();
</script>

<article
	class="group relative aspect-square w-full overflow-hidden rounded-xl bg-card shadow-sm md:w-[calc(100%-12px)]"
	data-work-card
	data-card-id={item.id}
>
	<Placeholder art={item.art} tone={item.tone} class="absolute inset-0 h-full w-full" />
	<div class="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-black/55 to-transparent p-5 pt-16 text-white">
		<span class="text-xs tracking-wide uppercase opacity-75">{item.status}</span>
		<h3 class="text-xl leading-tight font-medium">{item.title}</h3>
		<p class="text-sm leading-snug opacity-90">{item.blurb}</p>
	</div>
</article>
