<script lang="ts">
	interface Props {
		/** Bound to the blur primitive so the film can drive stdDeviation per frame. */
		blur?: SVGFEGaussianBlurElement | null;
	}

	let { blur = $bindable(null) }: Props = $props();
</script>

<svg width="0" height="0" class="absolute" aria-hidden="true" focusable="false">
	<defs>
		<filter id="intro-smear" x="-10%" y="-10%" width="120%" height="120%">
			<feGaussianBlur bind:this={blur} in="SourceGraphic" stdDeviation="0 0" />
		</filter>
	</defs>
</svg>
