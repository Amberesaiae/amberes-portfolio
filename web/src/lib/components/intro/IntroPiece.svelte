<script lang="ts">
	import type { IntroPieceData } from '#lib/data/intro.js';
	import { noiseTile } from '#lib/data/intro.js';

	interface Props {
		piece: IntroPieceData;
	}

	let { piece }: Props = $props();

	const height = $derived((piece.w * piece.size[1]) / piece.size[0]);
	const [lx, ly, strength] = $derived(piece.look);
	const paper = noiseTile(0.8);
</script>

<!-- isolation keeps each print's hard-light paper and screen dust from bleeding into others -->
<div
	class="intro-print absolute overflow-hidden rounded-[6px]"
	style:left="{piece.at[0]}px"
	style:top="{piece.at[1]}px"
	style:width="{piece.w}px"
	style:height="{height}px"
	style:transform="rotate({piece.turn}deg)"
	style:box-shadow="0 18px 40px rgb(0 0 0 / .55), 0 2px 6px rgb(0 0 0 / .5)"
	style:background="oklch({0.82 + strength * 0.1} 0.012 {piece.hue})"
>
	<!-- printed sheet: paper margin, dark printed surface lit from the look point -->
	<div
		class="absolute inset-[5%] rounded-[3px]"
		style:background="radial-gradient(circle at {lx * 100}% {ly * 100}%, oklch({0.34 + strength * 0.14} 0.02 {piece.hue}), oklch(0.16 0.01 {piece.hue}) 80%)"
	></div>
	<span class="absolute bottom-[10%] left-[9%] font-sans text-[clamp(28px,4vw,64px)] font-medium tracking-tight text-[oklch(0.93_0.01_80)]">
		{piece.label}
	</span>
	<div class="intro-print-paper absolute inset-0" style:background-image={paper}></div>
	<div class="intro-print-dust absolute inset-0"></div>
</div>

<style>
	.intro-print {
		isolation: isolate;
	}
	.intro-print-paper {
		mix-blend-mode: hard-light;
		opacity: 0.22;
		background-repeat: repeat;
	}
	.intro-print-dust {
		mix-blend-mode: screen;
		opacity: 0.7;
		background-image:
			radial-gradient(circle at 20% 30%, rgb(255 255 255 / 0.5) 0 1px, transparent 2px),
			radial-gradient(circle at 70% 60%, rgb(255 255 255 / 0.4) 0 1px, transparent 2px),
			radial-gradient(circle at 45% 85%, rgb(255 255 255 / 0.35) 0 1.5px, transparent 2.5px);
		background-size: 180px 140px, 230px 190px, 310px 260px;
		animation: intro-dust 6s linear infinite;
	}
	@keyframes intro-dust {
		to {
			background-position: 180px -140px, -230px 190px, 310px 260px;
		}
	}
</style>
