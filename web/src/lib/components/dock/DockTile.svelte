<script lang="ts">
	import DockIcon from './DockIcon.svelte';
	import type { DockIconKey } from '#lib/data/dock.ts';

	/** The squircle icon face. Placeholder for the photographed-object icon set. */
	let { icon }: { icon: DockIconKey | 'more' } = $props();
</script>

<span
	class="flex h-full w-full items-center justify-center rounded-[28%] border border-black/10 bg-gradient-to-b from-white to-neutral-200 text-neutral-800 shadow-[0_6px_14px_-6px_rgb(0_0_0/0.4)]"
>
	<DockIcon {icon} class="size-[46%]" />
</span>
