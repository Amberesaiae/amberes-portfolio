<script lang="ts">
	import { onMount } from 'svelte';
	import { introStorageKey } from '#lib/data/intro.js';
	import { beginIntro, completeIntro, introPhase, revealIntro } from '#lib/stores/intro.js';
	import { introTiming } from '#lib/data/intro.js';
	import IntroFilm from './IntroFilm.svelte';

	/**
	 * Opening film. Mount once in the root layout. Mark content that should wait for the film
	 * with `data-reveal` (or `data-reveal="paper" | "hands"`) and the header with `.site-header`.
	 */
	let tail: ReturnType<typeof setTimeout> | undefined;

	// Runs before hydration so the page is hidden from first paint (only when the film will play).
	const earlyGate = `<script>try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&sessionStorage.getItem(${JSON.stringify(introStorageKey)})!=='1')document.documentElement.dataset.intro='play'}catch(e){}<\/script>`;

	function skip() {
		if ($introPhase === 'play') revealIntro();
	}

	onMount(() => {
		beginIntro();
		return () => clearTimeout(tail);
	});

	// Mirror the phase on <html>: play -> reveal -> attribute removed.
	$effect(() => {
		const el = document.documentElement;
		if ($introPhase === 'play' || $introPhase === 'reveal') el.dataset.intro = $introPhase;
		else if ($introPhase === 'done') delete el.dataset.intro;
	});

	$effect(() => {
		if ($introPhase === 'reveal') {
			tail = setTimeout(completeIntro, introTiming.revealTail);
			return () => clearTimeout(tail);
		}
	});
</script>

<svelte:head>
	{@html earlyGate}
</svelte:head>

<svelte:window onclick={skip} onkeydown={skip} />

{#if $introPhase === 'play' || $introPhase === 'reveal'}
	<IntroFilm phase={$introPhase} onfinish={revealIntro} />
{/if}

<style>
	:global(html[data-intro] [data-reveal]),
	:global(html[data-intro] .site-header) {
		opacity: 0;
	}
	:global(html[data-intro='reveal'] [data-reveal]),
	:global(html[data-intro='reveal'] .site-header) {
		opacity: 1;
		transition: opacity 1s cubic-bezier(0.22, 1, 0.36, 1);
	}
	:global(html[data-intro='reveal'] [data-reveal='hands']) {
		transition: opacity 1.1s cubic-bezier(0.5, 0, 0.3, 1) 0.5s;
	}
	:global(html[data-intro='reveal'] [data-reveal='paper']) {
		transition: opacity 1s cubic-bezier(0.22, 1, 0.36, 1) 0.15s;
	}
	:global(html[data-intro='reveal'] .site-header) {
		transition: opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.35s;
	}
</style>
