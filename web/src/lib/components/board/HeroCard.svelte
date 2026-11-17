<script lang="ts">
	import type { CollageItem } from '#lib/data/board.ts';
	import Placeholder from './Placeholder.svelte';
	import MockVideo from './MockVideo.svelte';
	import MockMedia from './MockMedia.svelte';

	interface Props { item: CollageItem }
	let { item }: Props = $props();
</script>

<div class="relative h-full w-full overflow-hidden rounded-xl" data-reveal="hands">
	<Placeholder art={item.art} tone={item.tone} class="h-full w-full" />
	<MockMedia src={item.mockPoster} />
	<MockVideo src={item.mockSrc} poster={item.mockPoster} />
	<!-- Scrim: >= .72 black behind the caption so white text holds 4.5:1 on any imagery. -->
	<div class="absolute inset-0" style="background:linear-gradient(to top,rgba(0,0,0,.8) 0,rgba(0,0,0,.74) 26%,rgba(0,0,0,0) 62%)"></div>
	<div class="absolute inset-x-0 bottom-0 p-[1.4cqw] text-white">
		<p class="text-[clamp(12px,0.8cqw,13px)] tracking-wide uppercase opacity-80">{item.label}</p>
		<p class="text-[clamp(15px,1.5cqw,22px)] leading-tight font-medium">{item.caption}</p>
	</div>
</div>
