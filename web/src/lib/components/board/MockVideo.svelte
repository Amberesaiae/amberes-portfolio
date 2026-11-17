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

	// Play only while the element is actually rendered (a display:none twin never intersects)
	// and motion is allowed; otherwise stay paused. preload="none" keeps the hidden twin idle.
	$effect(() => {
		if (!video) return;
		const el = video;
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		let visible = false;
		const sync = () => {
			if (visible && !mq.matches) el.play().catch(() => {});
			else el.pause();
		};
		const io = new IntersectionObserver((entries) => {
			visible = entries.some((e) => e.isIntersecting && el.offsetWidth > 0);
			sync();
		});
		io.observe(el);
		mq.addEventListener('change', sync);
		return () => {
			io.disconnect();
			mq.removeEventListener('change', sync);
		};
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
		preload="none"
		aria-hidden="true"
		tabindex="-1"
		class="absolute inset-0 h-full w-full object-cover"
		onerror={() => (failed = true)}
	></video>
{/if}
