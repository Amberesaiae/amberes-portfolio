# amberes-portfolio — Desktop OS Redesign

**Status:** planning
**Date:** 2026-09-15
**Goal:** kill the verbosity. One screen, one video, folders you drag. Everything else is a window.

---

## 1. The idea in one paragraph

The site stops being a scrolling page and becomes a desktop. A single looping video
(`Animated Backgrounds.mp4`, converted to webm) fills the viewport permanently. On top of it
sit a handful of draggable folder icons — that's the entire navigation. Double-click a folder
and it opens a draggable, resizable window containing that section. No sidebar, no nav bar,
no scroll narrative, no twelve-section homepage. The work, the reel and the terminal all live
inside windows.

Navigation *is* the UI. There is nothing else to learn.

---

## 2. What dies

Deleted outright — this is where the complexity and word-count lived:

| File | Fate |
|---|---|
| `sections/ManifestoSection.tsx` | delete |
| `sections/ServicesSection.tsx` | delete |
| `sections/HowIWorkSection.tsx` | delete |
| `sections/StackStripSection.tsx` | delete |
| `sections/HeroSection.tsx` | delete (replaced by the desktop itself) |
| `sections/VideoScrollSection.tsx` | delete (replaced by the Reel window) |
| `components/WhyAmber.tsx` | delete |
| `components/SystemStatus.tsx` | delete |
| `components/Tetris.tsx` | delete |
| `components/Minesweeper.tsx` | delete |
| `components/Navigation.tsx` | delete (folders replace it) |
| `components/BackToTop.tsx` | delete (nothing scrolls) |
| `components/InfluenceMarquee.tsx` | delete |
| `components/BirthdayCountdown.tsx` | delete |
| `components/SmoothScroll.tsx` + `lenis` | delete (no page scroll) |
| `pages/Home.tsx`, `Portfolio.tsx`, `About.tsx`, `ProjectDetail.tsx` | delete — content moves into windows |
| most of `components/ui/*` (shadcn) | prune to the ~8 actually used |

Kept: `Terminal` (rebuilt, see §6), `Footer` content (collapsed to one line in the menubar),
`Contact` form logic, `data/projects.ts`, `Meta.tsx`, legal pages (Privacy/Terms/Cookies —
they become one small window, not three routes).

---

## 3. Screen anatomy

```
┌──────────────────────────────────────────────────────────┐
│  AMBER ES        work  reel  about  contact     14:22 ▓  │  ← menubar (thin, always on top)
├──────────────────────────────────────────────────────────┤
│                                                          │
│   ▣ WORK        ▣ REEL                                   │  ← draggable folder icons
│                                                          │
│         ┌─────────────────────────────┐                  │
│         │ ▪▪▪  WORK              — □ ×│                  │  ← window (drag by titlebar,
│         │                             │                  │     resize from corner)
│   ▣ ABOUT       │  project list       │                  │
│         └─────────────────────────────┘                  │
│                                                          │
│   ▣ CONTACT     ▣ TERMINAL      ▣ LEGAL                  │
│                                                          │
│                                                          │
│         [▸][▸][▸][▸][▸][▸][▸]                            │  ← reel dock (7 looping thumbs)
└──────────────────────────────────────────────────────────┘
        └── full-bleed looping background video ──┘
```

**Layers (z-index):** background video `0` → folder icons `10` → windows `100+` (focused window
gets the top index) → menubar `1000`.

---

## 4. Folders

Six, no more:

1. **WORK** — the project list
2. **REEL** — the video queue
3. **ABOUT** — who/what
4. **CONTACT** — the form
5. **TERMINAL** — the real one (§6)
6. **LEGAL** — privacy/terms/cookies collapsed into tabs

### Behaviour
- Rendered as a custom folder asset (SVG, two states: closed / open-while-window-is-open) plus
  a label underneath.
- **Draggable** via `framer-motion` `drag` with `dragMomentum={false}`. Position is snapped to a
  loose 8px grid on drop so the desktop never looks messy.
- Positions persist to `localStorage` (`desktop:icons:v1`) wrapped in try/catch, so a returning
  visitor finds their own arrangement. A "Tidy up" item in the menubar resets to defaults.
- Single click = select (highlight ring). Double-click / Enter = open window. Touch = single tap
  opens.
- Keyboard: arrow keys move selection between icons, Enter opens. Focus ring is visible.

### Assets needed
`public/icons/folder.svg`, `folder-open.svg` — flat, two-tone, sized 96×96, drawn to match the
background video's palette. Drawn from scratch, no third-party icon pack.

---

## 5. Windows

One window manager, `src/desktop/windowStore.ts` — a `useReducer` + context, no new dependency.

```ts
type WindowId = 'work' | 'reel' | 'about' | 'contact' | 'terminal' | 'legal'
type WindowState = {
  id: WindowId
  open: boolean
  minimized: boolean
  maximized: boolean
  x: number; y: number; w: number; h: number
  z: number
}
```

Actions: `open`, `close`, `focus`, `minimize`, `maximize`, `move`, `resize`.

- **Chrome:** titlebar with the window name and three controls (close / minimize / maximize),
  1px border, heavy background blur so the video reads through. Nothing else.
- **Drag:** titlebar only. **Resize:** bottom-right grip + right/bottom edges. Min size per window.
- **Focus:** click anywhere in a window raises it and sets `z = ++topZ`.
- Windows are clamped to the viewport so one can never be dragged out of reach.
- Opening a window while it is already open just focuses it.
- **Escape** closes the focused window.

### Routing
Keep `react-router` but make URLs a *projection* of window state, not the driver:
- `/` → clean desktop
- `/work`, `/reel`, `/about`, `/contact`, `/terminal`, `/legal` → desktop with that window open
- `/work/:projectId` → WORK window open with that project selected

Opening/closing a window pushes/replaces the URL, so links and back-button still work and SEO
survives. `Meta.tsx` reads the focused window for title/description.

### Mobile (< 768px)
The window manager switches to a single-window, fullscreen mode:
- Folders become a fixed, centred grid — **no dragging** (it fights scroll, and the precision
  isn't there).
- A tapped folder opens as a full-screen sheet sliding up from the bottom, with a back chevron.
- Reel dock becomes a horizontal snap-scroll strip.
- Background video swaps to the poster image below 640px or on `prefers-reduced-motion` /
  slow connection (reuse `useConnectionSpeed`).

---

## 6. Terminal (kept, rebuilt)

The hand-rolled 18KB `Terminal.tsx` gets replaced with a real emulator so it can actually be
extended later.

- **`@xterm/xterm`** + **`@xterm/addon-fit`** + **`@xterm/addon-web-links`**. MIT, ~250KB,
  lazy-loaded only when the terminal window opens so it costs nothing on first paint.
- A small shell layer, `src/desktop/terminal/shell.ts`, owns the prompt, line editing, history
  (↑/↓), tab-completion and dispatch.
- **Commands live in one editable file**, `src/desktop/terminal/commands.ts`, as a registry:

```ts
export const commands: Record<string, Command> = {
  help:    { desc: 'list commands',        run: (ctx) => ... },
  ls:      { desc: 'list folders',         run: (ctx) => ... },
  open:    { desc: 'open <folder>',        run: (ctx, args) => ctx.openWindow(args[0]) },
  work:    { desc: 'list projects',        run: ... },
  cat:     { desc: 'cat <project>',        run: ... },
  play:    { desc: 'play <reel-clip>',     run: ... },
  contact: { desc: 'open the contact form',run: ... },
  theme:   { desc: 'toggle video bg',      run: ... },
  clear:   { desc: 'clear the screen',     run: ... },
  whoami:  { desc: 'about',                run: ... },
}
```

Adding a command is one object literal — that's the whole point. The terminal gets a `ctx`
handle into the window store, so it can drive the rest of the desktop (`open reel`, `play seen`).

---

## 7. Reel / video queue

The seven existing clips (`public/vids/loops/*.webm` as thumbnails, `public/vids/previews/*.webm`
as the full versions) get a dedicated surface.

- **Dock:** a strip along the bottom of the desktop showing the 7 loop clips as small muted
  autoplaying tiles. Hover lifts and shows the title. Click plays.
- **Player:** clicking a tile opens the REEL window with that clip playing — a plain `<video>`
  with a minimal custom bar (play/pause, scrub, mute, fullscreen) and prev/next through the queue.
  Arrow keys move the queue, space toggles play.
- Only one video plays at a time; loops pause while the player is active to protect decode budget.
- On mobile the dock is a snap-scrolling row and the player is fullscreen.

---

## 8. Background video pipeline

Source: `app/Animated Backgrounds.mp4` — 3800×2184, 5.03s, h264, 3.4MB.

Downscale to 1920 wide (the source resolution is pure waste for a background) and emit three files
into `public/vids/`:

| Output | Encode | Purpose |
|---|---|---|
| `desktop-bg.webm` | VP9, `-crf 38 -b:v 0`, scaled to 1920 | primary |
| `desktop-bg.mp4` | h264, `-crf 30 -preset slow -movflags +faststart` | Safari/iOS fallback |
| `desktop-bg-poster.jpg` | first frame, 1280 wide, q5 | poster + reduced-motion / slow-connection still |

Markup: `<video autoplay muted loop playsinline preload="metadata" poster=...>` with both sources,
`object-fit: cover`, fixed to the viewport, plus a subtle dark scrim so folder labels and window
text stay legible against any frame.

---

## 9. File layout after the change

```
src/
  desktop/
    Desktop.tsx            # root: video, icons, windows, menubar, dock
    BackgroundVideo.tsx
    MenuBar.tsx
    ReelDock.tsx
    icons/
      FolderIcon.tsx
      useIconPositions.ts  # drag + localStorage persistence
    windows/
      Window.tsx           # chrome, drag, resize, focus
      WindowLayer.tsx
      windowStore.ts
      registry.tsx         # id -> { title, component, defaultSize }
    panes/
      WorkPane.tsx
      ReelPane.tsx
      AboutPane.tsx
      ContactPane.tsx
      LegalPane.tsx
      TerminalPane.tsx
    terminal/
      shell.ts
      commands.ts          # ← the editable bit
  data/projects.ts         # unchanged
  hooks/                   # keep useViewport, useReducedMotion, useConnectionSpeed; drop the rest
  components/ui/           # pruned to what the panes actually use
```

---

## 10. Sequence

1. **Video pipeline** — convert, commit the three files to `public/vids/`.
2. **Shell** — `Desktop.tsx`, background video, menubar, window store, `Window.tsx`. Ship it with
   one placeholder window to prove drag/resize/focus/z-order and the mobile fallback.
3. **Folder icons** — asset, drag, snap, persistence, keyboard.
4. **Panes** — Work, About, Contact, Legal ported from the old pages, cut to the bone.
5. **Reel** — dock + player.
6. **Terminal** — xterm.js + command registry.
7. **Demolition** — delete everything in §2, prune `package.json`, prune `index.css`.
8. **Verify** — `tsc -b && vite build`, then screenshots at 1440px and 390px, keyboard pass,
   reduced-motion pass.

Steps 2–6 each leave the site in a working state.

---

## 11. Open questions

- Folder icon art direction — should the folders read as literal OS folders, or as something
  closer to the video's aesthetic (glass slabs, film cans)? Needs one visual decision before §3.
- Does the reel dock stay visible while a window is open, or hide behind it?
- Should the desktop remember open windows across visits, or always start clean? (Leaning clean.)
