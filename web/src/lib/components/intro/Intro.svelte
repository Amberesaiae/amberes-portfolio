<script lang="ts">
	import { onMount } from 'svelte';
	import { beginIntro, completeIntro, introEarlyGate, introPhase, revealIntro } from '#lib/stores/intro.js';
	import { introTiming } from '#lib/data/intro.js';
	import IntroFilm from './IntroFilm.svelte';

	/**
	 * Opening film. Mount once in the root layout. Mark content that should wait for the film
	 * with `data-reveal` (or `data-reveal="paper" | "hands"`) and the header with `.site-header`.
	 */
	let tail: ReturnType<typeof setTimeout> | undefined;

	// NOTE: keep the early gate (stores/intro.ts introEarlyGate) in sync with beginIntro().
	// Runs before hydration so the page is hidden from first paint (only when the film will play).
	const earlyGate = introEarlyGate();

	function skip(e: Event) {
		if (e instanceof KeyboardEvent && ['Tab', 'Shift', 'Control', 'Meta', 'Alt'].includes(e.key)) return;
		if ($introPhase === 'play') revealIntro();
	}

	onMount(() => {
		beginIntro();
	});

	// While the film plays, the page behind it must not be tabbable or read out.
	$effect(() => {
		const playing = $introPhase === 'play';
		const kids = [...(document.body.firstElementChild?.children ?? [])].filter(
			(el) => !el.classList.contains('intro-loader') &&
				!el.classList.contains('intro-hint') && el.tagName !== 'SCRIPT'
		);
		kids.forEach((el) => el.toggleAttribute('inert', playing));
		return () => kids.forEach((el) => el.removeAttribute('inert'));
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
	/* Pre-hydration cover: the page is hidden from first paint, before the film mounts. */
	:global(html[data-intro='play']::before) {
		content: '';
		position: fixed;
		inset: 0;
		z-index: 99;
		background: #0b0b0b;
	}
	:global(html[data-intro] [data-reveal]),
	:global(html[data-intro] .site-header) {
		opacity: 0;
	}
	/* Delays mirror introStagger (data/intro.ts): paper +150ms, header +350ms, hands +500ms. */
	:global(html[data-intro='reveal'] [data-reveal]),
	:global(html[data-intro='reveal'] .site-header) {
		opacity: 1;
		transition: opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1);
	}
	:global(html[data-intro='reveal'] [data-reveal='hands']) {
		transition: opacity 0.35s cubic-bezier(0.5, 0, 0.3, 1) 0.5s;
	}
	:global(html[data-intro='reveal'] [data-reveal='paper']) {
		transition: opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.15s;
	}
	:global(html[data-intro='reveal'] .site-header) {
		transition: opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.35s;
	}
</style>
