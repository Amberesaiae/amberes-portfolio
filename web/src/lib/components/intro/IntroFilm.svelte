<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { introCuts, introMock, introMockUrls, introPieces, introTiming, type IntroMock } from '#lib/data/intro.js';
	import IntroCut from './IntroCut.svelte';
	import IntroHands from './IntroHands.svelte';
	import IntroOverlays from './IntroOverlays.svelte';
	import IntroPiece from './IntroPiece.svelte';
	import IntroSkipHint from './IntroSkipHint.svelte';
	import IntroSmearFilter from './IntroSmearFilter.svelte';

	interface Props {
		/** `play` while the film runs, `reveal` while it fades out. */
		phase: 'play' | 'reveal';
		/** Called once when the timeline completes on its own. */
		onfinish: () => void;
	}

	let { phase, onfinish }: Props = $props();

	let board: HTMLDivElement | undefined = $state();
	let blur: SVGFEGaussianBlurElement | null = $state(null);
	let cutIndex = $state(-1);
	let veil = $state(false);
	let portrait = $state(false);
	/** Dev-only mock media, set once every file has loaded; otherwise the SVG/CSS stand-ins draw. */
	let mock: IntroMock | undefined = $state();
	let dustVideo: HTMLVideoElement | undefined = $state();
	/** False while dev mock media is still loading: only the ground shows (no stand-in flash). */
	let ready = $state(!introMock);
	let handsOn = $state(false);
	let handStage = $state<0 | 1 | 2>(0);
	let reelFrame = $state(0);

	/** Resolves true when every mock file loads (images decoded, dust video ready) within the cap. */
	let released = false;
	let releaseVideo = () => {};
	function preload(m: IntroMock): Promise<boolean> {
		const imgs = introMockUrls(m).map(
			(src) =>
				new Promise<boolean>((ok) => {
					const img = new Image();
					img.onload = () => ok(true);
					img.onerror = () => ok(false);
					img.src = src;
				})
		);
		// The dust video is a nice-to-have: it never blocks (or fails) the preload; pieces fall back to the CSS dust tile.
		const v = document.createElement('video');
		v.muted = true;
		v.loop = true;
		v.playsInline = true;
		v.preload = 'auto';
		v.oncanplay = () => {
			if (released) return;
			dustVideo = v;
			v.play().catch(() => {});
		};
		v.src = m.dust;
		releaseVideo = () => {
			released = true;
			v.pause();
			v.removeAttribute('src');
			v.load();
		};
		let timer: ReturnType<typeof setTimeout>;
		const cap = new Promise<boolean>((ok) => (timer = setTimeout(() => ok(false), 1500)));
		return Promise.race([Promise.all(imgs).then((r) => r.every(Boolean)), cap]).finally(() => clearTimeout(timer));
	}

	/** Camera waypoints: centre of each piece on the virtual board. */
	const waypoints = introPieces.map((p) => ({
		x: p.at[0] + p.w / 2,
		y: p.at[1] + (p.w * p.size[1]) / p.size[0] / 2
	}));

	const easeInOut = (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

	function camera(progress: number): { x: number; y: number } {
		const segs = waypoints.length - 1;
		const scaled = easeInOut(Math.min(progress, 0.9999)) * segs;
		const i = Math.floor(scaled);
		const t = scaled - i;
		const a = waypoints[i];
		const b = waypoints[i + 1];
		return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
	}

	onMount(() => {
		let cancelled = false;
		let raf = 0;
		const mq = matchMedia('(max-aspect-ratio: 1/1)');
		const syncPortrait = () => (portrait = mq.matches);
		syncPortrait();
		mq.addEventListener('change', syncPortrait);
		const { pan, cutHold, veil: veilMs } = introTiming;
		let veilStart = 0;
		let end = 0;
		let handsStart = 0;
		let start = 0;
		let last = camera(0);
		let lastT = 0;
		let finished = false;

		const place = (c: { x: number; y: number }) => {
			// Fit the virtual board to the viewport: ~1600px of board visible across the width.
			const scale = Math.max(0.5, innerWidth / 1600);
			if (board) {
				board.style.transform = `translate(${innerWidth / 2}px, ${innerHeight / 2}px) scale(${scale}) translate(${-c.x}px, ${-c.y}px)`;
			}
			return scale;
		};
		place(last);

		const frame = (now: number) => {
			if (!start) {
				start = now;
				lastT = now;
			}
			const elapsed = now - start;
			const c = camera(Math.min(elapsed / pan, 1));
			const scale = place(c);
			const dt = Math.max(now - lastT, 1);
			// Directional smear: blur each axis by its own screen-space velocity.
			const vx = (Math.abs(c.x - last.x) * scale) / dt;
			const vy = (Math.abs(c.y - last.y) * scale) / dt;
			// Proportional clamp keeps the smear's direction at peak speed.
			const k = Math.min(1, 22 / Math.max(vx * 9, vy * 9, 0.001));
			blur?.setAttribute('stdDeviation', `${(vx * 9 * k).toFixed(2)} ${(vy * 9 * k).toFixed(2)}`);
			last = c;
			lastT = now;

			cutIndex = elapsed < pan ? -1 : Math.min(Math.floor((elapsed - pan) / cutHold), introCuts.length - 1);
			if (mock) {
				const h = elapsed - handsStart;
				handsOn = h >= 0;
				handStage = h < introTiming.hands * 0.3 ? 0 : h < introTiming.hands * 0.6 ? 1 : 2;
				reelFrame = Math.max(0, Math.floor(h / introTiming.reelStep));
			}
			veil = elapsed >= veilStart;

			if (elapsed >= end) {
				if (!finished) {
					finished = true;
					onfinish();
				}
				return;
			}
			raf = requestAnimationFrame(frame);
		};

		const run = () => {
			// Hands plate only exists with mock media; without it the film is pan + cuts + veil.
			handsStart = pan + cutHold * introCuts.length;
			veilStart = handsStart + (mock ? introTiming.hands : 0);
			end = veilStart + veilMs;
			raf = requestAnimationFrame(frame);
		};
		if (introMock) {
			// Dev with synced mocks: wait for the files (the film clock starts after), else fall back to stand-ins.
			preload(introMock).then(async (ok) => {
				if (cancelled) return;
				mock = ok ? introMock : undefined;
				ready = true;
				await tick();
				if (!cancelled) run();
			});
		} else {
			run();
		}

		return () => {
			cancelled = true;
			cancelAnimationFrame(raf);
			releaseVideo();
			mq.removeEventListener('change', syncPortrait);
		};
	});
</script>

<div
	class="intro-loader fixed inset-0 z-[100] bg-[#0b0b0b] transition-opacity ease-[cubic-bezier(.22,1,.36,1)]"
	style:transition-duration="{introTiming.fade}ms"
	class:opacity-0={phase === 'reveal'}
	class:pointer-events-none={phase === 'reveal'}
	aria-hidden="true"
>
	<div class="intro-film absolute inset-0 overflow-hidden bg-[#0b0b0b] select-none">
		<IntroSmearFilter bind:blur />
		<div bind:this={board} class="absolute top-0 left-0 origin-top-left will-change-transform" style:filter="url(#intro-smear)">
			{#if ready}
				{#each introPieces as piece (piece.id)}
					<IntroPiece {piece} {mock} {dustVideo} />
				{/each}
			{/if}
		</div>
		{#if ready}
			{#each introCuts as cut, i (cut.id)}
				<IntroCut {cut} active={i === cutIndex} {portrait} {mock} />
			{/each}
		{/if}
		{#if mock}
			<IntroHands {mock} stage={handStage} frame={reelFrame} visible={handsOn} />
		{/if}
		<IntroOverlays {veil} />
	</div>
</div>

<IntroSkipHint visible={phase === 'play'} />
