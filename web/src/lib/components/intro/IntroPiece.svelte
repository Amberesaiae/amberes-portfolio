<script lang="ts">
	import type { IntroPieceData } from '#lib/data/intro.js';
	import { dustTile, paperTile } from '#lib/data/intro.js';
	import IntroScene from './IntroScene.svelte';

	interface Props {
		piece: IntroPieceData;
	}

	let { piece }: Props = $props();

	const height = $derived((piece.w * piece.size[1]) / piece.size[0]);
	const [lx, ly, strength] = $derived(piece.look);
	const paper = paperTile();
	const dust = dustTile();
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
	<!-- printed sheet: paper margin around a flat-lay stand-in, lit from the look point -->
	<div class="absolute inset-[4%] overflow-hidden rounded-[3px]">
		<IntroScene scene={piece.scene} hue={piece.hue} />
		<div
			class="absolute inset-0"
			style:background="radial-gradient(circle at {lx * 100}% {ly * 100}%, oklch(1 0 0 / {0.04 + strength * 0.14}), transparent 60%), radial-gradient(circle, transparent 55%, oklch(0 0 0 / .35))"
		></div>
	</div>
	<span class="absolute bottom-[6%] left-[8%] font-sans text-[clamp(20px,2.6vw,44px)] font-medium tracking-tight text-[oklch(0.2_0.01_80)]">
		{piece.label}
	</span>
	<div class="intro-print-paper absolute inset-0" style:background-image={paper}></div>
	<div class="intro-print-dust absolute inset-0" style:background-image={dust}></div>
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
		background-size: 420px 320px;
		animation: intro-dust 5s steps(5) infinite;
	}
	@keyframes intro-dust {
		to {
			background-position: 420px -320px;
		}
	}
</style>
