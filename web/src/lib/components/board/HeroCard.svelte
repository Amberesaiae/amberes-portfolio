<script lang="ts">
	import type { CollageItem } from '#lib/data/board.ts';
	import Placeholder from './Placeholder.svelte';

	interface Props { item: CollageItem }
	let { item }: Props = $props();
</script>

<div class="relative h-full w-full overflow-hidden rounded-xl shadow-xl">
	<Placeholder art={item.art} tone={item.tone} class="h-full w-full" />
	<div class="absolute inset-x-0 bottom-0 p-[1.4cqw] text-white">
		<p class="text-[clamp(11px,0.8cqw,13px)] tracking-wide uppercase opacity-80">{item.label}</p>
		<p class="text-[clamp(15px,1.5cqw,22px)] leading-tight font-medium">{item.caption}</p>
	</div>
</div>
