<script lang="ts">
	import type { IntroScene } from '#lib/data/intro.js';

	interface Props {
		scene: IntroScene;
		hue: number;
	}

	let { scene, hue }: Props = $props();

	const ink = $derived(`oklch(0.2 0.012 ${hue})`);
	const mid = $derived(`oklch(0.42 0.016 ${hue})`);
	const light = $derived(`oklch(0.86 0.012 ${hue})`);
	const steel = 'oklch(0.7 0.006 250)';
</script>

<!-- Neutral flat-lay stand-ins: stylised objects on a dark table, drawn in SVG. No photographs. -->
<svg class="absolute inset-0 size-full" viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
	<rect width="200" height="150" fill={ink} />
	{#if scene === 'phone'}
		<g transform="rotate(-6 100 75)">
			<rect x="70" y="14" width="46" height="94" rx="7" fill="oklch(0.12 0.005 {hue})" stroke={steel} stroke-width="1" />
			<rect x="74" y="20" width="38" height="82" rx="3" fill={mid} />
			<rect x="78" y="26" width="30" height="6" rx="1" fill={light} />
			<rect x="78" y="36" width="30" height="22" rx="1.5" fill="oklch(0.55 0.02 {hue})" />
			<rect x="78" y="62" width="18" height="3" rx="1" fill={light} />
			<rect x="78" y="68" width="26" height="3" rx="1" fill={light} opacity=".6" />
			<rect x="78" y="74" width="22" height="3" rx="1" fill={light} opacity=".6" />
		</g>
		<rect x="132" y="86" width="40" height="14" rx="3" fill="oklch(0.5 0.07 250)" transform="rotate(14 150 93)" />
		<path d="M24 100 h22 a5 5 0 0 1 0 10 h-18 a3 3 0 0 1 0 -6 h12" fill="none" stroke={steel} stroke-width="1.4" />
		<path d="M30 124 h22 a5 5 0 0 1 0 10 h-18 a3 3 0 0 1 0 -6 h12" fill="none" stroke={steel} stroke-width="1.4" />
	{:else if scene === 'print'}
		<rect x="38" y="14" width="124" height="122" rx="2" fill={light} />
		<rect x="46" y="22" width="108" height="44" fill={mid} />
		<circle cx="76" cy="44" r="12" fill={light} opacity=".5" />
		{#each [76, 84, 92, 100, 108, 116] as y, i}
			<rect x="46" y={y} width={i % 3 === 2 ? 70 : 108} height="3" rx="1" fill={ink} opacity=".55" />
		{/each}
		<rect x="46" y="124" width="30" height="5" rx="1" fill={ink} opacity=".8" />
	{:else if scene === 'laptop'}
		<g transform="rotate(-4 100 75)">
			<path d="M46 108 h108 l12 22 h-132 z" fill="oklch(0.34 0.008 {hue})" stroke={steel} stroke-width=".8" />
			<rect x="52" y="20" width="96" height="86" rx="3" fill="oklch(0.1 0.004 {hue})" stroke={steel} stroke-width="1" />
			{#each [28, 36, 44, 52, 60, 68, 76, 84, 92] as y, i}
				<rect x="60" y={y} width={[40, 62, 28, 52, 36, 58, 24, 46, 32][i]} height="3" rx="1" fill={light} opacity={i % 2 ? 0.5 : 0.8} />
			{/each}
		</g>
	{:else if scene === 'tray'}
		<rect x="40" y="10" width="120" height="130" rx="6" fill="oklch(0.62 0.006 250)" stroke={light} stroke-width="1.5" />
		<rect x="48" y="18" width="104" height="114" rx="3" fill="oklch(0.5 0.006 250)" />
		<rect x="78" y="30" width="44" height="74" rx="6" fill="oklch(0.12 0.005 {hue})" transform="rotate(8 100 67)" />
		<rect x="83" y="36" width="34" height="62" rx="2" fill={mid} transform="rotate(8 100 67)" />
		<path d="M56 112 h22 a5 5 0 0 1 0 10 h-18" fill="none" stroke={light} stroke-width="1.4" />
		<rect x="118" y="108" width="28" height="12" rx="3" fill="oklch(0.5 0.07 250)" transform="rotate(-10 132 114)" />
	{:else}
		<rect x="0" y="22" width="200" height="106" fill="oklch(0.1 0.004 {hue})" />
		{#each [8, 56, 104, 152] as x, i}
			<rect x={x} y="34" width="40" height="82" rx="2" fill={i % 2 ? mid : 'oklch(0.52 0.016 {hue})'} />
		{/each}
		{#each Array.from({ length: 20 }, (_, i) => i * 10 + 3) as x}
			<rect x={x} y="25" width="5" height="5" rx="1" fill={light} opacity=".7" />
			<rect x={x} y="120" width="5" height="5" rx="1" fill={light} opacity=".7" />
		{/each}
	{/if}
</svg>
