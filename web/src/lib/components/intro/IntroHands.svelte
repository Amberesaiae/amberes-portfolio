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

	<!-- Everything is sized from the card (--w) so the hands always grip its edges, at any viewport. -->
	<div class="stage">
		<div class="card absolute inset-0 overflow-hidden bg-[#e9e6df]">
			{#each mock.reel as src, i (src)}
				<img class="absolute inset-0 size-full object-cover" class:opacity-0={i !== frame % mock.reel.length} {src} alt="" draggable="false" />
			{/each}
			<div class="tooth absolute inset-0" style:background-image="url({mock.tooth})"></div>
		</div>

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
	</div>
</div>

<style>
	.stage {
		--w: min(46vw, 620px, 62vh);
		position: absolute;
		left: 50%;
		top: 46%;
		width: var(--w);
		aspect-ratio: 4 / 3;
		transform: translate(-50%, -50%) rotate(-1.5deg);
	}
	.card {
		box-shadow: 0 18px 40px rgb(0 0 0 / 0.55), 0 2px 6px rgb(0 0 0 / 0.5);
		isolation: isolate;
	}
	.tooth {
		mix-blend-mode: hard-light;
		opacity: 0.22;
		background-size: cover;
	}
	/* Hands are drawn over the card: fingertips overlap its edge (the grip). Fingers sit ~25% down each cut-out. */
	.hand {
		position: absolute;
		top: 32%;
		width: calc(var(--w) * 0.95);
		aspect-ratio: 1.64;
		transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
	}
	.hand-left {
		right: 78%;
		transform: translateX(-10%) scaleX(-1);
	}
	.hand-right {
		left: 78%;
		transform: translateX(10%);
	}
	.hand-left.settled {
		transform: translateX(0) scaleX(-1);
	}
	.hand-right.settled {
		transform: translateX(0);
	}
	@media (max-aspect-ratio: 1/1) {
		.stage {
			--w: 74vw;
			top: 42%;
		}
		.hand {
			width: calc(var(--w) * 0.9);
		}
	}
</style>
