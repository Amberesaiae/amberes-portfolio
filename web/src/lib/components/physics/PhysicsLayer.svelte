<script lang="ts">
	import type { Snippet } from 'svelte';
	import { physics } from '#lib/physics/action.js';
	import type { PhysicsControls } from '#lib/physics/controls.js';
	import type { PhysicsMode, PhysicsOptions } from '#lib/physics/types.js';

	interface Props extends Omit<PhysicsOptions, 'onModeChange'> {
		/** Store from createPhysicsControls(); drive gravity/scatter/restore from outside. */
		controls?: PhysicsControls;
		onmodechange?: (mode: PhysicsMode) => void;
		class?: string;
		children?: Snippet;
	}

	let { controls, onmodechange, class: className = '', children, ...options }: Props = $props();
</script>

<div
	class="relative {className}"
	use:physics={{ controls, onModeChange: onmodechange, ...options }}
>
	{@render children?.()}
</div>
