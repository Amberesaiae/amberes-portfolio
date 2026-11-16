# A11Y findings (round 2, integrated site)

Audit: `cd web && npm run build && npm run a11y` on `/`, `/physics-demo`, `/dock-demo` at 1440x900 and 390x844, normal and reduced motion, plus an intro keyboard test. Zero axe WCAG violations on all routes once the intro has finished. Items below are for other owners; nothing here was edited outside the a11y files.

Status key: **FAIL** = audit fails, **WARN** = audit warns / manual.

## Intro (owner: intro-film)

1. **FAIL: no visible Skip control** (WCAG 2.2.2 Pause/Stop/Hide, 2.1.1).
   - File: `web/src/lib/components/intro/Intro.svelte`, `IntroFilm.svelte` (the film root has `aria-hidden="true"`).
   - Today the only skip is "any click or keydown" via `<svelte:window onclick onkeydown>`. Sighted keyboard and screen-reader users get no cue and no focusable control.
   - Fix: render a real `<button type="button" class="intro-skip">Skip intro</button>` **outside** the `aria-hidden` subtree (a sibling in `Intro.svelte`), fixed top-right, min 44x44, visible focus ring (the global `:focus-visible` ring applies; add class `on-dark` since the film is `#0b0b0b`). Focus it on mount (`autofocus` via `$effect`) so one Enter/Space skips. Its handler calls `revealIntro()`.
2. **WARN: page content is focusable and screen-reader-visible but invisible during the film** (2.4.7, 2.4.11).
   - Selector: `html[data-intro] [data-reveal]`, `html[data-intro] .site-header` (opacity 0 only).
   - Fix: while `$introPhase === 'play'`, set `inert` on the page wrapper (e.g. `document.getElementById('content')`, owned by the a11y layout; use a `$effect` in `Intro.svelte` that toggles `inert` on `#content` and removes it on `reveal`). Also `aria-hidden` is already on the film; add `role="status"`-free fallback text only if the film carries meaning (it should not).
3. **WARN: keydown skip eats the first Tab** (2.4.3). `onkeydown={skip}` on window means the Tab that ends the intro also moves focus. This works (focus lands on "Skip to main content"), keep it, but do not call `preventDefault` there.
4. Reduced motion: **PASS**. `html[data-intro]` is never set and the page shows immediately.

## Board (owner: board-mobile)

5. **WARN: heading order** (12 `[data-work-card]` articles, all `<h3>` after the `<h1>`) (1.3.1, axe `heading-order`).
   - Selector: `article[data-card-id="needbe"] > .gap-1.bg-gradient-to-t.from-black\/55 > h3` (and the other cards).
   - The page jumps from `<h1>` to `<h3>` inside cards. Fix: use `<h2>` for card titles, or add a visually hidden `<h2>Selected work</h2>` before the grid and keep `<h3>`.
6. **WARN: muted text contrast during reveal** is a transient artefact (opacity 0 -> 1 over about 1.9 s). Final state passes. No change, but do not set `text-muted-foreground` on a lighter surface than board grey: it is 6.05:1 on `#e8e8e8`.
7. **WARN (product decision):** there are 12 `[data-work-card]` articles and zero `<a>` in `<main>`; the only Tab stops are dock items, so cards (including collage cards) are not keyboard reachable (2.1.1). If cards are meant to link to projects, make each `<article>` contain a single `<a href>` (stretched link pattern) with the project title as its name. If they are intentionally non-interactive, ignore.

## Board contrast (owner: board-mobile)

6a. **FAIL: white text on the card scrim, 1.4.3.** File `web/src/lib/components/board/WorkCard.svelte`: text block uses `bg-gradient-to-t from-black/55 to-transparent` over light placeholder art. Measured from screenshots (cards 0, 1, 2, 5): status label (`text-xs uppercase opacity-75`) about 1.6 to 1.9:1, blurb (`text-sm opacity-90`) about 3.0 to 3.5:1, both need 4.5:1; title marginal at 3:1 (large text). axe cannot see gradients over images. Fix: stronger scrim (`from-black/80 via-black/65`, more top padding) or a solid text panel, full-opacity `text-white`, no opacity modifiers on text.

## Dock (owner: dock)

8. **FAIL-ish (WARN in axe): the Dock is rendered twice on `/dock-demo`** (4.1.2 / 2.4.3 / axe `landmark-unique`).
   - Cause: `web/src/routes/+layout.svelte` already mounts `<Dock />` on every route and `web/src/routes/dock-demo/+page.svelte` mounts a second one. Live there are 4 `nav[aria-label=Dock]` (2 visible, 2 `display:none`); Tab walks Work..Archive twice (14 stops).
   - On `/` there are 2 navs but one is `display:none`, so that is not a problem.
   - Fix: remove `<Dock>` from `dock-demo/+page.svelte` (or have the layout skip it on that route). Renaming the labels is not needed.
9. **WARN: dock is not one roving Tab stop** (A11Y.md section 4). Desktop: 7 Tab stops, Arrow/Home/End already work (`DockDesktop.svelte` keydown) but `tabindex` is not roving. Mobile: 4 Tab stops and **no arrow-key handling at all** (only Esc closes More). Fix: roving `tabindex` (one `0`, rest `-1`) in both; add arrows/Home/End to `DockMobile.svelte`.
9a. **FAIL: desktop dock focus ring is hidden** (2.4.7, 2.4.13, 1.4.11).
   - File: `web/src/lib/components/dock/DockDesktop.svelte`, selector `nav[aria-label=Dock] a, nav[aria-label=Dock] button`.
   - The 3px outline is on the 56px `<a>`/`<button>`, but on focus `focusOn()` scales the child tile span to about 1.7 so it covers the ring. Only the enlarged tile and the label identify the focused item.
   - Fix: draw the ring on the scaled span (`group-focus-visible:ring-2 ring-neutral-900 ring-offset-2`, which scales with the tile), or give the ring `z-10` and a larger `outline-offset`. The audit now detects this (ring covered by own descendant).
9b. **WARN: dock tooltips** are not dismissible with Esc (1.4.13).
10. Mobile target size: items use `min-h-11 min-w-11` (44 px). PASS.

## Physics (owner: physics-gravity)

11. **FAIL: toggle has no state** (4.1.2, 1.3.1).
    - Selector: `button[data-testid="gravity"]` on `/physics-demo`; its label flips between "Gravity" and "Restore" but there is no `aria-pressed`.
    - Fix: `<button aria-pressed={$controls.mode==='gravity'} data-physics-toggle>Gravity</button>` with a stable label (do not change the label AND the pressed state). Keep the `data-testid`.
12. **WARN: no Pause control** (2.2.2). Add `data-physics-pause` button ("Pause" / "Resume") while the simulation is running.
13. **WARN: no announcements** (4.1.3). On toggle call `announce('Gravity on. Cards are falling.')` / `announce('Gravity off. Cards restored.')` from `#lib/a11y/index.ts`.
14. Reduced motion: **PASS** on `/physics-demo` (page shows "reduced motion: instant states"). Toggle must stay operable; it does.
15. Physics cards (`[data-physics-card]`) are not focusable, which is fine for the demo; real cards must keep DOM order and focusability while moving (A11Y.md section 3).

## Passing

Skip link first stop on every route; one `<main>` and one `<h1>` per route; no positive tabindex; visible focus ring on every stop except the desktop dock (9a); dock magnify is disabled under reduced motion; no overflow at 320, 390 or 720; no keyboard trap; no horizontal overflow at 390; infinite animations absent under reduced motion; `html[lang]` and titles present.

## Other warnings

- Intro end (2.4.3, A11Y.md section 1): skipping does not move focus to `<h1>`/`<main>` and does not call `announce('Intro finished')`. Focus stays on `<body>`; next Tab reaches the skip link, so low severity.
- Fixed dock vs bottom content (2.4.11): `Board` uses `pb-16`, less than the mobile dock height. The a11y layout now sets `scroll-padding-bottom: calc(var(--dock-h, 6rem) + 2rem)`; the dock should set `--dock-h` on `html` to its real height, and the board needs bottom padding at least that large.

## Round 3: JUDGE-1/2 items assigned to a11y-pass (done) and a11y-relevant items for others

Done in a11y-pass files:
- JUDGE #23 fonts: Geist now self-hosted via `@fontsource-variable/geist` (`wght.css` imported in `layout.css`, latin woff2 preloaded in `+layout.svelte`); family `'Geist Variable'` is first in `--font-sans`. The audit fails if `document.fonts` shows no loaded Geist.
- JUDGE #24 contrast script: `npm run a11y:contrast` now also checks work-card text over every tone with the scrim parsed from `WorkCard.svelte` (status label, blurb, title) and picks dark or light label text per tone. It currently FAILS on paper/stone/ash/amber (1.8 to 3.2:1 vs 4.5:1) which reproduces the judge's measurement. It passes once the scrim is about `from-black/80` at the text block with full-opacity text; re-run to confirm.
- JUDGE #25 targets: `layout.css` gives `button, [role=button], summary, select, text inputs` a 44px minimum on `(pointer: coarse)`. Remaining under-44px items are inline links and custom-sized elements owned by others (dock "More" rows, tile links): set `min-h-11 min-w-11` on them.

For other owners (still open, all verified by the audit or script):
- **[board-mobile]** scrim/opacity fix above (FAIL in `npm run a11y:contrast`); `ink` tone labels need light text (dark label is 1.11:1 on ink); card labels `0.7cqw` need `clamp(11px, 0.7cqw, 13px)` (1.4.4/1.4.12 legibility); h3 -> h2 heading order; cards interactive (JUDGE #9).
- **[dock]** hidden focus ring on desktop (audit FAIL: Talk, Games ring covered by scaled tile), duplicate `<Dock>` in `dock-demo`, dead hrefs `#work`/`#about`/`#contact` (JUDGE #10: the keyboard "Work" link does nothing), magnification off under reduced motion (verified OK by the a11y judge).
- **[intro-film]** visible Skip button (audit FAIL), `inert` page during the film, 3 s budget (2.2.2: > 5 s needs a control).
- **[physics-gravity]** (JUDGE-2 #29) engine must not run under reduced motion; `aria-pressed` toggle exists on the new home controls (audit still checks `/physics-demo`); pause control for running simulation.
- **[head]** bottom safe-area padding equal to dock height; set `--dock-h` on `<html>` so `scroll-padding-bottom` tracks the dock.
