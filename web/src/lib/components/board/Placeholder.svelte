<script lang="ts">
	import type { Art, Tone } from '#lib/data/board.ts';

	interface Props {
		art: Art;
		tone?: Tone;
		class?: string;
	}
	let { art, tone = 'paper', class: className = '' }: Props = $props();

	const fills: Record<Tone, { bg: string; fg: string }> = {
		paper: { bg: '#f6f5f4', fg: '#c9c6c3' },
		stone: { bg: '#e3e0dd', fg: '#a9a5a1' },
		ash: { bg: '#cfcdcb', fg: '#8d8985' },
		ink: { bg: '#25231f', fg: '#5c5851' },
		amber: { bg: '#e8b25a', fg: '#b5812b' }
	};
	const c = $derived(fills[tone]);
</script>

<svg class={className} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
	<rect width="100" height="100" fill={c.bg} />
	<g fill="none" stroke={c.fg} stroke-width="3" stroke-linecap="round">
		{#if art === 'rings'}
			<circle cx="50" cy="50" r="12" /><circle cx="50" cy="50" r="26" /><circle cx="50" cy="50" r="42" />
		{:else if art === 'bars'}
			{#each [16, 30, 44, 58, 72, 86] as x, i (x)}<line x1={x} y1={90} x2={x} y2={80 - ((i * 23) % 50)} />{/each}
		{:else if art === 'dots'}
			{#each [20, 40, 60, 80] as x (x)}{#each [20, 40, 60, 80] as y (y)}<circle cx={x} cy={y} r="3" fill={c.fg} />{/each}{/each}
		{:else if art === 'diag'}
			{#each [-40, -20, 0, 20, 40, 60, 80, 100] as o (o)}<line x1={o} y1="100" x2={o + 60} y2="0" />{/each}
		{:else if art === 'grid'}
			<path d="M25 10V90M50 10V90M75 10V90M10 25H90M10 50H90M10 75H90" />
		{:else if art === 'arc'}
			<path d="M10 80A40 40 0 0 1 90 80" /><path d="M24 80A26 26 0 0 1 76 80" /><path d="M38 80A12 12 0 0 1 62 80" />
		{:else if art === 'cross'}
			<path d="M20 20L80 80M80 20L20 80" />
		{:else}
			<path d="M0 35Q25 15 50 35T100 35M0 55Q25 35 50 55T100 55M0 75Q25 55 50 75T100 75" />
		{/if}
	</g>
</svg>
