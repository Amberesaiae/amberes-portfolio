<script lang="ts">
	import Briefcase from '@lucide/svelte/icons/briefcase';
	import User from '@lucide/svelte/icons/user';
	import Phone from '@lucide/svelte/icons/phone';
	import Terminal from '@lucide/svelte/icons/terminal';
	import Film from '@lucide/svelte/icons/film';
	import Dice5 from '@lucide/svelte/icons/dice-5';
	import Archive from '@lucide/svelte/icons/archive';
	import Ellipsis from '@lucide/svelte/icons/ellipsis';
	import type { DockIconKey } from '#lib/data/dock.ts';

	let { icon, class: className = '' }: { icon: DockIconKey | 'more'; class?: string } = $props();

	const map = {
		work: Briefcase,
		about: User,
		talk: Phone,
		terminal: Terminal,
		reel: Film,
		games: Dice5,
		archive: Archive,
		more: Ellipsis
	};
	const Icon = $derived(map[icon]);
</script>

<Icon class={className} aria-hidden="true" strokeWidth={1.75} />
