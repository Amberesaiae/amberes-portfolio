<script lang="ts">
	import type { CollageItem } from '#lib/data/board.ts';
	import Placeholder from './Placeholder.svelte';
	import MockMedia from './MockMedia.svelte';

	interface Props { item: CollageItem }
	let { item }: Props = $props();
</script>

<div class="flex h-full w-full flex-col overflow-hidden rounded-lg bg-card">
	<div class="relative min-h-0 flex-1">
		<Placeholder art={item.art} tone={item.tone} class="h-full w-full" />
		<MockMedia src={item.mockSrc} />
	</div>
	<div class="px-2 py-1 text-[clamp(12px,0.7cqw,13px)] leading-tight">
		<span class="font-medium">{item.label}</span>
	</div>
</div>
