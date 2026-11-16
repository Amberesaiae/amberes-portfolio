<script lang="ts">
	import type { IntroMock } from '#lib/data/intro.js';

	interface Props {
		mock: IntroMock;
		/** Depth of field: 0 = soft15, 1 = soft5, 2 = sharp. */
		stage: 0 | 1 | 2;
		/** Index into the showreel stills shown in the held card. */
		frame: number;
		visible: boolean;
	}

	let { mock, stage, frame, visible }: Props = $props();

	const layers = $derived([
		{ key: 'soft15', on: stage === 0 },
		{ key: 'soft5', on: stage === 1 },
		{ key: 'sharp', on: stage === 2 }
	] as const);
</script>

<!-- Hero plate: base desk + two hand cut-outs around an empty slot holding the showreel print. -->
<div class="absolute inset-0 transition-opacity duration-75 ease-out" class:opacity-0={!visible} data-plate>
	<img
		class="absolute inset-0 size-full object-cover"
		src={mock.base.src}
		srcset={mock.base.srcset}
		sizes="100vw"
		alt=""
		draggable="false"
	/>

	{#each ['left', 'right'] as const as side (side)}
		{@const set = mock.hands[side]}
		<div class="hand hand-{side}" class:settled={stage === 2}>
			{#each layers as l (l.key)}
				<img
					class="absolute inset-0 size-full transition-opacity duration-100"
					class:opacity-0={!l.on}
					src={l.key === 'soft15' ? set.soft15 : l.key === 'soft5' ? set.soft5 : undefined}
					srcset={l.key === 'sharp' ? set.srcset : undefined}
					sizes="(max-aspect-ratio: 1/1) 60vw, 38vw"
					alt=""
					draggable="false"
				/>
			{/each}
		</div>
	{/each}

	<div class="card absolute overflow-hidden bg-[#e9e6df]">
		{#each mock.reel as src, i (src)}
			<img class="absolute inset-0 size-full object-cover" class:opacity-0={i !== frame % mock.reel.length} {src} alt="" draggable="false" />
		{/each}
		<div class="tooth absolute inset-0" style:background-image="url({mock.tooth})"></div>
	</div>
</div>

<style>
	.card {
		left: 50%;
		top: 44%;
		width: min(46vw, 620px);
		aspect-ratio: 4 / 3;
		transform: translate(-50%, -50%) rotate(-1.5deg);
		box-shadow: 0 18px 40px rgb(0 0 0 / 0.55), 0 2px 6px rgb(0 0 0 / 0.5);
		isolation: isolate;
	}
	.tooth {
		mix-blend-mode: hard-light;
		opacity: 0.22;
		background-size: cover;
	}
	.hand {
		position: absolute;
		top: 46%;
		width: 44vw;
		aspect-ratio: 1.64;
		transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
	}
	.hand-left {
		left: -2%;
		transform: translateX(-12%) scaleX(-1);
	}
	.hand-right {
		right: -2%;
		transform: translateX(12%);
	}
	.hand-left.settled {
		transform: translateX(0) scaleX(-1);
	}
	.hand-right.settled {
		transform: translateX(0);
	}
	@media (max-aspect-ratio: 1/1) {
		.card {
			width: 74vw;
			top: 40%;
		}
		.hand {
			width: 62vw;
			top: 46%;
		}
		.hand-left {
			left: -8%;
		}
		.hand-right {
			right: -8%;
		}
	}
</style>
