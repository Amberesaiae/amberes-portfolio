<script lang="ts">
	import { introTiming, noiseTile } from '#lib/data/intro.js';

	interface Props {
		/** Raises the fade-to-page veil. */
		veil: boolean;
	}

	let { veil }: Props = $props();

	const grain = noiseTile(0.9);
</script>

<div class="intro-lens pointer-events-none absolute inset-0"></div>
<div class="intro-grain pointer-events-none absolute inset-0" style:background-image={grain}></div>
<div class="intro-veil pointer-events-none absolute inset-0 bg-[#0b0b0b] transition-opacity ease-out" style:transition-duration="{introTiming.veil}ms" class:opacity-0={!veil}></div>

<style>
	.intro-lens {
		background: radial-gradient(circle, #0000 62%, #080c0d66 100%);
	}
	.intro-grain {
		mix-blend-mode: overlay;
		opacity: 0.16;
		background-repeat: repeat;
		animation: intro-grain 0.6s steps(4) infinite;
	}
	@keyframes intro-grain {
		25% { background-position: -40px 20px; }
		50% { background-position: 30px -50px; }
		75% { background-position: -20px -30px; }
		100% { background-position: 50px 40px; }
	}
</style>
