<script lang="ts">
	import type { WorkItem } from '#lib/data/board.ts';
	import Placeholder from './Placeholder.svelte';
	import MockMedia from './MockMedia.svelte';

	interface Props {
		item: WorkItem;
	}
	let { item }: Props = $props();
</script>

<a
	id="work-{item.id}"
	href="#work-{item.id}"
	class="group relative block w-full overflow-hidden rounded-xl bg-card shadow-sm focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring aspect-square md:w-[calc(100%-12px)]"
	data-work-card
	data-card-id={item.id}
>
	<Placeholder art={item.art} tone={item.tone} class="absolute inset-0 h-full w-full" />
	<MockMedia src={item.mockSrc} />
	<div class="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-5 pt-16 text-white" style="background:linear-gradient(to top,rgba(0,0,0,.88) 0,rgba(0,0,0,.76) 72%,rgba(0,0,0,0) 100%)">
		<span class="text-xs tracking-wide uppercase text-white/90">{item.status}</span>
		<h3 class="text-xl leading-tight font-medium">{item.title}</h3>
		<p class="text-sm leading-snug text-white/95">{item.blurb}</p>
	</div>
</a>
