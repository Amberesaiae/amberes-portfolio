<script lang="ts">
	import type { CollageItem } from '#lib/data/board.ts';
	import Placeholder from './Placeholder.svelte';

	interface Props { item: CollageItem }
	let { item }: Props = $props();
</script>

<div class="relative h-full w-full overflow-hidden rounded-lg bg-card shadow-sm">
	<Placeholder art={item.art} tone={item.tone} class="h-full w-full" />
	<span class="absolute bottom-[0.6cqw] left-[0.7cqw] text-[max(10px,0.7cqw)] font-medium text-foreground/70">{item.label}</span>
</div>
