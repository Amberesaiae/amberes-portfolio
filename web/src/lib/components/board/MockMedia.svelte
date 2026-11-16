<script lang="ts">
	/**
	 * Dev-only temporary mock image laid over a neutral Placeholder. Renders nothing when
	 * `src` is undefined (always the case in production) and hides itself if the file 404s,
	 * so the placeholder underneath stays as the fallback.
	 */
	interface Props {
		src?: string;
		class?: string;
	}
	let { src, class: className = '' }: Props = $props();
	let failed = $state(false);
</script>

{#if src && !failed}
	<img
		{src}
		alt=""
		loading="lazy"
		decoding="async"
		draggable="false"
		class="absolute inset-0 h-full w-full object-cover {className}"
		onerror={() => (failed = true)}
	/>
{/if}
