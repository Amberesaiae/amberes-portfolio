<script lang="ts">
	import type { WorkItem } from '#lib/data/board.ts';
	import Placeholder from './Placeholder.svelte';

	interface Props {
		item: WorkItem;
		/** Mobile-only aspect class (desktop tiles are always square). */
		mobileAspect?: string;
	}
	let { item, mobileAspect = 'max-md:aspect-square' }: Props = $props();
</script>

<a
	id="work-{item.id}"
	href="#work-{item.id}"
	class="group relative block w-full overflow-hidden rounded-xl bg-card shadow-sm focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring md:aspect-square md:w-[calc(100%-12px)] {mobileAspect}"
	data-work-card
	data-card-id={item.id}
>
	<Placeholder art={item.art} tone={item.tone} class="absolute inset-0 h-full w-full" />
	<div class="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-black/85 via-black/70 to-transparent p-5 pt-20 text-white">
		<span class="text-xs tracking-wide uppercase text-white/90">{item.status}</span>
		<h3 class="text-xl leading-tight font-medium">{item.title}</h3>
		<p class="text-sm leading-snug text-white/95">{item.blurb}</p>
	</div>
</a>
