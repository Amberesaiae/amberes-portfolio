<script lang="ts">
	import type { CollageItem } from '#lib/data/board.ts';
	import Placeholder from './Placeholder.svelte';
	import MockVideo from './MockVideo.svelte';
	import MockMedia from './MockMedia.svelte';

	interface Props { item: CollageItem }
	let { item }: Props = $props();
</script>

<div class="relative h-full w-full overflow-hidden rounded-xl">
	<Placeholder art={item.art} tone={item.tone} class="h-full w-full" />
	<MockMedia src={item.mockPoster} />
	<MockVideo src={item.mockSrc} poster={item.mockPoster} />
	{#if item.mockSrc}<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>{/if}
	<div class="absolute inset-x-0 bottom-0 p-[1.4cqw] text-white">
		<p class="text-[clamp(12px,0.8cqw,13px)] tracking-wide uppercase opacity-80">{item.label}</p>
		<p class="text-[clamp(15px,1.5cqw,22px)] leading-tight font-medium">{item.caption}</p>
	</div>
</div>
