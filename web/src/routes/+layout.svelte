<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { announce, SkipLink } from '#lib/a11y/index.ts';
	import Intro from '#lib/components/intro/Intro.svelte';
	import Dock from '#lib/components/dock/Dock.svelte';
	import geistLatin from '@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	// Announce client-side route changes (SvelteKit also resets focus to <body>).
	afterNavigate(({ type }) => {
		if (type !== 'enter') announce(document.title);
	});

	onMount(() => {
		// Landmark contract: each page renders exactly ONE <main>. Warn in dev if not.
		if (import.meta.env.DEV) {
			const mains = document.querySelectorAll('main, [role="main"]').length;
			if (mains !== 1) console.warn(`[a11y] expected exactly one <main> landmark, found ${mains}`);
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preload" as="font" type="font/woff2" href={geistLatin} crossorigin="anonymous" />
	<title>Amber Studio</title>
</svelte:head>

<Intro />
<SkipLink href="#content" />

<!-- Not a landmark: skip target only. Pages supply <header>/<nav>/<main>/<footer>. -->
<div id="content" tabindex="-1">
	{@render children()}
</div>

<Dock />
