# Amber Studio — adaptation plan

Moving `amberes-portfolio` onto the UI/UX language of the **GIF — Garaje Inspiration Fest**
clone, as a studio portfolio rather than a personal one.

Status: plan only. Nothing in `app/` has been changed for this.
Date: 2026-11-16.

---

## 0. Verified facts (checked, not assumed)

### The reference folder is the right one

`/home/amber/Desktop/Site Clones/gif-garajedeideas-clone` **is** the desktop-OS variant.
The three sibling folders are not:

| Folder | What it is |
| --- | --- |
| `gif-garajedeideas-clone` | ✅ **the desktop-OS microsite** — loader, top bar, draggable icons, macOS windows, dock, gravity physics, screensaver |
| `garajedeideas-clone` | still the bare shadcn/Next template (README never replaced, no `ATTRIBUTION.md`) |
| `garaje-connect-clone` | bare template |
| `garajecentral-clone` | bare template |

Only the `gif-` one has a written README, an attribution file, a `docs/REPORT.md`, and
screenshots in `docs/design-references/{original,clone}/`.

### The clone is complete

From `docs/REPORT.md`, corroborated by the source tree:

- **One route** on the original (`/`) plus a 404 — no sitemap, every nav target is a window,
  modal or external link. Both are implemented.
- 22 site components / 2,490 LOC in `components/site/`, 494 lines of flattened CMS data in
  `lib/data.ts`.
- `tsc --noEmit` green, `next build` green (Next 16.4.2), Playwright visual loop run against
  the original at 1440×900 and 390×844, zero console errors.
- 327 assets, 116 MB, self-hosted under `public/assets/` with original filenames.

**Five known deviations**, all of them backend-shaped and all irrelevant to us because we
are replacing the content anyway:

1. Playlist metadata comes from Garaje's public Deezer worker (placeholders offline).
2. Form submit is a local success state — no HubSpot.
3. Burger menu uses the original Lottie with a CSS fallback.
4. Webflow CMS slugs flattened into static data.
5. Mystery-folder easter egg: 4 click-through steps, the original's teleport choreography
   simplified.

So: nothing is missing that we would have wanted to keep. **Treat the clone as a finished
reference implementation**, not as a codebase to finish.

### The GIF style you couldn't name

The balloon one (`BALLOON_EXPAND.gif` — the pink pillowy mass) is **inflatable 3D**, also
called *puffy 3D*, *soft-body*, or *pressure/inflate* render. In Blender it is a cloth
simulation with pressure turned up; in C4D it is a soft-body sim. It is **not** glossy 3D —
glossy/chrome is the sibling style on the same board (`CHROME.gif`, `MARBLE_FLOW.gif`, the
purple torus in the hero). The whole set together is usually tagged **"abstract 3D motion /
inflatable + chrome"**, and that pairing — matte squishy forms next to liquid-metal forms on
a flat neutral ground — is the actual visual signature of the site.

Practical note for generating our own: inflatable renders read as *matte, subsurface, soft
shadow, rounded everything*; chrome reads as *sharp HDRI reflections, no diffuse*. Mixing the
two on one neutral `#eceaeb` plate is what makes the board look designed instead of random.

---

## 1. Where the current app already is

This matters: `amberes-portfolio` is **not** a blank slate. It already has a desktop metaphor
at `app/src/desktop/` — roughly 140 files:

- **Shell**: `Desktop.tsx` (five layers), `MenuBar`, `Dock`, `WindowLayer`, `WidgetLayer`,
  `BackgroundVideo`
- **Window system**: `window/Window.tsx`, `WindowControls`, `WindowTitleBar`,
  `WindowResizeHandles`, `useWindowGeometry`, `windowReducer`, `windowStore`, plus a separate
  `MobileSheet` path
- **Panes** (lazy-loaded, one chunk each): work, reel, about, contact/talk, terminal, games,
  legal
- **Extras**: xterm terminal with a real command shell, Tetris/Minesweeper, a chat pane with
  speech in/out, context menus, theme switching, persisted widget positions

Stack: **Vite 6 + React 18 + React Router 7 + Tailwind 3 + Framer Motion + GSAP + Lenis**,
deployed to Cloudflare. The clone is **Next 16 + React 19 + Tailwind 4 + shadcn maia + GSAP +
Matter.js + lottie-web**.

### The honest read

The current app has *more* functionality than the clone (terminal, games, chat, reel) but
less **presence**. The clone wins on three things, and only three:

1. **A hero that is an artwork**, not a nameplate. Giant centred 3D piece, icons scattered
   around it, nothing explaining itself.
2. **Files, not navigation.** `NANOBOTS.gif`, `DESIGN.mp4`, `MYSTERY FOLDER` — objects with
   filenames and modification dates. Our dock says "Work / Reel / About", which is a website
   wearing a desktop costume.
3. **Consequence-free play.** Gravity toggle, marquee select, screensaver, notifications,
   easter egg. None of it is load-bearing; all of it says a person made this.

Your instinct that the current portfolio "feels kind of fake and too hard to grasp" tracks
with this: it has the chrome of an OS without the *stuff* an OS is full of. Six of your nine
projects have no screenshot (`omitImage: true`, a favicon standing in for the work). A
desktop full of placeholder tiles reads as a demo of a desktop, not as a studio's desk.

**That is the real problem to solve, and it is a content problem before it is a UI problem.**

---

## 2. Decision to make first: port or re-skin

Two routes. They are genuinely different amounts of work.

### A. Re-skin in place (recommended)

Keep Vite/React 18/Router/Tailwind 3. Keep the window system, panes, terminal, games, reel —
they work and they are yours. Port the clone's **design language and its three missing
behaviours** into the existing shell.

- Cost: ~2–3 weeks of focused work, mostly new CSS tokens, a new icon layer, new assets.
- Risk: low. Nothing that currently works stops working.
- Downside: you don't get the clone's code verbatim; you reimplement ~6 components
  (icon layer, marquee select, gravity, screensaver, notifications, loader) against your own
  window store. Matter.js and the GSAP Draggable patterns port directly — the clone's
  `crazy-mode.tsx` (178 LOC) and `select-box.tsx` (81 LOC) are small and readable.

### B. Rebuild on the clone

Copy `gif-garajedeideas-clone` to a new repo, strip Garaje content, pour Amber Studio in.

- Cost: ~4–6 weeks. You lose and must re-port the terminal (xterm + a real shell), games,
  chat pane with speech, reel queue, Cloudflare deploy pipeline — all of which are the
  *better* half of the current app.
- Risk: high. Also a Next 16 + React 19 + Tailwind 4 migration on top.
- Upside: the playful layer arrives for free and pixel-exact.

**Recommendation was A. You chose B — rebuild on the clone.** Recorded; the rest of this doc
now assumes B.

One mitigation that makes B cheaper than my first estimate: the seven panes are
self-contained and lazy-loaded, so B is not "rewrite everything", it is "copy the clone,
strip Garaje, port seven panes across". The terminal (`desktop/terminal/`, a real
`Shell.ts` + command registry) and the games are plain React + TS with no Vite-specific
code; they move with import-path edits. The genuinely new work in B is the React 18→19 and
Tailwind 3→4 migration and redoing the Cloudflare deploy. Call it 4 weeks, not 6.

What B buys that A doesn't, and this turns out to be the deciding factor: **the loader.**
See §10 — the thing you actually want is the clone's entry sequence, and that is one of the
few pieces of it that is easier to inherit than to rebuild.

One caveat worth saying plainly: the clone is marked "do not deploy publicly" in its
`ATTRIBUTION.md` because the design is Garaje de Ideas'. Re-skinning means we take the
*grammar* — desktop-as-canvas, files-as-content, a dock, a toy toggle — and not the
distinctive marks: not the GIF logotype, not their palette, not their icon set, not the
balloon artwork itself. The grammar is common property (it is macOS's, really). The specific
blue `#0158d0`, the pink `#f67bbd`, and the 327 assets are not.

---

## 3. Target: what Amber Studio is

A studio desk. You open it and you are looking at someone's actual working surface mid-job.

### Visual system

From the flyer, not from Garaje:

| Token | Value | Note |
| --- | --- | --- |
| `--amber-blue` | `#1B2ED4`-ish (flyer's cobalt) | the studio's one loud colour |
| `--amber-gold` | `#F5A623`-ish (flyer's amber) | accents, underline strokes, the burst mark |
| `--amber-ink` | `#121212` | |
| `--amber-surface` | `#ECEAEB` → warmer, `#EFEDE9` | the desk plate |
| `--amber-paper` | `#FFFFFF` | window fills |

The flyer's halftone treatment (the hand + laptop) is a strong, cheap, ownable device — it
costs one CSS filter chain or one pre-baked PNG per asset, and it immediately separates us
from the Garaje look while staying in the same family. **Use halftone for photography,
inflatable/chrome 3D for the abstract pieces.**

Type: keep the clone's structural choice (one grotesque for UI + one mono for metadata). The
app already loads Geist + Geist Mono via fontsource. That is the right pair; no change needed.

Do **not** make the site look like the flyer. The flyer is a poster: one message, centre-set,
big. The site is a desk. The flyer supplies the palette and the halftone idea; that's all.

### Content model

This is the part that fixes "feels fake". Every object on the desk needs:

1. **A filename.** `TANDOHSTAY.mp4`, `NEEDBE_FOUNDATION.gif`, `CONTINUUM/`,
   `SYSTEM_GUARDIAN_v1.exe`, `READ_ME.txt`. Filenames with real extensions carry more
   conviction than any card layout.
2. **A date.** The clone's folder window has a "Fecha de modificación" column, and it is the
   single most convincing detail on the whole site. We have real dates — `2024–2026`,
   `2025`, `2026` — use them, to the day where you know it.
3. **A thumbnail that is the work.** Six of nine projects currently have none.

Nine projects is enough. The clone shows twelve icons and ten speakers. We should show **nine
projects + 7 reel clips + a READ_ME + an ARCHIVE folder + a MYSTERY folder** = around nineteen
objects on the desk. That is a full desk.

Pull the missing screenshots from the live sites (`needbefoundation.online`,
`tandohstay.com`, `continuum-rust-eta.vercel.app`) and from the GitHub repos for the
in-progress ones (glean, jingo, noragami, containerclear). For in-progress work that has no
UI yet, a terminal capture or a commit-graph still is more honest and more interesting than a
favicon on a grey square.

---

## 4. The scroll component from the video

The reference video is a **3D coverflow**: cards on a horizontal rail, the centre card
flat-on and scaled up, neighbours rotated away on the Y axis with perspective, each with a
soft contact shadow and a caption underneath. Shot at 728×572, so it is a desktop capture,
but you're right that it is strongest on mobile — it turns a list into a thing you flick.

### Spec

```
Container:  perspective: 1200px; overflow-x: hidden
Rail:       flex row, gap ~12vw
Card:       aspect 3/4, width ~46vw mobile / ~22vw desktop
            transform: translateX(…) rotateY(±28deg) translateZ(-120px) scale(0.82)
            centre card:  rotateY(0) translateZ(0) scale(1)
            interpolate by distance-from-centre, clamped at ±2
Shadow:     box-shadow drops with |offset| — the centre card sits highest
Caption:    below card, mono, 11px, opacity fades with distance
Snap:       scroll-snap-type: x mandatory on the rail, snap-align: center on cards
Drive:      native scroll + IntersectionObserver for the centre index.
            No GSAP needed. Lenis is already in the project and plays fine with it.
```

Build it as `app/src/desktop/widgets/CoverFlow.tsx`, data-source-agnostic (takes
`{ id, title, media, caption }[]`), then use it in **two** places:

- **Mobile home screen** — replaces the current static widget column as the primary way to
  see work. This is the highest-value single change in the whole plan.
- **Desktop `WorkPane`, as a third view mode** alongside the existing grid and list
  (`config/views.ts` already has a `ViewMode` concept, and `ViewToggle` already exists).

Accessibility: respect `prefers-reduced-motion` by dropping to a flat snap carousel (no
rotateY, no scale). Keyboard: left/right arrows move the centre index.

---

## 5. What to port from the clone, concretely

Six behaviours, in value order. Each is small.

| # | Behaviour | Clone source | Port target | Size |
| --- | --- | --- | --- | --- |
| 1 | **Desktop icons as files** — label + extension, press-scale, drag, double-click to open | `desktop-icons.tsx` (115) | new `desktop/icons/FileIcon.tsx`, wired to existing `useIconPositions` | M |
| 2 | **Finder/folder window** — name / modified / format table, sidebar with FAVOURITES | `folder-window.tsx` (274) | new pane `panes/finder/` | L |
| 3 | **Loader** — progress + project-name marquee | `loader.tsx` (71) | replace `components/LoadingScreen.tsx` | S |
| 4 | **Marquee selection box** | `select-box.tsx` (81) | `desktop/layers/SelectBox.tsx` | S |
| 5 | **Gravity toggle** (Matter.js drops icons + windows, snap-back) | `crazy-mode.tsx` (178) | `desktop/effects/Gravity.tsx` | M |
| 6 | **Idle screensaver** (DVD bounce at 50s, reduced-motion aware) | `screensaver.tsx` (93) | `desktop/layers/Screensaver.tsx` | S |

Deliberately **not** porting: the music player (we have no playlist and the worker is
Garaje's), the timed notification popups (ad-like, and they push the CTA), the speakers
overlay (no speakers), the mystery easter egg (port last, if at all — it is charming but it
is 4 steps of bespoke choreography).

`matter-js` and `lottie-web` are the only new dependencies, and only #5 needs Matter.

---

## 6. Asset pipeline — our own GIFs

Nine to twelve pieces, matching the clone's density. Two families:

- **Inflatable** (matte, soft shadow, subsurface) — for the brand marks and the hero.
- **Chrome/liquid** (HDRI reflections) — for the accent pieces.
- Plus **halftone** stills from the flyer treatment for anything photographic.

Format: the clone ships `.mp4`/`.webm` behind a `bg-video.tsx` wrapper rather than real GIFs
— 21 mp4 + 21 webm, and that is why 327 assets fit in 116 MB. **Do the same.** Never ship an
actual `.gif`; name the file `*.gif` in the UI label and serve `webm` with an `mp4` fallback.

Budget: hero piece under 3 MB, icon loops under 400 KB each, all muted + `playsinline` +
`loop`, `preload="none"` for anything below the fold, and a poster frame so the desk is never
empty on a cold load.

Where they come from is your call — Blender, a generator, or commissioned. The plan does not
depend on which.

---

## 7. Phases

**Phase 0 — content (do this first, it unblocks everything)**
Capture the six missing project screenshots. Add real modification dates to `projects.ts`.
Write the `READ_ME.txt` copy. Decide the nineteen desk objects and their filenames.
*Without this, every later phase ships placeholders.*

**Phase 1 — palette + type**
New tokens from the flyer, applied across the existing desktop. No structural change. This
alone will make the current app feel different.

**Phase 2 — CoverFlow**
Build the component, land it on mobile home first, then as a WorkPane view mode.

**Phase 3 — files**
Port #1 (file icons) and #3 (loader). The desk starts reading as a desk.

**Phase 4 — Finder**
Port #2. This is the biggest single piece and the one that sells the whole metaphor.

**Phase 5 — play**
Port #4, #5, #6 (select box, gravity, screensaver). Pure delight, zero dependency on the
others.

**Phase 6 — assets**
Swap in the real 3D pieces as they are produced. Designed so it can happen in parallel from
Phase 1 onward.

---

## 8. Open questions for you

1. ~~**Studio or person?**~~ **Decided 2026-11-16: a studio of one, written in "we" voice.**
   "We" is a register, never a headcount claim — see `HOMEPAGE.md` §2 for the rule and the
   test. About names Lamptey Odartei Isaiah and switches to "I".
   Still open: do the six flyer services (web design & dev, UI/UX, e-commerce, custom
   software, school management systems, business management systems) become a
   `SERVICES.txt` object on the desk? I lean yes — a studio with a motto about solutions
   should say what it sells.
2. **Which GitHub projects come in?** You mentioned existing repos. Nine projects is a full
   desk; adding more means the Finder matters more and the desktop matters less.
3. **Does the reel stay?** Seven film clips credited to other filmmakers sit oddly next to a
   software studio. They might be the strongest thing on the site or the most confusing one.
4. **Domain/name**: `amberesaiae.space` on the flyer vs. whatever this deploys to now.

---

## 9. Reference index

- Clone root: `/home/amber/Desktop/Site Clones/gif-garajedeideas-clone`
- Screenshots, original vs clone: `docs/design-references/{original,clone}/` (18 + 14 PNGs)
- Token extraction: `docs/research/DESIGN_TOKENS.md`
- Fidelity report: `docs/REPORT.md`
- Flattened content model (good template for ours): `lib/data.ts`
- Current app shell: `app/src/desktop/Desktop.tsx`
- Current project data: `app/src/data/projects.ts`
