<script lang="ts">
	import { dustTile } from '#lib/data/intro.js';

	interface Props {
		/** Shared hidden dust video. When absent (production, or the file is missing) a CSS dust tile is used. */
		video: HTMLVideoElement | null;
	}

	let { video }: Props = $props();

	let canvas: HTMLCanvasElement | undefined = $state();
	const tile = dustTile();

	// One decoded video feeds every print's canvas, as in the teardown.
	$effect(() => {
		const ctx = canvas?.getContext('2d');
		if (!video || !canvas || !ctx) return;
		let raf = 0;
		const draw = () => {
			if (video.readyState >= 2) ctx.drawImage(video, 0, 0, canvas!.width, canvas!.height);
			raf = requestAnimationFrame(draw);
		};
		raf = requestAnimationFrame(draw);
		return () => cancelAnimationFrame(raf);
	});
</script>

{#if video}
	<canvas bind:this={canvas} width="480" height="320" class="intro-print-dust absolute inset-0 size-full"></canvas>
{:else}
	<div class="intro-print-dust intro-dust-css absolute inset-0" style:background-image={tile}></div>
{/if}

<style>
	.intro-print-dust {
		mix-blend-mode: screen;
		opacity: 0.7;
	}
	.intro-dust-css {
		background-size: 420px 320px;
		animation: intro-dust 5s steps(5) infinite;
	}
	@keyframes intro-dust {
		to {
			background-position: 420px -320px;
		}
	}
</style>
