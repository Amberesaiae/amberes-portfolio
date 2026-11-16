<script lang="ts">
	import X from '@lucide/svelte/icons/x';
	import type { DockItemData } from '#lib/data/dock.ts';

	/** Placeholder sheet for dock actions that have no real window yet (native <dialog>: focus trap + Esc). */
	let { item = null, onclose }: { item?: DockItemData | null; onclose: () => void } = $props();
	let dlg: HTMLDialogElement;

	$effect(() => {
		if (item && !dlg.open) dlg.showModal();
		else if (!item && dlg.open) dlg.close();
	});
</script>

<dialog
	bind:this={dlg}
	aria-labelledby="dock-sheet-title"
	class="m-auto w-[min(92vw,28rem)] rounded-3xl border border-black/10 bg-white p-6 text-neutral-900 shadow-2xl backdrop:bg-black/30 backdrop:backdrop-blur-sm max-md:mb-24"
	onclose={onclose}
	onclick={(e) => e.target === dlg && dlg.close()}
>
	<div class="flex items-start justify-between gap-4">
		<h2 id="dock-sheet-title" class="text-xl font-semibold">{item?.label}</h2>
		<button
			type="button"
			aria-label="Close"
			class="grid size-11 place-items-center rounded-full outline-none hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-neutral-900"
			onclick={() => dlg.close()}
		>
			<X class="size-5" aria-hidden="true" />
		</button>
	</div>
	<p class="mt-2 text-sm text-neutral-600">
		{item?.label} opens here once its window is built. This is a stub so the dock item has a real,
		keyboard-accessible target.
	</p>
</dialog>
