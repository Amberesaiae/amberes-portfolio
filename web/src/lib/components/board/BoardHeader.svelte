<script lang="ts">
	import type { Snippet } from 'svelte';
	import { studio } from '#lib/data/board.ts';

	interface Props { aside?: Snippet }
	let { aside }: Props = $props();
</script>

<header class="site-header flex flex-col gap-6 px-4 pt-8 pb-6 md:flex-row md:justify-between md:px-[2.5cqw] md:pt-[2cqw] md:pb-[1cqw]">
	<div>
		<p class="text-xs font-medium tracking-[0.18em] uppercase">{studio.name}</p>
		<h1 class="mt-3 max-w-[18ch] text-4xl leading-[1.05] font-medium tracking-tight md:text-[4cqw] [text-wrap:balance]">{studio.headline.replaceAll('-', '\u2011')}</h1>
		<p class="mt-5 max-w-prose text-base text-muted-foreground md:text-[clamp(16px,1.15cqw,19px)]">{studio.intro}</p>
		<p class="mt-5 text-xs tracking-wide text-muted-foreground">{studio.owner}</p>
	</div>
	{@render aside?.()}
</header>
