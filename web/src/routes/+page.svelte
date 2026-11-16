<script lang="ts">
	import Board from '#lib/components/board/Board.svelte';
	import { studio } from '#lib/data/board.ts';
</script>

<main>
	<Board />
	<section id="about" class="mx-auto max-w-[1440px] px-4 pt-8 pb-8 md:px-[2.5cqw]" aria-labelledby="about-h">
		<h2 id="about-h" class="text-2xl font-medium">About</h2>
		<p class="mt-3 max-w-prose text-muted-foreground">
			We are {studio.name}, a studio of one led by {studio.owner}. {studio.intro}
		</p>
	</section>
	<section id="contact" class="mx-auto max-w-[1440px] px-4 pb-40 md:px-[2.5cqw]" aria-labelledby="contact-h">
		<h2 id="contact-h" class="text-2xl font-medium">Talk to us</h2>
		<p class="mt-3 max-w-prose text-muted-foreground">Tell us the problem. We will tell you honestly if we are the right fit.</p>
	</section>
</main>
