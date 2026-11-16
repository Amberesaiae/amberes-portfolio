<script lang="ts">
	interface Props {
		/** Fades the hint out once the hand-off starts. */
		visible: boolean;
	}

	let { visible }: Props = $props();
</script>

<!-- Outside the aria-hidden film so assistive tech can announce it. -->
<p
	role="status"
	aria-live="polite"
	class="intro-hint pointer-events-none fixed inset-x-0 bottom-8 z-[101] text-center font-sans text-sm tracking-wide text-white/75 transition-opacity duration-300"
	class:opacity-0={!visible}
>
	Click or press any key to skip
</p>

<style>
	.intro-hint {
		animation: intro-hint-in 0.4s ease-out 0.4s both;
	}
	@keyframes intro-hint-in {
		from {
			opacity: 0;
		}
	}
</style>
