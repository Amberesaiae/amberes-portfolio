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
	class="absolute inset-0 transition-opacity duration-150 ease-out"
	class:opacity-0={!active}
	style:background="radial-gradient(ellipse at {left} {top}, oklch(0.3 0.05 {cut.hue}), oklch(0.12 0.02 {cut.hue}) 70%)"
>
	<svg class="absolute inset-0 size-full" preserveAspectRatio="xMidYMid meet" viewBox="0 0 160 90" aria-hidden="true">
		<g transform="translate({cx} {cy}) scale({portrait ? 1.7 : 1}) translate(-28 -20)">
			<rect x="0" y="0" width="56" height="40" rx="2" fill="oklch(0.9 0.04 {cut.hue})" />
			<rect x="4" y="4" width="48" height="26" rx="1" fill="oklch(0.45 0.12 {cut.hue})" />
			<text x="6" y="36" font-size="4" fill="oklch(0.2 0 0)" font-family="Geist, Inter, sans-serif">{cut.label}</text>
			<ellipse cx="-4" cy="30" rx="10" ry="14" fill="oklch(0.25 0.02 60)" />
			<ellipse cx="60" cy="30" rx="10" ry="14" fill="oklch(0.25 0.02 60)" />
		</g>
	</svg>
</div>
