<script lang="ts">
	/**
	 * Dev-only temporary hero video: muted, looping, inline; poster as fallback and paused
	 * (poster only) under prefers-reduced-motion. Renders nothing without `src`.
	 */
	interface Props {
		src?: string;
		poster?: string;
	}
	let { src, poster }: Props = $props();
	let failed = $state(false);
	let video: HTMLVideoElement | undefined = $state();

	$effect(() => {
		if (!video) return;
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		const sync = () => {
			if (mq.matches) video?.pause();
			else video?.play().catch(() => {});
		};
		sync();
		mq.addEventListener('change', sync);
		return () => mq.removeEventListener('change', sync);
	});
</script>

{#if src && !failed}
	<video
		bind:this={video}
		{src}
		{poster}
		muted
		loop
		playsinline
		preload="metadata"
		aria-hidden="true"
		tabindex="-1"
		class="absolute inset-0 h-full w-full object-cover"
		onerror={() => (failed = true)}
	></video>
{/if}
