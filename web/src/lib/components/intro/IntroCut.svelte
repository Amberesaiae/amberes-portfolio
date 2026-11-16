<script lang="ts">
	import type { IntroCutData } from '#lib/data/intro.js';

	interface Props {
		cut: IntroCutData;
		active: boolean;
		/** Portrait frames centre the card and enlarge it so it stays in view. */
		portrait: boolean;
	}

	let { cut, active, portrait }: Props = $props();

	const centre = $derived(portrait ? 0.5 : (cut.centre ?? 0.5));
	const cx = $derived(centre * 160);
	const cy = $derived((cut.focus + (cut.drop ?? 0)) * 90);
	const top = $derived(`${(cut.focus + (cut.drop ?? 0)) * 100}%`);
	const left = $derived(`${centre * 100}%`);
</script>

<!-- Placeholder for "hands holding a printed card on a dark table". -->
<div
	class="absolute inset-0 transition-opacity duration-75 ease-out"
	class:opacity-0={!active}
	style:background="radial-gradient(ellipse at {left} {top}, oklch(0.24 0.012 {cut.hue}), oklch(0.11 0.006 {cut.hue}) 70%)"
>
	<svg class="absolute inset-0 size-full" preserveAspectRatio="xMidYMid meet" viewBox="0 0 160 90" aria-hidden="true">
		<g transform="translate({cx} {cy}) scale({portrait ? 1.7 : 1}) translate(-28 -20)">
			<rect x="1.5" y="3" width="56" height="40" rx="2" fill="oklch(0 0 0 / .45)" />
			<rect x="0" y="0" width="56" height="40" rx="2" fill="oklch(0.9 0.012 {cut.hue})" />
			<rect x="4" y="4" width="48" height="26" rx="1" fill="oklch(0.3 0.02 {cut.hue})" />
			<text x="6" y="36" font-size="4" fill="oklch(0.18 0.01 80)" font-family="Geist, Inter, sans-serif">{cut.label}</text>
			<g fill="oklch(0.14 0.01 60)">
				<rect x="-26" y="44" width="22" height="30" rx="3" />
				<rect x="60" y="44" width="22" height="30" rx="3" />
			</g>
			<g fill="oklch(0.34 0.025 55)">
				<ellipse cx="-2" cy="30" rx="3.2" ry="6.5" transform="rotate(-25 -2 30)" />
				<ellipse cx="58" cy="30" rx="3.2" ry="6.5" transform="rotate(25 58 30)" />
				<path d="M-14 46 q-2 -22 8 -28 l8 -2 q4 10 4 22 z" />
				<rect x="-3" y="12" width="4" height="14" rx="2" />
				<rect x="2" y="8" width="4" height="15" rx="2" />
				<rect x="7" y="9" width="4" height="14" rx="2" />
				<path d="M70 46 q2 -22 -8 -28 l-8 -2 q-4 10 -4 22 z" />
				<rect x="55" y="12" width="4" height="14" rx="2" />
				<rect x="50" y="8" width="4" height="15" rx="2" />
				<rect x="45" y="9" width="4" height="14" rx="2" />
			</g>
		</g>
	</svg>
</div>
