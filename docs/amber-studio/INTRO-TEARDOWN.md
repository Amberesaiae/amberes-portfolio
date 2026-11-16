# The roydenso.com opening transition — teardown

Only the opening. Not the page, not the scroll, not the layout.

Reverse-engineered from the live site 2026-11-16 (CSS rules, JS bundle config, network log).
Assets pulled to `/home/amber/Desktop/Site Clones/roydenso-intro-ref/assets` — 61 files,
8.0 MB, reference only, see that folder's `ATTRIBUTION.md`.

---

## 1. What it actually is

**It is not a video.** It is a React component compositing WebP stills in real time, with
one small MP4 used only as a dust texture.

The site drives it off a single attribute on `<html>`:

```
html[data-intro=play]    → the film is running
html[data-intro=reveal]  → the film is done, the page fades up
(attribute absent)       → intro already seen, page is just there
```

Everything that should stay hidden during the film carries `data-reveal`:

```css
html[data-intro] [data-reveal],
html[data-intro] .site-header            { opacity: 0 }

html[data-intro=reveal] [data-reveal],
html[data-intro=reveal] .site-header     { opacity: 1;
                                           transition: opacity 1s cubic-bezier(.22,1,.36,1) }
html[data-intro=reveal] [data-reveal=hands] { transition: opacity 1.1s cubic-bezier(.5,0,.3,1) .5s }
html[data-intro=reveal] [data-reveal=paper] { transition: opacity 1s   cubic-bezier(.22,1,.36,1) .15s }
html[data-intro=reveal] .site-header        { transition: opacity .9s  cubic-bezier(.22,1,.36,1) .35s }
```

So the hand-off is a **staggered fade**, not a cut: paper at +150ms, header at +350ms,
hands at +500ms, each over ~1s. That stagger is most of why it feels expensive.

The film container itself:

```html
<div class="intro-loader fixed inset-0 z-[80] bg-ink" aria-hidden="true">
  <div class="intro-film absolute inset-0 select-none overflow-hidden bg-ink"> … </div>
</div>
```

`aria-hidden` on the whole thing — it is decoration, screen readers skip it.

---

## 2. The layer stack

Bottom to top, inside `.intro-film`:

| Layer | What | CSS |
| --- | --- | --- |
| ground | `bg-ink` (near-black) | — |
| **pieces** | 5 photographs of work as physical objects, scattered, each rotated | `transform: rotate(Ndeg)`, `box-shadow: 0 18px 40px rgb(0 0 0 /.55), 0 2px 6px rgb(0 0 0 /.5)` |
| paper (per piece) | `paper-grain-2048.webp` over each piece | `.intro-print-paper` — `mix-blend-mode: hard-light; opacity: .22` |
| dust (per piece) | a `<canvas>` fed by a hidden `<video>` | `.intro-print-dust` — `mix-blend-mode: screen; opacity: .7` |
| **cuts** | 5 full-bleed photographs, cross-faded | `object-cover`, positioned by a per-cut `focus` value |
| lens | vignette | `.intro-lens` — `background: radial-gradient(circle, #0000 62%, #080c0d66 100%)` |
| grain | full-screen moving grain | `.intro-grain` — `mix-blend-mode: overlay; opacity: .16; background-repeat: repeat` |
| veil | the fade-to-page element | `.intro-veil` — starts `opacity: 0` |

Plus an SVG filter applied during movement:

```html
<filter id="intro-smear" x="-10%" y="-10%" width="120%" height="120%">
  <feGaussianBlur in="SourceGraphic" stdDeviation="0 0"/>
</filter>
```

`stdDeviation` is animated by JS — **directional** (x and y separately), so a horizontal
move smears horizontally. That is a motion-blur cheat and it is the single most
film-like detail in the whole sequence.

`.intro-print { isolation: isolate }` is load-bearing: it stops each print's hard-light
paper and screen dust from blending into the ones behind it.

---

## 3. The content, verbatim from the bundle

```js
pieces: [
  { id:"current-phones",   size:[2000,1500], at:[0,0],       w:1100, turn:-7, look:[.5,.42,.6 ] },
  { id:"live-time-row-v2", size:[2000,1500], at:[1020,-420], w:1050, turn: 9, look:[.5,.5, .62] },
  { id:"ob1-phone",        size:[2400,1350], at:[1600,330],  w: 980, turn:-5, look:[.3,.45,.62] },
  { id:"phia-tray",        size:[1600,2000], at:[800,800],   w: 640, turn:11, look:[.5,.4, .72] },
  { id:"reel-08",          size:[768,515],   at:[-80,700],   w: 860, turn:-9, look:[.5,.55,.8 ] },
],
cuts: [
  { id:"sabotage",           focus:.49 },
  { id:"make-them-hear-you", focus:.73 },
  { id:"swatches",           focus:.36 },
  { id:"phia",               focus:.52 },
  { id:"skyline",            focus:.33, centre:.33, drop:.06 },
],
pieceSrc: id => `/assets/intro/pieces/${id}.webp`,     // + `-1280` variant on phones
cutSrc:  (id,w) => `/assets/intro/cuts/${id}-v3-${w}.webp`,  // only w=1280 is actually shipped
paperSrc: "/assets/intro/paper/paper-grain-2048.webp",
dustSrc:  "/assets/intro/dust/plain/dust-1600.mp4",
```

`at:` is a position on a virtual board much larger than the viewport — the camera moves
across it. `turn:` is the print's rotation. `look:` is a 3-tuple that drives the
per-piece lighting/transform. `focus:` is the vertical crop anchor for a full-bleed cut.

**Five pieces + five cuts. Ten images.** That is the whole film.

---

## 4. What the images actually are — this is the real lesson

I expected the cuts to be screenshots. They are not.

Every cut is **a photograph of two hands holding a printed card, on a dark table, with the
work printed on the card.** `sabotage-v3-1280.webp` is a photo of hands holding a paper
print of the Sabotage website. The pieces are flat-lay photographs — a phone running the
app, lying in a metal tray next to a blue staple remover and paper clips, shot from above
in soft daylight.

The hero that the intro resolves into is the same photograph, cut into layers:

```
hands-base-v2-{640,1080,1600,2560}.webp   the desk + arms
hand-left-{384,640,1080,1600,2560}.webp   left hand, separate layer
hand-right-{384,…,2560}.webp              right hand, separate layer
hands-base-v2-soft5 / -soft15             pre-blurred copies, 2 depth-of-field levels
hand-left-soft5 / -soft15
hand-right-soft5 / -soft15
```

One photo shoot → a base plate, two hand cut-outs, and two pre-blurred variants of each
for fake depth of field. The middle of the frame is an empty slot where live media goes.

And the slot cycles. Separate from the intro, there is a **showreel**:

```js
{ label:"Showreel 2026", interval:500, paper:"/assets/hero/showreel-tooth.webp",
  frames:[ "phia-v2","fomo-hand-v1","joiner-v2","live-time-v4","phia-logo-v2","sabotage-v2",
           "01-v2","phia-feed-v2","02-v3","sabotage-phone-v2","03-v2","04-v3","05-v2",
           "06-v2","07-v3","08","10-v2","11-v2","12-v2","14-v3","15-v2","17","18-v2" ] }
```

23 frames swapping every **500ms** inside the held print, with a paper "tooth" texture over
them. That is the flicker you see in the hero after the intro lands.

**The answer to "our portfolio feels fake" is in these files, not in the code.** Nothing is
a screenshot on a gradient. Every single image is a photograph of a real object with the
work on it. That is the entire art direction, and it costs one afternoon with a printer, a
phone, a dark table and a window.

---

## 5. Timing and behaviour

- Skippable: the component attaches `["click","keydown"]` listeners that abort the film and
  jump to `data-intro=reveal`. Any click or key, anywhere.
- Runs once. On a return visit `data-intro` is never set and the page renders directly —
  which is why my first reload showed almost no intro.
- Total length ~2.5–3s cold, measured from first paint to hands settled.
- The dust MP4 is 336 KB at 1600px. The whole intro asset set is 8 MB, and only ~2 MB of it
  is needed before first frame.

---

## 6. How we rebuild it for Amber Studio

Same machine, our content. It is genuinely not much code.

**Shoot list** (the actual work — a half day):
- 5 **pieces**: flat-lays. A phone showing TandohStay on a desk with real objects beside it.
  A printed NeedBe page. A laptop running Continuum, shot at an angle. Shoot on a plain
  surface, one soft light source, from directly above.
- 5 **cuts**: hands holding a printed A5 card of each site, dark table, same light.
- 1 **hero plate**: the same hands-holding-a-card shot, then cut in Photoshop into
  base / left hand / right hand, plus a 5px and 15px blurred copy of each.
- Textures: a paper grain scan (scan a blank sheet at 600dpi), and a dust loop — or shoot
  one by filming dust in a light beam against black for 4 seconds.

**Component** (`IntroFilm.tsx`, ~250 lines):
1. `useIntroPhase()` → sets `data-intro` on `<html>`: `play` → `reveal` → removed.
   Persist "seen" in `sessionStorage`, not `localStorage` — one film per visit, not one ever.
2. Layer stack exactly as §2. Copy the blend modes and opacities verbatim; they are tuned
   and there is no reason to re-derive them.
3. Animate the board position across the five `at:` coordinates, driving
   `feGaussianBlur stdDeviation` from the per-frame velocity.
4. Cross-fade into the five cuts.
5. Raise `.intro-veil`, set `data-intro=reveal`, let the staggered CSS in §1 do the hand-off.
6. Abort on click/keydown. Honour `prefers-reduced-motion` by skipping straight to `reveal`.

**Where it goes.** On the Garaje desktop shell, the film replaces `loader.tsx`. The clone's
loader already owns this slot — progress bar, project marquee, then the desktop appears —
so this is a swap, not an addition. The film plays, the veil lifts, and the desk is there.

That is the thing you were describing: not a page before the page, a **title sequence**.

---

## 7. One caution

Royden's intro earns ~3 seconds because it is also preloading a heavy hero and because it
is skippable with any input. Those two things are not optional. An intro that cannot be
skipped, or that replays on every navigation, is a cost you charge every visitor on every
visit. Build the skip and the `sessionStorage` gate in the first commit, not later.
