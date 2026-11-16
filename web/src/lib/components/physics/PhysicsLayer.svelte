<script lang="ts">
	import type { Snippet } from 'svelte';
	import { physics } from '#lib/physics/action.js';
	import type { PhysicsControls } from '#lib/physics/controls.js';
	import type { PhysicsMode, PhysicsOptions } from '#lib/physics/types.js';

	interface Props extends Omit<PhysicsOptions, 'onModeChange'> {
		/** Store from createPhysicsControls(); drive gravity/scatter/restore from outside. */
		controls?: PhysicsControls;
		/** Draw a hairline floor while physics is active. */
		showFloor?: boolean;
		onmodechange?: (mode: PhysicsMode) => void;
		class?: string;
		children?: Snippet;
	}

	let {
		controls,
		onmodechange,
		showFloor = true,
		class: className = '',
		children,
		...options
	}: Props = $props();
	let active = $state(false);
	const onMode = (m: PhysicsMode) => {
		active = m !== 'idle';
		onmodechange?.(m);
	};
</script>

<div
	class="relative {className}"
	use:physics={{ controls, onModeChange: onMode, ...options }}
>
	{@render children?.()}
	{#if showFloor && active}
		<div aria-hidden="true" class="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-current opacity-25"></div>
	{/if}
</div>
