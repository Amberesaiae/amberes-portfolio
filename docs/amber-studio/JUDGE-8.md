# JUDGE-8 (mocks-on fidelity + clean production check)

Subject: `origin/svelte-rebuild` @ `1123a91` (dev-only roydenso mock media on board + intro, dock icons). Two modes judged:
- **Mocks on:** `MOCKS_OK=1 node scripts/sync-mock-icons.mjs` + `scripts/sync-mock-media.mjs` (57 board files + icons, 8.1 MB under `static/_mock`), then `vite dev`. 1440x900 and 390x844, 1x. Screenshots `judge/r8-mock-*.jpg`.
- **Clean prod:** no `static/_mock`, `npm run build`, `vite preview`. Screenshot `judge/r8-prod-clean-1440.jpg`.

## 1. Clean production check (pass)
- `npm run build` exit 0, `postbuild` leak check passes. **0** `.png/.webp/.mp4/*_mock*` files in `.svelte-kit/output`.
- Cold load 1440 and 390: **0 requests** to `_mock`/image/video, 0 failed responses, 0 console errors or warnings, 0 `<img>`/`<video>` in the DOM, JS 163.9 KB raw, CLS 0.000, axe 0 violations, intro removed at **2.66s**, vitest 17/17.
- Only residual `_mock` text in the output: server sourcemaps `server/entries/pages/_page.svelte.js.map` and `_layout.svelte.js.map` (not browser-served; `postbuild` scans js/html/css only, so extend it to `*.map`).
- **Repo note (needs a human decision):** `reference/roydenso-playground` (5.9 MB, ATTRIBUTION says "None of these files ship… not to a staging URL anyone can reach, not to a preview link") and `reference/roydenso-intro` (8 MB) and `reference/roydenso-dock` are **tracked in git** (153 files under `reference/`). They are not in any build output, but they sit in a pushed branch. If this repo is, or becomes, public or is attached to a preview deploy, that is the exact exposure the attribution forbids. I am flagging, not acting.

## 2. Scorecard (mocks on, dev server; clean-prod numbers in brackets where they differ)

| # | Criterion | R7 | R8 | Evidence |
| --- | --- | --- | --- | --- |
| 1 | Board geometry vs measured numbers | 9 | **9** | Unchanged with media: house 206x148 x11 and 250x180 x12 (1.39), portrait 160x220 x11, hero 665 16:9 at y=289, grid 358.1px squares at x=164.9/535/905, **0 overlaps**, doc 4245px, no overflow at 1440/1024/768/390 |
| 2 | Collage feel | 9 | **9** | Real imagery transforms the page: dense scatter of prints, grain, tilt, contact shadows (`r8-mock-collage-1440.jpg`). Fidelity gaps below |
| 3 | Intro film vs teardown | 9 | **8** (−1) | Mocks add the hands scene: pan → cut → soft hands → sharp hands (`r8-mock-intro-*.jpg`). But total is now **~3.9–4.0s** in dev (play→reveal at 3.0–3.2s, removed ~4.0s) vs the 3.0s budget; clean prod stays 2.66s. Smear frame is unreadable; hands not gripping the card (see §3) |
| 4 | Dock | 9 | **9** | 7 items, uniform plates, no 404s |
| 5 | Physics | 9 | **9** | unchanged; reduced motion verified earlier |
| 6 | Mobile layout | 9 | **9** | 390: scrollWidth 390, CLS 0, hero card, tile imagery fills square tiles, 4 targets <44px in scan under mocks (was 0): re-check which |
| 7 | Typography / spacing | 9 | **9** | unchanged |
| 8 | Motion / reduced motion | 9 | **9** | Reduced motion: no film, board videos `paused: true` (verified), no animations |
| 9 | Accessibility | 9 | **8** (−1) | axe 0, but **text-over-image contrast** fails visually with real imagery: hero caption "NOW BUILDING / Glean…" white on mid-grey SHAZOOM poster (~2.5:1), "PILOT / Jingo / FarmLink" sits on top of busy poster text (`r8-mock-grid-1440.jpg`), NeedBe tile eyebrow over line-art. Real photographs will behave the same |
| 10 | Performance | 9 | **9** (clean prod) | Prod clean: 163.9 KB JS, 0 images, CLS 0. With mocks (dev only, not scored): 54 images (42 loaded → lazy works), **2 `<video>` elements playing, one of them at 0px width on desktop (the mobile hero's video still plays offscreen)** |
| 11 | Code quality | 9 | **9** | `MockMedia.svelte`, `MockVideo.svelte`, `IntroHands.svelte`, `IntroDust.svelte`: one per file, typed, data in `lib/data`, dev-only gating works |

## 3. Fidelity vs `reference/roydenso-playground` and the intro teardown — what still differs
Board (vs playground):
1. **Labels don't belong to the images.** Cards carry generic labels ("Survey" on a GOGREEN poster, "Clinic" on a SHAZOOM card, "Volunteer" on COACTION). The reference pairs an image with its own title; ours reads as random captions.
2. **Layout is banded, not scattered.** The playground canvas is a free scatter with varied scale; ours is a 5-column grid with ±8° jitter (rows align at fixed baselines, uniform sizes 160/206/250). The measured system is honoured, but the "thrown on a desk" density and size variety of the reference is not.
3. **Hero is a poster + caption, not a living slot.** Reference cycles frames in the held print (teardown §4: 23 frames at 500ms with paper tooth). Ours plays one video poster (SHAZOOM) under "Now building: Glean" (content mismatch).
4. **Work tiles' media is unrelated to the project** (Continuum → giant "R" mark, ContainerClear → red folder). Expected for mocks, but the scrim does not protect text (a11y row).
5. Dock mock tiles use desaturated glyphs on cream; the reference icons are saturated folders/cards. Fine for mocks.

Intro (vs teardown):
6. **Hands are not holding the card.** `r8-mock-intro-hands-1440.jpg`: the swatch card sits top-left while the hands float lower/right, unconnected; the reference composition is two hands gripping a printed card, card centred. Check card/hands anchor offsets in `IntroHands.svelte` / `data/intro.ts`.
7. **Smear is over-driven.** Mid-pan frame (`…smear-1440.jpg`) is blurred beyond legibility (horizontal ~40–60px). Teardown: directional blur is subtle and releases as the print lands.
8. **Duration**: ~4.0s with the hands sequence vs ~2.5–3s target.
9. Handoff stagger (paper +150ms / header +350ms / hands +500ms) is not distinguishable in the final frames; verify transition delays.
10. No `data-reveal=hands` target on the board exists (hero does not hand off from the film's hands).

## 4. Punch list (owners)
1. **[board-mobile]** Text over imagery: add a bottom scrim of at least `linear-gradient(transparent, rgba(0,0,0,.72))` covering the text block (hero caption, work tiles) so white text ≥4.5:1 on any photo; move "PILOT/Jingo" block clear of image-embedded text. Acceptance: contrast script samples ≥4.5:1 on all 12 tiles with mocks on.
2. **[board-mobile]** Hero video: do not mount/play the 0px-wide desktop/mobile twin (render one by breakpoint, or `preload=none` + pause when `offsetWidth===0`).
3. **[board-mobile]** Pair label with image (data-driven: `{src, title}` in `data/board.ts`), and vary collage size (add 2 scale tiers beyond 160/206/250 within the measured system) to approach the playground's scatter.
4. **[board-mobile]** Hero content: match caption to media (or label it as a placeholder) and cycle 4–6 frames at 500ms under reduced-motion-safe rules.
5. **[intro-film]** Anchor hands to the card (card centred between hands at the grip frame), reduce smear radius ~50% and release it before each cut, and bring total ≤3.0s with the hands scene (shorten pan/hold).
6. **[intro-film]** Provide a `data-reveal="hands"` hook and test the 150/350/500ms stagger via computed `transition-delay`.
7. **[head]** Decide on `reference/` being tracked in git (attribution forbids exposure); extend `postbuild` to `*.map`.

## 5. Score history

| Criterion | R1 | R2 | R3 | R4 | R5 | R6 | R7 | R8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Geometry | 8 | 8 | 8 | 9 | 9 | 9 | 9 | 9 |
| Collage | 4 | 4 | 5 | 8 | 8 | 9 | 9 | 9 |
| Intro | 5 | 5 | 7 | 8 | 9 | 9 | 9 | 8 |
| Dock | 6 | 6 | 6 | 8 | 8 | 8 | 9 | 9 |
| Physics | 2 | 6 | 6 | 8 | 9 | 9 | 9 | 9 |
| Mobile | 6 | 6 | 6 | 8 | 9 | 9 | 9 | 9 |
| Typography | 5 | 5 | 6 | 8 | 9 | 9 | 9 | 9 |
| Motion | 7 | 6 | 6 | 8 | 9 | 9 | 9 | 9 |
| Accessibility | 7 | 7 | 7 | 9 | 9 | 9 | 9 | 8 |
| Performance | 8 | 6 | 6 | 9 | 9 | 8 | 9 | 9 |
| Code quality | 8 | 8 | 8 | 8 | 9 | 9 | 9 | 9 |

Mocks-on fidelity scores: board vs playground **7/10**, intro vs teardown **8/10**.
