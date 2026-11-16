# Royden's Playground — build mocks, reference only

`assets/` holds 83 files (68 MB) downloaded 2026-11-16 from `framerusercontent.com`,
the CDN behind **roydenso.com as it stood on 2026-01-22** — the "ROYDEN'S PLAYGROUND"
version, archived at:

`https://web.archive.org/web/20260122225324/https://roydenso.com/`

Harvested from all eight pages: `/`, `/work`, `/play`, `/info`, and the five case
studies (`field`, `meeopp`, `archer`, `graduationceremony`, `shazoom`).

© Royden So. Every image, photograph and film here is his creative work.

## What these are for

**Mocks.** They fill the canvas while Amber Studio's own board is being built, so the
layout can be judged at real density instead of against grey rectangles. Every one of
them gets replaced by an original before anything is deployed — the replacements are
specified in `docs/amber-studio/ASSET-WORKORDER.md` (67 assets, with prompts).

## What must not happen

- None of these files ship. Not to a staging URL anyone can reach, not to a preview
  link, not to a deck. A portfolio is the designer's own identity; these images used
  under Amber Studio's name would be passing off his work as ours, to the exact
  audience we are trying to convince.
- The build is not finished while any of them are still in `site/public/`. Treat a
  remaining mock as a release blocker, the same as a `TODO` in a payment path.

A grep for `playground-mock` in `site/` should return nothing on the day this launches.

## Also noted

The site was built in **Framer** (`<meta name="generator" content="Framer c0d7099">`),
so there is no component source to read — the structure was measured from the rendered
DOM, not copied. Its typeface is **PP Neue Montreal** (Pangram Pangram), which is
commercial and is not included here; Amber Studio needs its own licence or a substitute.
