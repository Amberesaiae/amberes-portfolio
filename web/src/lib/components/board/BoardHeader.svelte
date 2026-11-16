<script lang="ts">
	import { studio } from '#lib/data/board.ts';
</script>

<header class="px-4 pt-8 pb-6 md:px-[2.5cqw] md:pt-[2.5cqw]">
	<p class="text-sm font-medium">{studio.name}</p>
	<h1 class="mt-3 max-w-[18ch] text-4xl leading-[1.05] font-medium tracking-tight capitalize md:text-[4cqw]">
		{studio.motto}
	</h1>
	<p class="mt-4 max-w-prose text-base text-muted-foreground md:text-[1.1cqw]">{studio.intro}</p>
	<p class="mt-2 text-sm text-muted-foreground">{studio.owner}</p>
</header>
