<script lang="ts">
	import type { CollageItem } from '#lib/data/board.ts';
	import Placeholder from './Placeholder.svelte';

	interface Props { item: CollageItem }
	let { item }: Props = $props();
</script>

<div class="flex h-full w-full flex-col overflow-hidden rounded-lg bg-card">
	<Placeholder art={item.art} tone={item.tone} class="min-h-0 flex-1" />
	<div class="px-2 py-1 text-[clamp(12px,0.7cqw,13px)] leading-tight">
		<span class="font-medium">{item.label}</span>
	</div>
</div>
