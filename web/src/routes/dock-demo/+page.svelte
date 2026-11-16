<script lang="ts">
	import Dock from '#lib/components/dock/Dock.svelte';
	import type { DockItemData } from '#lib/data/dock.ts';

	let active = $state('work');
	let log = $state('Nothing yet. Hover (desktop) or slide across the dock (touch).');

	function onaction(item: DockItemData) {
		log = `action: ${item.action}`;
	}
	function onnavigate(item: DockItemData) {
		active = item.id;
		log = `navigate: ${item.href}`;
	}
</script>

<svelte:head><title>Dock demo</title></svelte:head>

<main class="mx-auto flex min-h-dvh max-w-xl flex-col gap-4 p-8 pb-40">
	<h1 class="text-2xl font-semibold">Dock demo</h1>
	<p class="text-muted-foreground" aria-live="polite">{log}</p>
	{#each ['work', 'about', 'contact'] as id (id)}
		<section {id} class="h-64 scroll-mt-8 rounded-xl bg-card p-6 capitalize">{id}</section>
	{/each}
</main>

<Dock {active} {onaction} {onnavigate} />
