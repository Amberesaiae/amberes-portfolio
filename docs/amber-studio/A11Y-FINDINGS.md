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

5. **WARN: heading order** (1.3.1, axe `heading-order`).
   - Selector: `article[data-card-id="needbe"] > .gap-1.bg-gradient-to-t.from-black\/55 > h3` (and the other cards).
   - The page jumps from `<h1>` to `<h3>` inside cards. Fix: use `<h2>` for card titles, or add a visually hidden `<h2>Selected work</h2>` before the grid and keep `<h3>`.
6. **WARN: muted text contrast during reveal** is a transient artefact (opacity 0 -> 1 over about 1.9 s). Final state passes. No change, but do not set `text-muted-foreground` on a lighter surface than board grey: it is 6.05:1 on `#e8e8e8`.
7. Manual: confirm each card is one focus stop with a descriptive name. Current tab order on `/` skips cards entirely (only dock links are tabbable), so **cards are not keyboard reachable** (2.1.1). If cards are meant to link to projects, make each `<article>` contain a single `<a href>` (stretched link pattern) with the project title as its name. If they are intentionally non-interactive, ignore.

## Dock (owner: dock)

8. **WARN: landmark-unique on `/dock-demo`** (axe `landmark-unique`).
   - Selector: `nav[aria-label="Dock"]` exists twice (`DockDesktop.svelte:138`, `DockMobile.svelte:77`), one hidden per breakpoint, but the demo/route renders a duplicate visible landmark with the same name.
   - Fix: give distinct names (`aria-label="Dock"` desktop, `aria-label="Dock, mobile"` mobile) or render only one by viewport (`{#if}` with `matchMedia`), not CSS `hidden`.
9. Tab order is sane: skip link, Work, About, Talk, Terminal, Reel, Games, Archive on desktop, and Work, About, Talk, More on mobile. **WARN (manual):** the dock should be **one roving Tab stop** (A11Y.md section 4). Currently every item is a separate Tab stop. Implement `tabindex` roving with Arrow/Home/End, or accept this and document it.
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

Skip link first stop on every route; one `<main>` and one `<h1>` per route; no positive tabindex; visible focus ring on every stop; no keyboard trap; no horizontal overflow at 390; infinite animations absent under reduced motion; `html[lang]` and titles present.
