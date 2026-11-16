<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		onclick: () => void;
		pressed?: boolean;
		children: Snippet;
	}
	let { onclick, pressed, children }: Props = $props();
</script>

<!-- 44px minimum target on every pointer type. -->
<button
	type="button"
	class="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border bg-card px-5 text-sm font-medium hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
	aria-pressed={pressed}
	{onclick}
>
	{@render children()}
</button>
