# PIXEL-1: first real pixel diff (baseline)

Branch `pixel-fidelity` (from `svelte-rebuild` 77794d2). Harness: `web/scripts/pixel/` (`capture.mjs`, `diff.mjs`, `compare-dom.mjs`, `intro-rects.mjs`; `npm i` inside that folder for pixelmatch + pngjs). Evidence at 1x in `docs/amber-studio/pixel/`. Raw captures go to `web/pixel-out/` (not committed).

## 0. Blocker the head must know first: the Playground is not capturable

- **`roydenso.com` today is NOT the "Royden's Playground" site.** It is a newer Next.js site ("Royden So | Product and Brand Designer", PP Neue York fonts, `/index`, `/about`; `/play` redirects to `/index?tab=inklings`, `/playground` is 404). The collage board we have been matching no longer exists live.
- **The archived version is unreachable.** `web.archive.org` returns proxy 403 (host not allowlisted). I asked for it via `update_environment`; the environments service rejected the change. To pixel-diff the board, the user must allow `web.archive.org` (and then the capture script takes `--url`), or drop reference PNGs (1440x900 and 390x844, scroll 0/900/1800/2700 + full) into `web/pixel-out/playground/` named like ours (`page-1440-scroll0.png`, ...) and run `node scripts/pixel/diff.mjs --a pixel-out/playground`.
- Consequence: **no real pixel baseline exists for the board / physics / dock.** The only real-site pixels I can get are (a) the **live intro film** (the "hands holding a printed card" sequence is still live, same assets as `reference/roydenso-intro`) and (b) the live header/type system. The numbers below are real, but the page-level mismatch against the live home is **not a fidelity measure of the board**: the content differs by design. Earlier "measured numbers" (house 206/250, 358 squares, etc.) remain the only board spec, and were never verified against pixels.

## 1. Method

- Chromium 1243 (preinstalled), DPR 1, 1440x900 and 390x844, reduced motion off, seeded `Math.random`, fixed `Date`, local run on `vite dev` with `MOCKS_OK=1` sync scripts, session gate `amber-intro-seen=1` for settled shots.
- Intro frames via CDP screencast (real frame timestamps, t=0 is the first painted frame), nearest frame at or before each 250 ms mark, 0 to 5 s (spec asked 3 s; our film runs longer).
- Diff: pixelmatch threshold 0.1, no AA. Regions: header band (72 px / 64 px) + 3x3 grid of the rest. Full-page shots compare the common top part (heights differ).

## 2. Overall numbers (target = live roydenso.com, ours = local)

| Set | Mismatch |
| --- | --- |
| Intro frames 1440, mean of 21 (0 to 5 s) | see table below; hold-frame match **25.6 to 25.9%** at best |
| Intro frames mean, both viewports | **58.3%** |
| Settled pages, mean of 10 shots (not meaningful for board, see 0) | **77.5%** |
| page 1440 scroll 0 / 900 / 1800 / 2700 / full | 85.2 / 89.9 / 67.0 / 58.7 / 71.5 % |
| page 390 scroll 0 / 900 / 1800 / 2700 / full | 84.3 / 80.4 / 85.2 / 72.0 / 80.5 % |

Intro 1440 per frame (ms: %): 1250: 25.6, 1500: 25.6, 1750: 25.8, 2000: 51.5, 2250: 55.7, 2500: 57.3, 2750: 56.0, 3000: 55.5, 3250: 56.6, 3500: 36.3, 3750: 31.6, 4000: 25.9, 4250+: 85 to 88 (ours is the board, live is the held hero). 500/750 ms are 100% (live already painted, ours blank). Full table: `pixel/results-baseline.json`. The ~25.6% floor even when both show "hands + card" is the card artwork (our mock card differs from live Phia card), the title typography, and header.

Evidence: `pixel/sbs-intro-1440-1250.jpg`, `-2250`, `-3500` (target | ours | diff), `pixel/sbs-page-1440-scroll0.jpg`, `-scroll1800`, `pixel/sbs-page-390-scroll0.jpg`, `pixel/sbs-intro-390-2250.jpg`.

## 3. DOM measurement table (live vs ours, from `compare-dom.mjs`)

| viewport | measure | live | ours |
| --- | --- | --- | --- |
| 1440 | body font | PP Neue York Normal / Narrow (display) | Geist Variable |
| 1440 | body bg / colour | rgb(8,12,13) / #fff (dark) | oklch(.93 0 0) / oklch(.15 0 0) (light) |
| 1440 | header | fixed, 48px tall, 11px/16px, ls 0.1px (brand) and 0.45px (nav), items at x=222.5 (inner 980 wide), y=16, nav centred | 12px/16px, ls 2.16px, first item x=36, y=28.8, not a fixed bar |
| 1440 | display heading | 40px/48px, weight 400, Narrow, ls normal | 57.6px/60.48px, weight 500, ls -1.44px |
| 1440 | doc height | 5364 | 4245 |
| 390 | header | brand x=16,y=16, 11px | x=16,y=32, 12px, ls 2.16px |
| 390 | display heading | 32px/39px, wt 400 | 36px/37.8px, wt 500, ls -0.9px |
| 390 | doc height | 6358 | 5951 |

Local board geometry at 1440 (from `intro-rects`, after intro): hero 675x391 at (383,289); 12 squares 358x358 at x=171/541/911, rows at y=2360/2730/3100/3470 (pitch 370); houses 207..260 wide, portraits 161..178 wide at scattered x (22..1205). **At 390 the "square" tiles are not square: 358x358, 358x448, 358x286 repeating** (heights 448 and 286 come from the media aspect, e.g. square-02 at y=1043). That contradicts the "358 squares" spec on mobile.

## 4. Punch list (owner in brackets; deltas are live minus ours)

Intro (live hero film, the one verifiable reference):
1. **[intro]** Timeline: live paints at ~0.67 s, hands+card hold by ~1.25 s and stays; reveal done at ~2.2 s. Ours: nothing at 0.5 s and 0.75 s (100% mismatch frames), first piece visible ~0.46 s on 1440 but the hold/hands frame arrives at ~3.5 to 4.0 s and the board only after ~4.2 s. Target total <= 2.5 s, not 4.0 s.
2. **[intro]** Live hold composition at 1440: card (phia-v2) rect x=420,y=249,w=585,h=395 (centre 712.5,446.5); hands base 1527x1098 at (-52,-107); left hand 872x914 at (-94,250); right hand 1041x976 at (601,187). Ours has no hands in frames 1250 to 3000 (large blurred scattered prints instead: frame 2000 is a ~600px blurred print). Drop the pre-hand pieces scene or compress it under 1.2 s; blur must be <= 0 by the hold.
3. **[intro]** Title in the hold frame: "Product and Brand Designer" typed centred at y=207, 22px/27px PP Neue York Narrow wt 500, white, sits 17px above the card top. Ours has no title in the film.
4. **[intro]** 390: live card 345x233 at (15,304); hands base 611x861 at (-136,-10); left hand 358x506 at (-189,380); right hand 568x490 at (144,57). Ours at 390 shows frame 2750+ at 80 to 86% mismatch (printed pieces/board). Same work as 1 to 3.
5. **[intro]** "Click or press any key to skip" hint shows in ours at the bottom (y~890/900) during the film; live has no hint in frame.

Typography + layout (owner me, fixing next):
6. **[typography+layout]** Header: live is a fixed 48px bar, text 11px/16px, nav ls 0.45px, brand ls 0.1px, content column 980 wide centred (x=222.5 to 1202.5). Ours is 12px, ls 2.16px (uppercase tracking), in-flow, x=36, y=28.8. For Amber the brand stays, but sizes should move to 11px/16px and the bar to a fixed 48px with a 980-wide inner column.
7. **[typography+layout]** Heading scale: live display 40px/48px wt 400 (desktop), 32px/39px (mobile); ours 57.6/60.48 wt 500 (desktop), 36/37.8 (mobile). Delta -17.6px / -12.48px line height desktop, -4px / +1.2px mobile. Pending PP Neue Montreal; Geist stand-in is wider than PP Neue York Narrow, so target the line-height and weight first.
8. **[typography+layout]** Page ground: live is dark (rgb 8,12,13) with white text; ours is light grey oklch(.93). This is a deliberate Amber art-direction decision (desk photograph), so I will NOT change it; flagged for head.

Board (no live pixel target, only measured spec):
9. **[board]** Mobile tiles: heights 358/448/286/448... must all be 358 (square) per spec; aspect leaks from `<img>` natural ratio. Add `aspect-ratio:1;object-fit:cover` on the tile media (`web/src/lib/components/board/WorkCard.svelte` / `MockMedia.svelte`).
10. **[board]** Doc height 4245 (desk) vs live 5364; only meaningful once a Playground reference exists (section 0).
11. **[board]** Hero at 1440 is 675x391 at (383,289): matches spec 665 x 16:9 only approximately (665x374 expected, we render 675x391 = 1.73 ratio, 10px wide, 17px tall). Set width 665 and aspect 16/9.

Dock / physics: no pixel reference available; not scored here.

## 5. Honest read of the earlier scores

The 9/10 "fidelity" scores were numeric spec checks. Against the only live reference that still exists, the intro frames mismatch 25.6% at best and 55% mid-film, with a 1.5 to 2x longer timeline and a completely different sequence (no hands until ~3.5 s). The board has never been compared to pixels; that needs the archive or screenshots (section 0).

## 6. Iteration log

- **Round 1** baseline: intro mean 58.3%, pages mean 77.5%.
- **Round 2** (merged `origin/svelte-rebuild` a19f625, which brought a new intro: <=3.0s hands, halved smear; plus `-webkit-font-smoothing: antialiased` + `text-rendering: optimizeLegibility` on `body` in `layout.css`, matching live `html.antialiased`): intro mean **63.4%**, pages mean **76.5%**. Intro 1440: 1250 ms 28.6%, 2250 ms 28.0%, 3000 ms 60.3%, 3500 ms 58.6%. Pages 1440 scroll0 82.7%, 390 scroll0 84.6%. The intro mean rose because the new film has hands/card at different times than live (the mean is time-misaligned), not because it got visibly worse; the smoothing change is worth about -1 point on pages. These two changes are confounded, I did not isolate them.
- **Not merged:** `origin/intro-film` (c3841eb, "real preview photographs, paper tooth and dust video") conflicts with svelte-rebuild in `IntroCut/IntroDust/IntroFilm/IntroPiece.svelte` and `scripts/sync-mock-icons.mjs`. Needs the intro owner/head to resolve; I do not touch those files.
- **Why no more typography changes:** items 6 and 7 (header 11px/16px/fixed 48px bar, heading 40/48 wt 400) live in `BoardHeader.svelte`, which is board-owned, and item 8 (dark vs light ground) is an art-direction decision. Re-routed to **[board]**: header and h1 sizes per section 4 items 6 and 7. Nothing else in `layout.css` / `+layout.svelte` differs measurably from the live type system, and PP Neue York/Montreal is not loadable (commercial), so font-family deltas cannot be closed.
