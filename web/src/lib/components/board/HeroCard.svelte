<script lang="ts">
	import type { CollageItem } from '#lib/data/board.ts';
	import Placeholder from './Placeholder.svelte';

	interface Props { item: CollageItem }
	let { item }: Props = $props();
</script>

<div class="relative h-full w-full overflow-hidden rounded-xl shadow-md">
	<Placeholder art={item.art} tone={item.tone} class="h-full w-full" />
	<div class="absolute inset-x-0 bottom-0 p-[1.4cqw] text-white">
		<p class="text-[max(10px,0.8cqw)] tracking-wide uppercase opacity-70">{item.label}</p>
		<p class="text-[1.5cqw] leading-tight font-medium">{item.caption}</p>
	</div>
</div>
