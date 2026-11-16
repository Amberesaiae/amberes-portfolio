<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		/** Shared, hidden, looping dust video (mock media). Frames are copied onto this canvas. */
		video: HTMLVideoElement;
	}

	let { video }: Props = $props();
	let canvas: HTMLCanvasElement | undefined = $state();

	onMount(() => {
		const ctx = canvas?.getContext('2d');
		let raf = 0;
		const draw = () => {
			if (ctx && canvas && video.readyState >= 2 && video.videoWidth) {
				ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
			}
			raf = requestAnimationFrame(draw);
		};
		raf = requestAnimationFrame(draw);
		return () => cancelAnimationFrame(raf);
	});
</script>

<!-- Low-res on purpose: dust is soft specks; screen-blended by the parent print. -->
<canvas bind:this={canvas} width="320" height="180" class="intro-print-dust absolute inset-0 size-full"></canvas>

<style>
	.intro-print-dust {
		mix-blend-mode: screen;
		opacity: 0.7;
	}
</style>
