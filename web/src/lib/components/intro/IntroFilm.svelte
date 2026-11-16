<script lang="ts">
	import { onMount } from 'svelte';
	import { introCuts, introPhoto, introPieces, introTiming } from '#lib/data/intro.js';
	import IntroCut from './IntroCut.svelte';
	import IntroOverlays from './IntroOverlays.svelte';
	import IntroPiece from './IntroPiece.svelte';
	import IntroSkipHint from './IntroSkipHint.svelte';
	import IntroSmearFilter from './IntroSmearFilter.svelte';

	interface Props {
		/** `play` while the film runs, `reveal` while it fades out. */
		phase: 'play' | 'reveal';
		/** Called once when the timeline completes on its own. */
		onfinish: () => void;
	}

	let { phase, onfinish }: Props = $props();

	let board: HTMLDivElement | undefined = $state();
	let blur: SVGFEGaussianBlurElement | null = $state(null);
	let cutIndex = $state(-1);
	let veil = $state(false);
	let portrait = $state(false);
	// Hidden dust video (dev preview only); fed into each print's canvas.
	const dustSrc = introPhoto.dust();
	let dustVideo: HTMLVideoElement | null = $state(null);
	let dustReady = $state(false);

	/** Camera waypoints: centre of each piece on the virtual board. */
	const waypoints = introPieces.map((p) => ({
		x: p.at[0] + p.w / 2,
		y: p.at[1] + (p.w * p.size[1]) / p.size[0] / 2
	}));

	const easeInOut = (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

	function camera(progress: number): { x: number; y: number } {
		const segs = waypoints.length - 1;
		const scaled = easeInOut(Math.min(progress, 0.9999)) * segs;
		const i = Math.floor(scaled);
		const t = scaled - i;
		const a = waypoints[i];
		const b = waypoints[i + 1];
		return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
	}

	onMount(() => {
		const mq = matchMedia('(max-aspect-ratio: 1/1)');
		const syncPortrait = () => (portrait = mq.matches);
		syncPortrait();
		mq.addEventListener('change', syncPortrait);
		const { pan, cutHold, veil: veilMs } = introTiming;
		const veilStart = pan + cutHold * introCuts.length;
		const end = veilStart + veilMs;
		let raf = 0;
		let start = 0;
		let last = camera(0);
		let lastT = 0;
		let finished = false;

		const place = (c: { x: number; y: number }) => {
			// Fit the virtual board to the viewport: ~1600px of board visible across the width.
			const scale = Math.max(0.5, innerWidth / 1600);
			if (board) {
				board.style.transform = `translate(${innerWidth / 2}px, ${innerHeight / 2}px) scale(${scale}) translate(${-c.x}px, ${-c.y}px)`;
			}
			return scale;
		};
		place(last);

		const frame = (now: number) => {
			if (!start) {
				start = now;
				lastT = now;
			}
			const elapsed = now - start;
			const c = camera(Math.min(elapsed / pan, 1));
			const scale = place(c);
			const dt = Math.max(now - lastT, 1);
			// Directional smear: blur each axis by its own screen-space velocity.
			const vx = (Math.abs(c.x - last.x) * scale) / dt;
			const vy = (Math.abs(c.y - last.y) * scale) / dt;
			// Proportional clamp keeps the smear's direction at peak speed.
			const k = Math.min(1, 22 / Math.max(vx * 9, vy * 9, 0.001));
			blur?.setAttribute('stdDeviation', `${(vx * 9 * k).toFixed(2)} ${(vy * 9 * k).toFixed(2)}`);
			last = c;
			lastT = now;

			cutIndex = elapsed < pan ? -1 : Math.min(Math.floor((elapsed - pan) / cutHold), introCuts.length - 1);
			veil = elapsed >= veilStart;

			if (elapsed >= end) {
				if (!finished) {
					finished = true;
					onfinish();
				}
				return;
			}
			raf = requestAnimationFrame(frame);
		};
		raf = requestAnimationFrame(frame);

		return () => {
			cancelAnimationFrame(raf);
			mq.removeEventListener('change', syncPortrait);
		};
	});
</script>

<div
	class="intro-loader fixed inset-0 z-[100] bg-[#0b0b0b] transition-opacity ease-[cubic-bezier(.22,1,.36,1)]"
	style:transition-duration="{introTiming.fade}ms"
	class:opacity-0={phase === 'reveal'}
	class:pointer-events-none={phase === 'reveal'}
	aria-hidden="true"
>
	<div class="intro-film absolute inset-0 overflow-hidden bg-[#0b0b0b] select-none">
		<IntroSmearFilter bind:blur />
		{#if dustSrc}
			<!-- svelte-ignore a11y_media_has_caption -->
			<video
				bind:this={dustVideo}
				src={dustSrc}
				muted
				loop
				autoplay
				playsinline
				preload="auto"
				class="pointer-events-none absolute size-px opacity-0"
				oncanplay={() => (dustReady = true)}
				onerror={() => (dustReady = false)}
			></video>
		{/if}
		<div bind:this={board} class="absolute top-0 left-0 origin-top-left will-change-transform" style:filter="url(#intro-smear)">
			{#each introPieces as piece (piece.id)}
				<IntroPiece {piece} dustVideo={dustReady ? dustVideo : null} />
			{/each}
		</div>
		{#each introCuts as cut, i (cut.id)}
			<IntroCut {cut} active={i === cutIndex} {portrait} />
		{/each}
		<IntroOverlays {veil} />
	</div>
</div>

<IntroSkipHint visible={phase === 'play'} />
