<script lang="ts">
	import { introHold, introTitle, type HoldHand, type IntroMock } from '#lib/data/intro.js';

	interface Props {
		mock: IntroMock;
		/** Depth of field: 0 = soft15, 1 = soft5, 2 = sharp. */
		stage: 0 | 1 | 2;
		/** Index into the showreel stills shown in the held card. */
		frame: number;
		/** Characters of the title typed so far. */
		typed: number;
		visible: boolean;
		portrait: boolean;
	}

	let { mock, stage, frame, typed, visible, portrait }: Props = $props();

	let vw = $state(1440);
	let vh = $state(900);

	const hold = $derived(portrait ? introHold.mobile : introHold.desktop);
	/** Cover-fit the measured design frame to the viewport (1:1 at the measured viewports). */
	const scale = $derived(Math.max(vw / hold.size[0], vh / hold.size[1]));

	const layers = $derived([
		{ key: 'soft15', on: stage === 0 },
		{ key: 'soft5', on: stage === 1 },
		{ key: 'sharp', on: stage === 2 }
	] as const);

	const handStyle = (h: HoldHand) =>
		`left:${h.cx - h.w / 2}px;top:${h.cy - h.h / 2}px;width:${h.w}px;height:${h.h}px;transform:rotate(${h.rot}deg)${h.flip ? ' scaleX(-1)' : ''}`;
</script>

<svelte:window bind:innerWidth={vw} bind:innerHeight={vh} />

<!-- Hero plate at the live hold-frame geometry: base desk, two hand cut-outs around the held card, typed title. -->
<div class="absolute inset-0 overflow-hidden transition-opacity duration-75 ease-out" class:opacity-0={!visible} data-plate>
	<div
		class="plate absolute"
		style:width="{hold.size[0]}px"
		style:height="{hold.size[1]}px"
		style:transform="translate(-50%, -50%) scale({scale})"
	>
		<img
			class="absolute object-cover"
			style:left="{hold.base.x}px"
			style:top="{hold.base.y}px"
			style:width="{hold.base.w}px"
			style:height="{hold.base.h}px"
			src={mock.base.src}
			srcset={mock.base.srcset}
			sizes="100vw"
			alt=""
			draggable="false"
		/>

		<div
			class="card absolute overflow-hidden bg-[#e9e6df]"
			style:left="{hold.card.x}px"
			style:top="{hold.card.y}px"
			style:width="{hold.card.w}px"
			style:height="{hold.card.h}px"
		>
			{#each mock.reel as src, i (src)}
				<img class="absolute inset-0 size-full object-cover" class:opacity-0={i !== frame % mock.reel.length} {src} alt="" draggable="false" />
			{/each}
			<div class="tooth absolute inset-0" style:background-image="url({mock.tooth})"></div>
		</div>

		{#each [['left', hold.left], ['right', hold.right]] as const as [side, h] (side)}
			{@const set = mock.hands[side]}
			<div class="absolute" style={handStyle(h)}>
				{#each layers as l (l.key)}
					<img
						class="absolute inset-0 size-full transition-opacity duration-100"
						class:opacity-0={!l.on}
						src={l.key === 'soft15' ? set.soft15 : l.key === 'soft5' ? set.soft5 : undefined}
						srcset={l.key === 'sharp' ? set.srcset : undefined}
						sizes="{Math.round(h.w * scale)}px"
						alt=""
						draggable="false"
					/>
				{/each}
			</div>
		{/each}

		<p
			class="title absolute font-sans text-[22px] leading-[27px] font-medium text-white"
			style:top="{hold.title.top}px"
			style:left="{hold.title.left}px"
			style:width="{hold.title.width}px"
			style:text-align={hold.title.align}
		>
			{introTitle.slice(0, typed)}
		</p>
	</div>
</div>

<style>
	.plate {
		left: 50%;
		top: 50%;
		transform-origin: center;
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
	.title {
		white-space: pre;
		min-height: 27px;
	}
</style>
