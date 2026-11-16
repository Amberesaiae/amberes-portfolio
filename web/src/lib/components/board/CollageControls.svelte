<script lang="ts">
	import { announce } from '#lib/a11y/index.ts';
	import type { PhysicsControls } from '#lib/physics/controls.js';
	import PillButton from './PillButton.svelte';

	interface Props { controls: PhysicsControls }
	let { controls }: Props = $props();

	const labels = { idle: 'Cards at rest', gravity: 'Gravity on', scatter: 'Cards scattered', returning: 'Resetting cards' } as const;

	function run(action: () => void, message: string) {
		action();
		announce(message, 'polite');
	}
</script>

<div class="hidden flex-wrap items-center gap-2 md:flex" role="group" aria-label="Collage physics">
	<PillButton pressed={$controls.mode === 'gravity'} onclick={() => run(controls.toggleGravity, $controls.mode === 'gravity' ? 'Resetting cards' : 'Gravity on')}>Gravity</PillButton>
	<PillButton onclick={() => run(controls.scatter, 'Cards scattered')}>Scatter</PillButton>
	<PillButton onclick={() => run(controls.restore, 'Cards reset')}>Reset</PillButton>
	<span class="text-sm text-muted-foreground" data-testid="physics-state">{labels[$controls.mode]}{$controls.reduced ? ' (instant, reduced motion)' : ''}</span>
</div>
