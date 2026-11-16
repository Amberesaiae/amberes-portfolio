# JUDGE-1

Subject: `origin/svelte-rebuild` @ `fe296fd` ("STATUS: round 2 loop"). All five builder branches were already merged at this commit. `npm run check`: 0 errors/0 warnings; `vite build` green. Measured on `vite preview`, Chromium, 1x, 1440x900 and 390x844 (screenshots in `docs/amber-studio/judge/`, jpg q62).

Bar: pixel perfect. Placeholders (CSS art, no photographs) are accepted as mocks per STATUS; they are not scored down except where they hurt collage feel.

## Scorecard

| # | Criterion | Score | One-line reason |
| --- | --- | --- | --- |
| 1 | Board geometry vs measured numbers | **8** | Numbers hit exactly, but the system is incomplete (hero buried, header/menubar missing) |
| 2 | Collage feel | **4** | Random jitter, 11 overlapping pairs, clipped labels, no focal point, hero is 1124px down |
| 3 | Intro film vs teardown | **5** | Mechanics right (gate, skip, stagger); 5.4s vs 2.5–3s, no photographs, no smear/hands, no skip affordance |
| 4 | Dock | **6** | Magnification is good; every item is dead (anchors missing, actions unwired), tooltip text tiny, 2 identical nav names |
| 5 | Physics | **2** | Module exists but is not mounted on the home page; dragging/gravity do nothing |
| 6 | Mobile layout | **6** | No overflow, CLS 0, single column; tiles 358x358 with no rhythm, dock "More" unverified, small targets |
| 7 | Typography / spacing | **5** | Fonts not actually loaded (system fallback), motto in wrong case/hyphenation, tile text low contrast |
| 8 | Motion / reduced motion | **7** | Reduced-motion skips intro, no animations; dock magnification and hover lack reduced-motion proof |
| 9 | Accessibility | **7** | axe: 1 moderate (heading-order); skip link, landmarks fine; dead dock links, unlabeled duplicate navs |
| 10 | Performance | **8** | CLS 0.000, JS 137 KB raw (~45 KB gz est.), 0 images, 15 requests; matter-js not loaded on `/` |
| 11 | Code quality (STATUS rules) | **8** | Clean: one component/file, typed props, data in `lib/data`, no `any`, no mock images shipped |

Not every criterion is 9+. Overall: structurally disciplined, visually a wireframe.

## Evidence

### 1. Board geometry (measured, 1440 wide)
- Collage cards: 250x180 (ratio 1.389) x10, 206x148 (1.392) x13, portrait 160x220 x12, hero 665x374 (16:9 = 374.06) x1. Matches 1.39 / 160x220 / 665 16:9 exactly.
- Work grid: 3 cols of 358.1px squares, column x = 164.9 / 535 / 905 (pitch 370.1 = 25.7%), row pitch 370.5 (358 + 12 gap). Matches.
- Count: 36 collage + 12 grid = 48 as specified.
- Gaps: header has no menubar (HOMEPAGE.md specs a 48px menubar with clock/status) — absent.
- The hero is at y=1124 (right in the middle of the collage, 1.25 screens down). Spec: "a focal point" in the first viewport.

### 2. Collage feel (see `home-1440.jpg`, `mid-1440.jpg`)
- 11 overlapping card pairs (>6px intersection). Many overlaps hide labels ("Field notes", "Ledg…", "Roles" bleed under neighbours). Overlap looks accidental, not scattered-on-a-desk.
- Dark tone cards (`ink`) render the label in near-black on dark ("Schools" is invisible, `mid-1440.jpg`).
- Rotations are uniform noise (±5°), cards have identical soft shadow, no depth ordering/shadow variance, no paper texture. It reads as a random grid, not a photographed desk.
- Hero (the single focal card) sits at the exact horizontal centre with rot 0deg while all others tilt; it is flatter than its neighbours.
- Cards extend under the fixed dock in the first viewport (`home-1440.jpg`, bottom): the first-screen bottom edge is clutter.

### 3. Intro film (timeline at 1440x900, cold)
- `data-intro`: play 0–3.7s, reveal 3.7–5.4s, gone at ~5.4s. Teardown target: ~2.5–3s from first paint to settle. **~2x too long.**
- Gate works: revisit in same session → no film; reduced-motion → no film, page opacity 1. Skip on click/keydown wired. Early-gate script prevents FOUC. 
- Layers visible in `intro-1440.jpg`: coloured gradient plates, grain, vignette. No hands/hero plate, no per-piece paper/dust, no directional smear visible; the plates are purple/teal/brown saturated gradients that contradict the "photograph of a real desk" art direction and look like a generic 2020 landing page.
- No skip hint, no progress; a visitor does not know a click skips it.
- Hand-off stagger exists in CSS (paper 0.15s) but the `site-header` and `hands` stagger could not be verified to differ because `.site-header` and `data-reveal=paper` end up simultaneously opaque (reveal tail 1.7s).

### 4. Dock
- 7 items at 56x56, desktop 500x74 at (470,814): centred, 12px from bottom. Magnification on hover measured: neighbours scale 1.0126 / 1.397 / 1.700 / 1.264 (cursor over item 3); smooth falloff, max 1.7 = spec.
- **Dead items**: hrefs `#work`, `#about`, `#contact` have no matching ids in the DOM (`grep id="work"` = 0). Click does nothing. Terminal/Reel/Games/Archive have no `onaction` handler in `+layout.svelte` (`<Dock />` mounted bare). Four of seven buttons do nothing.
- `active` is never passed, so the active-dot never shows.
- Tooltip "Work" sits above the lifted tile with a ~20px gap (`dock-hover-1440.jpg`); it is small (≈11px text).
- Dock overlaps content permanently with no safe-area padding on the page (`.board` has pb-16 = 64px but dock is 74+12).
- Two `<nav aria-label="Dock">` elements in DOM (desktop + mobile; one is display:none so AT is fine, but duplicate id-less landmarks should be one component with responsive layout).

### 5. Physics
- `PhysicsLayer`/`physics` action are not imported by `+page.svelte`, `Board.svelte`, or the layout. Only `/physics-demo` uses it. Dragging a collage card: card does not move (`drag moved false`). Gravity/scatter trigger does not exist on the homepage. `matter-js` is therefore absent from the home bundle (good for perf, but the feature is not delivered).

### 6. Mobile (390x844, `home-390.jpg`)
- No horizontal overflow (scrollWidth 390), CLS 0, collage `display:none`, work tiles one column 358x358 at x=16. Doc height 4816.
- 7 interactive elements <44x44 CSS px (dock "More" row labels, tile content links).
- Tiles are square 358x358 stacked with 16px gap: monotone, no variation or entrance. 12 identical squares = ~4,300px of scroll before the page ends; no hero card on mobile.
- Mobile dock covers the 2nd tile edge with no gap; first tile's blurb text sits on the gradient scrim with mediocre contrast.

### 7. Typography/spacing
- `--font-sans: Geist, Inter, ui-sans-serif…` but **no font is loaded** (`font` bytes = 0, no @font-face, no <link>). Rendering uses the system sans, so "stand-in" is just whatever the OS has. Headline looks Inter only because this sandbox has it.
- H1 is `studio.motto` = "engineering real world solutions" with CSS `capitalize` → "Engineering Real World Solutions". Brand line is "Engineering real-world solutions." (hyphen, sentence case, full stop) per HOMEPAGE.md/PLAN. Title-casing also capitalises nothing meaningful and breaks the studio voice.
- Header sets `md:text-[4cqw]` (57.6px at 1440) fine, but the body-copy `1.1cqw` = 15.8px at 1440 and 4.3px at … cqw text scales down with the board, e.g. card label `0.7cqw` = **10px at 1440, 7.6px at 1080** — illegible.
- Header text block hugs left (2.5cqw) with the entire right 55% of the header band empty; spec sketches a right-hand status column (clock, "Taking work", Now building).
- Work-tile eyebrow ("LIVE", 11px, white at 70% on grey gradient) fails AA contrast on light-art tiles (`grid-1440.jpg`, TandohStay/Jingo).

### 8. Motion
- Reduced motion: intro skipped, `document.getAnimations().length` = 0. Good.
- Dock magnification uses pointer-based transform; I could not confirm it is disabled under `prefers-reduced-motion`.
- No scroll/entrance motion anywhere on the board; the page is static after the film.

### 9. Accessibility
- axe (@axe-core/playwright, 1440 desktop, intro off): 1 violation, `heading-order` (moderate), 1 node — the tile `h3` jumps from `h1` to `h3`. 
- Landmarks: 1 `main`, 1 `h1`, `lang=en`, title "Amber Studio", skip link first in tab order (works). `#content` has tabindex -1 target. 
- Dock links point at missing ids, so keyboard "Work" activation does nothing: functional a11y failure.
- Work tiles: no link/button — they are non-interactive `div`s. If they are meant to be projects, they are not focusable.

### 10. Performance
- Cold desktop: 15 requests; JS 137 KB raw, CSS 32 KB, images 0, fonts 0, other 78 KB (HTML/payload). CLS 0.000 (desktop and mobile). DOM 751 nodes.
- Largest unused: chunk `CKauFWtN` (83 KB, matter-js) is built but not loaded on `/` because physics is not wired (see 5). Wiring it must be lazy (`import()`).
- No LCP image; the LCP is the H1 text, but the intro overlay blocks it for 5.4s of "play" — time-to-visible-content is poor.

### 11. Code quality (STATUS rules)
- One component per file: ✔ (largest 199 lines `DockDesktop.svelte`).  Typed props via `interface Props`/inline types: ✔. Data in `src/lib/data/`: ✔ (`board.ts`, `dock.ts`, `intro.ts`). No `any`/`@ts-ignore`: ✔. `svelte-check` 0/0.
- Global mutable state: only `intro.ts` module-level `writable` (allowed "Svelte stores"). No module `$state`.
- No mock images shipped: ✔ (`web/static` = `robots.txt` only; zero raster/video tracked under `web/`).
- Flaws: `DockMobile.svelte` has an inline `{#snippet face(...)}` with `Parameters<typeof DockTile>[1]['icon']` typing (fragile); `Intro.svelte` injects the early-gate via `{@html}` into `<head>` (acceptable but note). `dock/index.ts` barrel vs direct imports inconsistent (layout imports `Dock.svelte` directly).

## Punch list (exact fixes, owner tag)

1. **[board-mobile]** Replace the random `buildCollage()` jitter with a hand-authored, non-overlapping layout list in `data/board.ts` (or enforce >=12px clearance in the generator and reject clashes against every placed card, not only the hero). Target: 0 overlapping pairs at 1440.
2. **[board-mobile]** Move the hero (665x374) into the first viewport: `y ≤ 520` at 1440 so it sits under the header, and give it a 1–2° rotation + stronger shadow so it reads as the focal card.
3. **[board-mobile]** Label contrast on `ink`/`amber` cards: use `text-white` on `ink` (`CollageCard`/`Placeholder` tone → label colour map). "Schools" is invisible today.
4. **[board-mobile]** Card label `text-[0.7cqw]` → `clamp(11px, 0.7cqw, 13px)`; same floor for all `cqw` text (body 1.1cqw → clamp(15px,…)).
5. **[board-mobile]** H1: render `Engineering real-world solutions.` (sentence case, hyphen, full stop). Drop `capitalize`; fix `studio.motto` data string.
6. **[board-mobile]** Header: add the right-hand column per HOMEPAGE.md (Accra time, "Taking work" status, Now building) and the 48px menubar, or mark explicitly out of scope. The right 55% of the header band is empty at 1440.
7. **[board-mobile]** Work tiles: eyebrow/blurb contrast ≥4.5:1 on every tone (darken scrim gradient to ≥ rgba(0,0,0,.6) over the text block; currently on light art the white text sits on ~#8a8a88).
8. **[board-mobile]** Work tile heading level: use `h2`, or put an `h2 "Work"` above the grid so `heading-order` passes (axe moderate).
9. **[board-mobile]** Make tiles interactive (`<a>` to `#`, or a button) with visible `:focus-visible` ring; currently nothing is focusable or clickable.
10. **[board-mobile]** Give the page real anchors: `id="work"` on `WorkGrid`, `id="about"` and `id="contact"` sections (or change `data/dock.ts` hrefs). Dock Work/About/Talk are dead today. (Anchors live in board-mobile's `+page.svelte`; hrefs live in dock — coordinate, but ids are the cheaper fix.)
11. **[dock]** Wire action items (`terminal`, `reel`, `games`, `archive`) to something: at minimum a status toast or modal, or hide them until windows exist. Four of seven dead buttons violates "pixel perfect".
12. **[head/layout]** Pass `active` and `onaction`/`onnavigate` from `+layout.svelte` (it mounts `<Dock />` bare); set `active` from scroll position (IntersectionObserver on `#work`, `#about`, `#contact`).
13. **[dock]** Tooltip: raise to ≥12px text with ≥4.5:1 contrast; verify it clears the tile at scale 1.7 for all seven items.
14. **[dock]** Make dock magnification no-op under `prefers-reduced-motion` and add a test screenshot.
15. **[dock]** Merge `DockDesktop`/`DockMobile` nav landmarks: only one `<nav aria-label="Primary">` should exist in the DOM at a time (render by media query in JS or `hidden` + `inert`).
16. **[physics-gravity]** Mount it: the homepage must do `<PhysicsLayer>` around the collage and expose a gravity/scatter trigger (button in header or key `g`). Today `drag moved false` on the live page; `Collage.svelte` binds `container` but nothing consumes it.
17. **[physics-gravity]** Lazy-load matter-js via dynamic `import()` on first interaction so `/` first load stays at ≤ 140 KB JS.
18. **[intro-film]** Cut total to ≤3.0s from first paint to `data-intro` removal (now 5.4s): `play` ≤ 2.2s, `reveal` ≤ 0.9s. Measure: `data-intro` absent by t=3000ms.
19. **[intro-film]** Replace the saturated purple/teal/brown gradient plates with the neutral ink/paper palette (or real flat-lay stand-ins) — they contradict ART-DIRECTION and look like a generic gradient landing.
20. **[intro-film]** Add the directional smear (`feGaussianBlur` stdDeviation animated from velocity) and verify it visibly engages during board travel; I could not see it in frames at t=0.6/1.0s.
21. **[intro-film]** Add a visible "click to skip" affordance (bottom-center, 12px, fades in at 0.4s) with `aria-hidden` film + `role=status` skip hint.
22. **[intro-film]** Stagger: confirm `.site-header` fades at +350ms and the board at +150ms (teardown §1); record `getComputedStyle().transitionDelay` for both.
23. **[a11y-pass]** Load the fonts: add `@fontsource-variable/geist` (self-hosted, `font-display: swap`, preload the latin-subset woff2) and verify `document.fonts` reports Geist loaded. Today font bytes = 0.
24. **[a11y-pass]** Contrast script (`npm run a11y:contrast`) must cover tile eyebrow/blurb and collage labels on every tone pair; fail CI if any <4.5:1.
25. **[a11y-pass]** Touch targets: 7 elements <44x44 at 390 — enlarge dock "More" row and tile links to ≥44x44.
26. **[head]** Add a safe-area bottom padding equal to dock height (74 + 12 + env(safe-area-inset-bottom)) to `.board` so last tile row is never under the dock; on mobile dock covers ~70px of content at rest.
27. **[head]** Wire `STATUS.md`'s "Intro + Dock mounted" claim into a smoke script (`npm run smoke`) that asserts: no dead hrefs, collage overlap = 0, intro ≤ 3.0s, heading order OK, so these regressions can't ship.

## What passes (do not regress)
Grid geometry (358 / 25.7% / 3-up), house ratio 1.39, portrait 160x220, hero 16:9 665; CLS 0; no horizontal overflow at 1440/1024/768/390; reduced-motion skips intro; revisit gate; skip link; one `main`; typed/small components; zero shipped raster assets.

## Pending
Builder branches ahead of `svelte-rebuild` at time of writing: `intro-film` +1, `board-mobile` +2. JUDGE-2 will scratch-merge them.
