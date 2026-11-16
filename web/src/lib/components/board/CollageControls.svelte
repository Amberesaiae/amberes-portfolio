<script lang="ts">
	import { announce } from '#lib/a11y/index.ts';
	import type { PhysicsControls } from '#lib/physics/controls.js';

	interface Props { controls: PhysicsControls }
	let { controls }: Props = $props();

	const labels = { idle: 'Cards at rest', gravity: 'Gravity on', scatter: 'Cards scattered', returning: 'Resetting cards' } as const;

	function run(action: () => void, message: string) {
		action();
		announce(message, 'polite');
	}
</script>

<div class="hidden items-center gap-2 px-[2.5cqw] pb-[2cqw] md:flex" role="group" aria-label="Collage physics">
	<button type="button" class="rounded-full border bg-card px-4 py-1.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" aria-pressed={$controls.mode === 'gravity'} onclick={() => run(controls.toggleGravity, $controls.mode === 'gravity' ? 'Resetting cards' : 'Gravity on')}>Gravity</button>
	<button type="button" class="rounded-full border bg-card px-4 py-1.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" onclick={() => run(controls.scatter, 'Cards scattered')}>Scatter</button>
	<button type="button" class="rounded-full border bg-card px-4 py-1.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" onclick={() => run(controls.restore, 'Cards reset')}>Reset</button>
	<span class="text-sm text-muted-foreground" data-testid="physics-state">{labels[$controls.mode]}{$controls.reduced ? ' (instant, reduced motion)' : ''}</span>
</div>
