<script lang="ts">
	import DockIcon from './DockIcon.svelte';
	import type { DockIconKey } from '#lib/data/dock.ts';

	/** The icon face. Uses the supplied image (transparent PNG, drawn as-is) or falls back to the Lucide squircle. */
	let { icon, iconSrc }: { icon: DockIconKey | 'more'; iconSrc?: string } = $props();
	let failed = $state(false);
	const useImg = $derived(!!iconSrc && !failed);
</script>

{#if useImg}
	<span class="flex h-full w-full items-center justify-center">
		<img
			src={iconSrc}
			alt=""
			width="256"
			height="256"
			draggable="false"
			decoding="async"
			class="size-full rounded-[28%] object-cover shadow-[0_6px_14px_-6px_rgb(0_0_0/0.4)]"
			onerror={() => (failed = true)}
		/>
	</span>
{:else}
	<span
		class="flex h-full w-full items-center justify-center rounded-[28%] border border-black/10 bg-gradient-to-b from-white to-neutral-200 text-neutral-800 shadow-[0_6px_14px_-6px_rgb(0_0_0/0.4)]"
	>
		<DockIcon {icon} class="size-[46%]" />
	</span>
{/if}
