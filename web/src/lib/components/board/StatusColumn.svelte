<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { status } from '#lib/data/board.ts';

	interface Props { children?: Snippet }
	let { children }: Props = $props();

	let time = $state('');
	onMount(() => {
		const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Accra' });
		const tick = () => (time = fmt.format(new Date()));
		tick();
		const id = setInterval(tick, 30_000);
		return () => clearInterval(id);
	});
</script>

<aside class="flex flex-col gap-3 md:items-end md:text-right" aria-label="Studio status">
	<p class="flex items-center gap-2 text-sm">
		<span class="size-2 rounded-full bg-emerald-600" aria-hidden="true"></span>
		<span class="font-medium">{status.availability}</span>
		<span class="text-muted-foreground">Accra {time || '--:--'} GMT</span>
	</p>
	<p class="text-sm text-muted-foreground">Now building: <span class="text-foreground">{status.building}</span></p>
	{@render children?.()}
</aside>
