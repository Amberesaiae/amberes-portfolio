<svelte:head><title>Dock demo</title></svelte:head>

<!-- The Dock itself is mounted once in the root layout; this page just provides anchor targets. -->
<main class="mx-auto flex min-h-dvh max-w-xl flex-col gap-4 p-8 pb-40">
	<h1 class="text-2xl font-semibold">Dock demo</h1>
	<p class="text-muted-foreground">
		Hover the dock (desktop) or slide across it (touch). Targets below exist, so About and Talk
		are enabled and the active dot follows scroll.
	</p>
	{#each ['work', 'about', 'contact'] as id (id)}
		<section {id} class="h-96 scroll-mt-8 rounded-xl bg-card p-6 capitalize">{id}</section>
	{/each}
</main>
