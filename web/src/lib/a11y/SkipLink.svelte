<script lang="ts">
	let { href = '#main', label = 'Skip to main content' }: { href?: string; label?: string } = $props();

	// Move focus explicitly: some browsers only scroll on hash navigation.
	function go(e: MouseEvent) {
		const target = document.querySelector<HTMLElement>(href);
		if (!target) return;
		e.preventDefault();
		target.focus();
		target.scrollIntoView();
	}
</script>

<a class="skip-link" {href} onclick={go}>{label}</a>
