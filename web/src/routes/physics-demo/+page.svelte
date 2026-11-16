<script lang="ts">
	import PhysicsLayer from '#lib/components/physics/PhysicsLayer.svelte';
	import { createPhysicsControls } from '#lib/physics/index.js';

	import { page } from '$app/state';
	const controls = createPhysicsControls();
	const count = Math.min(96, Math.max(1, Number(page.url.searchParams.get('n')) || 9));
	const collage = page.url.searchParams.get('layout') === 'collage';
	const cards = Array.from({ length: count }, (_, i) => ({
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

	<PhysicsLayer {controls} class="{collage ? "" : "h-[600px] max-md:h-[480px]"} overflow-hidden rounded-3xl border bg-neutral-100">
		<div class="flex flex-wrap content-start gap-4 p-5">
			{#if collage}
				<div class="relative h-[1400px]">
					{#each cards as c (c.id)}
						<div
							data-physics-card
							class="absolute grid place-items-center rounded-2xl bg-neutral-300 text-sm"
							style="left:{(c.id % 4) * 20 + 4}%;top:{Math.floor(c.id / 4) * 90 + 30}px;width:{c.w * 1.6}px;height:{c.h * 1.6}px;rotate:{(c.id % 5) - 2}deg"
						>
							Card {c.id + 1}
						</div>
					{/each}
				</div>
			{:else}
			{#each cards as c (c.id)}
				<div
					data-physics-card
					class="grid place-items-center rounded-2xl bg-neutral-300 text-sm"
					style="width:{c.w}px;height:{c.h}px"
				>
					Card {c.id + 1}
				</div>
			{/each}
			{/if}
		</div>
	</PhysicsLayer>
</main>
