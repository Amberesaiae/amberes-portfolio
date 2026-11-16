# Amber Studio — card art direction

For the eight project cards on the homepage rail, and for the intro film's cuts.
Written so Codex can hit it repeatably and so you can go find moodboard references.

---

## 1. The genre, so you can search for it

What the video's cards are doing is **conceptual still life** — one object on a flat
ground, photographed or rendered straight, where the object says something it isn't.

Look at what was actually on those cards:

| Card | What it was |
| --- | --- |
| Altitude | a red paper plane casting the shadow of a fighter jet, bone-white ground |
| Pixel Drift | a pink zinnia whose bloom dissolves into pixels, white ground |
| Return Key | a white Enter key with a black brush, deep maroon ground |
| Tactile | stacked glossy 3D keycaps, cobalt ground |
| Soft Strokes | a paintbrush with rainbow bristles, cream ground |

Every one: **one object, one twist, one flat colour behind it, nothing else.** The paper
plane is the clearest — the object is innocent, the shadow is the idea.

Search these terms for moodboards:

- `conceptual still life` · `visual metaphor poster` · `object poster`
- `Noma Bar` · `visual pun design` (for the idea-twist, not the flat-vector style)
- `surreal product photography` · `single object flat background`
- `glossy 3D render still life` · `inflatable 3D` (the Tactile keycap card's family)
- `editorial conceptual photography` · `minimal prop styling`

Avoid: anything tagged "mockup", "UI showcase", "device frame", "dribbble shot". Those are
the default and they are exactly what we are getting away from.

---

## 2. The invariants

A set of images reads as one system when a handful of things never vary. Get these right
and wildly different objects still look like they belong together. **These matter more
than any individual image.**

1. **Aspect 3:4 portrait, 1200 × 1600px.** The rail is built for it.
2. **One object. Never two.** If the idea needs two objects it is not ready yet.
3. **One flat ground colour**, edge to edge, no gradient, no vignette, no texture.
   Drawn only from the palette in §3.
4. **Camera straight-on or 12–18° above.** Never a dutch angle, never a dramatic low angle.
5. **One soft light source, upper-left**, and exactly **one soft contact shadow** falling
   lower-right. Consistent light direction across eight images is what sells the set.
6. **The object fills 45–60% of frame height**, centred horizontally, its base sitting at
   roughly 62% down the frame. Generous air above.
7. **No text in the image.** None. Titles and captions are HTML over the top — crisper,
   restyleable, and translatable. This is why the rail renders the caption separately.
8. **Matte over glossy**, except where the idea is specifically about screens or plastic.

---

## 3. Palette

One ground per card, no repeats among neighbours on the rail. Taken from the studio's
flyer plus a muted support range so the cobalt stays the loudest thing on the page.

```
cobalt     #1B2ED4   the studio's blue — use once, on the strongest card
amber      #F5A623   use once
bone       #EFEDE9   the desk surface
deep rose  #8C2F3B
forest     #1F3D2F
indigo     #1C2340
ochre      #C8862F
mint       #CFE0D4
CRT amber  #120E08 ground with #F5A623 object
```

---

## 4. The eight concepts

One per project. Each is already a complete brief: object, twist, ground.

**1 · NEEDBE FOUNDATION** — *deep rose ground*
A plain white envelope standing upright. Its cast shadow is an open doorway.
> Education and access, stated without euphemism. This one must carry dignity, not
> cuteness — no flowers, no pastel coyness, no visual winking at the subject.

**2 · CONTINUUM MAGAZINE** — *bone ground*
A single cream printed page, one corner curling up — and the colour revealed underneath
the curl is terracotta, a different world entirely.
> The issue is called "The In-Between". The image is literally the space between two
> states.

**3 · TANDOHSTAY** — *forest ground*
A filament bulb lying on its side on folded white hotel linen, still lit.
> Their real differentiator is power that does not fail. Not a key, not a little house —
> every hospitality brand on earth has those.

**4 · SYSTEM_GUARDIAN_v1** — *CRT amber on near-black*
A hamster wheel, shot straight on, casting the shadow of a radar dish.
> It is a joke project and should stay a joke, but a designed one. Phosphor glow, scan
> lines acceptable here and nowhere else in the set.

**5 · CONTAINERCLEAR** — *cobalt ground*
A rotary telephone handset whose coiled cord is a heavy freight lashing chain.
> The whole product exists because the resolution lives in phone calls nobody records.
> Phone plus freight, one object, instantly readable. This is the strongest idea of the
> eight — give it the cobalt.

**6 · GLEAN** — *mint ground*
A crushed aluminium can resting in the pan of a brass jeweller's scale.
> It verifies what was recovered, not what was paid. Worth, measured, given to waste.

**7 · JINGO** — *ochre ground*
A single brown egg with a barcode printed cleanly across its shell.
> Farm meets marketplace in one object. Hatcheries are in the product; the egg is not a
> stretch.

**8 · NORAGAMI** — *indigo ground*
A paper plane folded from a printed map of Africa, mid-flight, shadow on the ground below.
> A deliberate echo of the Altitude card you liked. Opportunity, reach, a continent —
> and it is the one card that may carry a trace of text, because the map has place names
> on it.

---

## 5. Codex prompt template

Fill the three slots. Keep everything else identical across all eight — the repeated
language is what produces a coherent set.

```
A conceptual still life photograph. {OBJECT}, centred, occupying about half the
frame height, its base sitting slightly below centre. Flat solid {GROUND} background,
edge to edge, no gradient and no vignette. Single soft light source from the upper
left casting one soft contact shadow down and to the right. Camera straight on,
slightly above, no tilt. Matte surfaces, shallow depth of field, muted realistic
colour. Generous empty space above the object. No text, no logos, no watermark,
no people. Editorial product photography. 3:4 portrait, 1200x1600.
```

For card 4 only, swap the last two sentences for: `Retro CRT phosphor glow, visible scan
lines, 1980s computer terminal aesthetic.`

Generate 4 variants per concept, pick one, and **check the set side by side before
accepting any of them** — a single image that looks great alone will break the set if its
light comes from the wrong side. That side-by-side check is the step most likely to get
skipped and the one that actually determines whether this works.

Save as `studio/public/cards/{project-id}.webp`, using the ids exactly:
`needbe · continuum · tandohstay · system-guardian · containerclear · glean · jingo ·
noragami`. The rail will pick them up by that name.

---

## 6. One visual language, not two

Worth being explicit, because this changes earlier advice.

I previously argued for photographing your work as physical objects, the way roydenso.com
does — hands holding a printed page, a phone in a tray. That is a good direction and it is
still the better one *if you ever shoot it for real*. But it is a different language from
the conceptual still lifes above, and running both would make the site look like two
studios.

So: **the conceptual still life wins, and it runs everywhere.** That includes the intro
film — its five "cuts" should be five of these eight cards, full-bleed, rather than
photographs of prints. The film's grain, paper and dust layers still apply over the top
and will do a lot to bind them together.

The photographed route stays as the upgrade path: if you later shoot the real thing, it
replaces this set wholesale rather than sitting beside it.

---

## 7. The "computer interface" on Seesaw — confirmed, and what it is

You were right, and you were also right that it is not on the live site.

**It is the previous version of roydenso.com**, called **ROYDEN'S PLAYGROUND**. Seesaw's
screenshot is dated 1.14.2026 and was never refreshed after he redesigned to the dark
photographic site we took the intro from. So Seesaw is showing one site and the link goes
to another.

It is archived and fully browsable:
`https://web.archive.org/web/20260122225324/https://roydenso.com/`
(39 captures, 19 Dec 2025 – 13 Oct 2026.)

What it actually is — and it is closer to what you want than the current site:

- A **Figma-style infinite canvas** on a flat grey ground, not a scrolling page.
- Every card carries **selection handles** — the little blue corner dots, as if the whole
  portfolio were a file left open in the editor. This is the single strongest signal in
  the whole design and it is almost free to build.
- Above each card, a **tiny grey annotation label** in the corner — the kind of micro-type
  a designer leaves on a frame.
- A **left sidebar**: "ROYDEN'S \ PLAYGROUND", then four coloured chip icons — Home, Work,
  Play, Info.
- **Four lines of prose on the entire homepage.** "Hey, I'm Royden / Designer from Hong
  Kong / Currently based in NYC and building Royden Studio / Prev at MeeOpp, StudioPDP."
  Everything else is images.

That last point is the one that matters for your argument. The page sells by showing about
thirty artifacts at once and explaining none of them.

### What we take from it

We already have a computer interface — the desk. Adding an infinite canvas on top would be
a third metaphor and the site would stop making sense. So take the **finish**, not the
structure:

1. **Selection handles on the desk objects.** Eight small corner dots on the focused item.
   Pure CSS, and it is the detail that makes a desk read as a workspace rather than a menu.
2. **Micro annotation labels.** A line of 9px grey mono above each object — `BRAND · 2025`,
   `SYSTEM · IN BUILD`. Craft, for nothing.
3. **Cut the prose to four lines.** Everywhere. The About panel included.
4. **Density is the real lesson.** His canvas is not eight cards, it is ~30 artifacts —
   logos, colour studies, posters, a portrait, business cards, screens. We have eight
   projects and one image each, which will read as thin no matter how good the motion is.
   **The fix is several images per project, not more projects**: a logo, a screen, a detail
   crop, a colour strip. That is the single highest-value thing Codex can generate once the
   eight card concepts in §4 exist.

### The Garaje balloon, as an accent

The inflatable 3D pieces (`BALLOON_EXPAND.gif` and its family — see §1 of
`INTRO-TEARDOWN.md` for why they are called that) are worth keeping as **one** ambient
object, not a theme. Two places only:

- One slow inflating/rising loop sitting on the desk as an idle object, the way Garaje's
  giant artwork anchors the middle of their screen.
- One cut in the intro film.

Any more and it fights the conceptual still lifes, which are the actual system.

---

## 8. What I need back

- The eight images at `studio/public/cards/{id}.webp`, 1200×1600.
- A one-line note if you change any concept, so the ground colours stay unrepeated along
  the rail.

Everything else — the rail, the captions, the dots, the intro — is already built or in
progress and will pick these up as soon as they exist.
