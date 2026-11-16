# macOS-style desktop layer — direction (from the user, 2026-11-16)

Applies to the SvelteKit rebuild (`web/`). Read with `DOCK-AND-BRAND.md`.

## Intent
The studio's site behaves like a very polished macOS desktop, on desktop AND mobile.
Fully marketing-minded, a little playful. Every app on the dock is a way into our work.

## Apps (dock + mobile home grid)
| App | What it is | Notes |
| --- | --- | --- |
| **Finder** | File explorer: projects as files with names, extensions, modified dates, sidebar (Favourites) | the main way to browse work; table view + icon view |
| **Player** | A VLC/Spotify-style media player for OUR works: queue of project films/reels, play/pause, next/prev, progress, "now playing" project card | original design and name; no VLC/Spotify marks, cones or green |
| **Projects / Work** | The projects we've done (what flyer services only advertise) | opens as windows from Finder or the board |
| **READ_ME / About** | Who we are, services, contact | "we" voice |
| **Terminal, Games** | optional playful extras, port later | |
| **Trash / Mystery folder** | easter egg, last | |

Mobile: same apps as a home-screen grid plus a bottom dock, sheets for windows, Finder
as a full-screen list. Phones mirror desktop: same pieces, same order, one column.

## Icons — rules
- Do NOT copy Apple's macOS icons, or Spotify/VLC/other brand marks: they are trademarks
  or copyrighted artwork and must not ship.
- Build our own icon set in the macOS style: squircle (continuous-corner) tile, soft
  gradient, inner highlight, soft drop shadow, a single glyph.
- Glyphs from permissively licensed sets (Lucide ISC, Phosphor MIT, Tabler MIT) via
  Iconify, recorded in `web/static/icons/LICENSES.md`; hero icons (Player, Finder) drawn
  custom or generated via Codex using `ART-DIRECTION.md`.
- One `AppIcon.svelte` component takes `{ glyph, from, to, size }`; dock, Finder, mobile
  grid all use it. Dock magnification and bounce-on-open are CSS/spring only.

## Pixel-perfect scope
The board and intro are matched to roydenso's measured system (see `PLAN.md`,
`PHASE0-NUMBERS.md`, `INTRO-TEARDOWN.md`): positions, spacing, aspect ratios, easing,
timings. Our own assets replace his images. The dock/window chrome is ours, built to a
macOS reference measured the same way (dock height, icon sizes, magnification curve,
window radius, traffic-light sizes), documented in `web/docs/CHROME-SPECS.md`.

---

# Addendum — mobile canvas and the quality bar

## The canvas must be designed for mobile, not shrunk or dropped
roydenso's board is desktop-only (48 absolutely positioned cards on a ~1500px plane). We
improve on it. Supersedes the earlier "drop the collage on mobile" decision.

- **One board model, two layouts.** Card data (id, aspect, weight, group, order) lives in one
  place in `src/lib/board/`. A pure function derives desktop coordinates (the measured
  roydenso system) and mobile coordinates from it. No hand-placed per-breakpoint copies.
- **Mobile layout:** a vertical canvas, two staggered columns with small rotations and
  varied card sizes (same aspect ratios, 1.39 house ratio, portrait 160x220), one hero
  full-width, then the rigid grid collapsing to 2-up or 1-up. Reads as a working surface
  but scrolls like a feed.
- **Touch-native interaction:** no hover dependence; tap = open, long-press = peek,
  drag only where it has a purpose (`touch-action` set deliberately so scroll is never
  hijacked), 44px minimum targets, `dvh` units, safe-area insets, thumb-reachable dock.
- **Optional overview mode:** pinch / double-tap zoom-out to the full board as a map, then
  tap a region to zoom in. Only if it can hold 60fps on a mid-range phone; otherwise cut.
- **CoverFlow rail** (PLAN.md §4) as an alternate "browse works" view in Finder and Player.
- Test breakpoints: 360, 390, 430, 768, 1024, 1440, 1920. Landscape phone included.

## Quality bar ("atomic" correctness) — every component
1. **Specs before pixels.** Each component gets a tiny spec: measured values, states
   (default/hover/focus/active/disabled/loading), motion (duration, easing, spring), and
   reduced-motion behaviour. Stored beside it as `*.spec.md`.
2. **Tokens only.** Colour, radius, spacing, shadow, easing, z-index from one token file.
   No magic numbers in components.
3. **Visual regression.** Playwright screenshots at 390, 768, 1440 for every route and every
   open-window state, compared to the reference captures. Intro frames sampled at fixed
   timestamps. A diff over threshold fails the check.
4. **Performance budgets.** LCP < 2.5s on a throttled mid phone, CLS ~0, intro assets under
   2MB before first frame, hero under 3MB, below-fold media lazy with posters, `content-visibility`
   on offscreen cards, 60fps scroll and drag. Budgets enforced in CI.
5. **Accessibility.** Full keyboard model (dock, windows, Finder, Player), focus
   management on window open/close, ARIA roles, `prefers-reduced-motion` and
   `prefers-contrast`, screen-reader-friendly alt text, the intro `aria-hidden` and skippable.
6. **Modularity.** One component per file, typed props, no cross-imports between feature
   folders except through `src/lib/ui` and `src/lib/stores`. Each feature (`intro`, `board`,
   `dock`, `finder`, `player`, `gravity`) can be deleted without breaking the rest.
7. **Assets.** Pipeline script: source -> avif/webp + poster + sized variants, with a manifest.
   Mock vs real flagged in the manifest; build fails if a mock ships in production.

## Additions worth having (marketing)
- **Deep links:** every project/window has a URL (`/work/tandohstay`), shareable and indexable;
  the desktop state restores from the URL.
- **Always-reachable CTA:** a persistent "Start a project" in the menu bar and mobile dock.
- **SEO/OG:** per-project OG images, structured data, sensible titles; the canvas must not
  hide content from crawlers (server-rendered project list).
- **Analytics:** PostHog events for intro skipped vs completed, app opened, project opened,
  CTA clicked (use `posthog-cli api` per the user's CLAUDE.md).
- **Performance of play:** gravity/screensaver lazy-loaded; never on the critical path.
