# The desktop

The site is one screen. A looping video fills the viewport, six folders sit on
top of it, and everything else opens in a window. No scrolling page, no
navigation bar, no homepage sections.

```bash
cd app
npm install     # adds @xterm/*, @fontsource-variable/geist*
npm run dev     # http://localhost:3000
```

---

## Foundation

**Radix + shadcn/ui.** The primitives in `src/components/ui/` were already in
this repo (`components.json`, new-york style, lucide icons) and are now what the
panes are actually built from — `Button`, `Input`, `Textarea`, `Label`, `Badge`,
`Tabs`, `Collapsible`, `ScrollArea`, `Separator`, `Skeleton`. Nothing is
hand-rolled that a primitive already does.

Adding another one is the normal CLI call, run locally:

```bash
npx shadcn@latest add dialog
```

It will theme itself correctly with no edits, because the tokens it expects are
the ones defined in `src/index.css`.

**Tokens.** `src/index.css` holds one dark theme using shadcn's exact variable
names, tuned to the background plate: `--primary` is the orange from the
flowers, `--background` the near-black the frame settles into. `--glass` and
`--glass-opacity` are the window surface. `tailwind.config.js` maps every
Tailwind colour onto those variables, so the primitives and the desktop chrome
cannot drift apart.

**Typography.** Geist and Geist Mono, self-hosted via `@fontsource-variable`, so
first paint never waits on a third-party font server. The scale is six steps,
defined once in `index.css` and used through components, never as hand-written
font sizes:

| Step | Size / tracking | For |
|---|---|---|
| `Display` | 28px, −0.022em | one heading per pane |
| `Title` | 17px, −0.014em | section and row headings |
| `Body` | 14px/1.65, capped at 62ch | running prose |
| `Small` | 13px/1.6 | descriptions, captions |
| `Label` | 10px mono, 0.2em, uppercase | eyebrows, metadata, chrome |
| `Mono` | 11px mono | values, counts, timestamps |

Import them from `@/desktop/typography/Text`.

**Icons.** The six SVGs from `icons/` are served from `public/icons/`, named by
folder. Each has its own internal padding, so `WINDOW_DEFS[id].iconScale`
normalises them to one optical size — that field is the only place to nudge one.

---

## Layout

```
src/
  components/ui/            shadcn primitives (kept, added to via CLI)
  lib/utils.ts              cn()
  data/projects.ts          unchanged — edit a project here
  components/about/aboutData.ts   unchanged — edit a credential here
  desktop/
    Desktop.tsx             composes the five layers. ~45 lines.
    types.ts
    config/
      windows.ts            ← add a folder here
      panes.tsx             lazy pane registry
      routes.ts             URL segment -> window
      layout.ts             shared geometry constants
    providers/
      DesktopProvider.tsx   the provider
      windowReducer.ts      pure reducer — all window logic, no React
      windowStore.ts        context + useDesktop / useWindowActions
      useRouteSync.ts       URL <-> window state
      useDocumentTitle.ts
      useIsMobile.ts
    layers/
      BackgroundVideo.tsx   + useStillBackground.ts
      MenuBar.tsx           + MenuBarClock, MenuBarWindowList
      IconLayer.tsx
      WindowLayer.tsx
      ReelDock.tsx          + ReelDockTile
    icons/
      FolderIcon.tsx        drag, select, open
      FolderGlyph.tsx       the art + scale normalisation
      useIconPositions.ts   positions, persisted
    window/
      Window.tsx            composition only
      WindowTitleBar / WindowControls / WindowResizeHandles
      PaneShell.tsx         suspense + scroll area
      MobileSheet.tsx       the mobile form of a window
      useWindowResize.ts / useEscapeToClose.ts
    typography/
      Text.tsx / Eyebrow.tsx
    panes/
      PaneBody.tsx
      work/     WorkPane, ProjectRow, ProjectDetail, StatusDot
      about/    AboutPane, DisciplineList, TimelineList
      contact/  ContactPane, ContactForm, ContactField, ContactLinks,
                useContactForm
      reel/     ReelPane, ReelPlayer, ReelQueue, ReelControls, useReelQueue
      legal/    LegalPane, legalCopy
      terminal/ TerminalPane, useXterm
    terminal/
      Shell.ts              the loop
      commands.ts           ← add a command here
      completion.ts / history.ts / ansi.ts / types.ts
    data/reel.ts
```

Largest file is the reducer at ~190 lines, and it is pure. Every component does
one thing; every behaviour is a hook next to the component that uses it.

---

## Adding a folder

Three edits, no wiring:

1. `types.ts` — add the id to `WindowId`.
2. `config/windows.ts` — add it to `WINDOW_ORDER` and a `WINDOW_DEFS` entry
   (title, hint, icon path, default and minimum size, home position in % of the
   viewport). Drop the SVG in `public/icons/`.
3. `config/panes.tsx` — add the lazy import.

The folder, the window, the menubar entry, the `#/<id>` URL, the terminal's
`open <id>`, the mobile sheet and the keyboard handling all follow.

## Adding a terminal command

One entry in `terminal/commands.ts`:

```ts
now: {
  desc: 'what I am working on',
  run: (ctx) => ctx.print('  Rebuilding the Lampfarms dashboard.'),
},
```

`ctx` gives `print`, `clear`, `openWindow`, `closeWindow`, `closeAll`, so a
command can drive the rest of the desktop. Add `complete: () => [...]` and its
argument tab-completes. `run` may be async. `help` builds itself from the
registry, so a new command documents itself.

---

## Interaction

| | |
|---|---|
| Click a folder | select |
| Double-click a folder | open (one tap on touch) |
| Drag a folder | move it; remembered per visitor |
| Drag a titlebar | move the window |
| Double-click a titlebar | maximise / restore |
| Bottom-right grip | resize |
| Escape | close the focused window |
| Arrow keys / space in Reel | move the queue / play-pause |
| "Tidy up" | folders back to defaults |
| `amber` in the menubar | close everything |

## Notes

- **URLs.** `#/work`, `#/reel`, `#/about`, `#/contact`, `#/terminal`, `#/legal`.
  Old `/portfolio`, `/privacy`, `/terms`, `/cookies` still resolve.
- **Weight.** ~125KB gzipped on first paint, fonts included. Every pane is a
  separate chunk; xterm (72KB gz) loads only when the Terminal folder opens.
- **Background.** `public/vids/desktop-bg.webm` + mp4 fallback + poster. The
  poster replaces the video under `prefers-reduced-motion`, on save-data, and
  on 2G.
- **Storage.** One key, `desktop:icons:v1`. Every access is wrapped in
  try/catch, so blocked-storage browsers work identically.
- **Mobile (<768px).** Folders become a fixed grid and open as full-screen
  sheets; the dock scrolls horizontally. Dragging is off.
- **Contact.** Same `/api/contact` endpoint, same JSON, same 429 handling.
  Native constraint validation replaced zod + react-hook-form.

## Not done yet

- `cleanup-old-ui.sh` removes the replaced files. Nothing imports them, so the
  site is correct either way.
- Reel titles and credits in `desktop/data/reel.ts` came across from the old
  video section — worth confirming they are still right.
- `ContactLinks.tsx` points at instagram.com and x.com generically; swap in the
  real handles.
