<script lang="ts">
	import PhysicsLayer from '#lib/components/physics/PhysicsLayer.svelte';
	import { createPhysicsControls } from '#lib/physics/index.js';

	const controls = createPhysicsControls();
	const cards = Array.from({ length: 9 }, (_, i) => ({
		id: i,
		w: i % 3 === 0 ? 124 : i % 3 === 1 ? 96 : 150,
		h: i % 3 === 0 ? 89 : i % 3 === 1 ? 132 : 108
	}));
</script>

<main class="mx-auto flex max-w-4xl flex-col gap-4 p-6">
	<h1 class="text-xl font-medium">Physics demo</h1>
	<div class="flex flex-wrap items-center gap-2">
		<button class="rounded-full border px-4 py-1.5" data-testid="gravity" onclick={controls.toggleGravity}>
			{$controls.mode === 'gravity' ? 'Restore' : 'Gravity'}
		</button>
		<button class="rounded-full border px-4 py-1.5" data-testid="scatter" onclick={controls.scatter}>Scatter</button>
		<button class="rounded-full border px-4 py-1.5" data-testid="restore" onclick={controls.restore}>Restore</button>
		<span class="text-sm opacity-70" data-testid="mode">mode: {$controls.mode}</span>
		{#if $controls.reduced}<span class="text-sm opacity-70">reduced motion: instant states</span>{/if}
	</div>

	<PhysicsLayer {controls} class="h-[600px] overflow-hidden rounded-3xl border bg-neutral-100">
		<div class="flex flex-wrap content-start gap-4 p-5">
			{#each cards as c (c.id)}
				<div
					data-physics-card
					class="grid place-items-center rounded-2xl bg-neutral-300 text-sm"
					style="width:{c.w}px;height:{c.h}px"
				>
					Card {c.id + 1}
				</div>
			{/each}
		</div>
	</PhysicsLayer>
</main>
