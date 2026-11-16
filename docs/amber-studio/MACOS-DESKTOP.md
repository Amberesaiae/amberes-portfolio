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
