# Amber Studio — asset work order

67 images, numbered, one per line, each with a prompt you can paste into Codex without
thinking. Written 2026-11-16 against `ART-DIRECTION.md` §2–§5.

The reason this file exists is `ART-DIRECTION.md` §7.4. The reference canvas carries 66
images and 354 words; it sells by showing about thirty artifacts at once and explaining
none of them. We have eight projects. Eight cards on a canvas layout will read as thin no
matter how good the motion is, and the fix is **several assets per project, not more
projects** — a mark, a colour strip, a detail crop, a texture plate. That is the whole
brief. Nothing here invents a ninth project.

---

## How to use this file

**Generate in three passes, in this order.** The order matters because the canvas needs to
be fillable before it is finishable.

1. **Pass 1 — the eight heroes.** `*-01-*` for all eight projects, plus `studio-01-mark`.
   Nine images. These are the §4 concepts verbatim, 3:4, and they are the only assets the
   rail strictly needs. Check all nine side by side before accepting any of them (§5) —
   one image with light from the wrong side breaks the set, and this is the step most
   likely to get skipped.
2. **Pass 2 — the supporting plates.** Colour strips, textures, type specimens, studio
   assets. These are cheap, forgiving, and they are what produce density. Twenty-two
   images.
3. **Pass 3 — details, marks, objects.** Everything else. Generate per project so you can
   judge each group as a group.

**Four variants per prompt, pick one, judge it in the group and not alone.**

**Filenames.** `{project-id}-{nn}-{slug}.webp`, into `studio/public/cards/`. The ids are
fixed: `needbe · continuum · tandohstay · system-guardian · containerclear · glean ·
jingo · noragami`, plus `studio` for the nine studio-level plates. The `01` of each
project is the hero and the rail picks it up by that name.

**Ratios.** The canvas wants variety, so the inventory is deliberately mixed:
3:4 → 1200×1600 · 1:1 → 1400×1400 · 4:3 → 1600×1200 · 16:9 → 1920×1080 ·
21:9 → 2100×900. Every prompt already states its own.

---

## The evidence rule, which overrides everything else

**No asset in this file depicts a client, a person, a logo, a testimonial, a metric, or a
finished screen.** Not one.

`projects.ts` carries `omitImage: true` on NeedBe, Continuum and TandohStay, and the other
five ship a favicon on a grey square rather than a product shot. There is no screenshot
library behind this site. So the work order specifies **conceptual still lifes and
abstract marks** — objects that say what the project does, photographed honestly — and
never "a screenshot of the dashboard", never a mocked-up phone, never a device frame.

This is not fastidiousness. The motto is "engineering real-world solutions"
(`HOMEPAGE.md` §1) and it is falsifiable in about four seconds. A portfolio that fakes its
evidence fails its own test, and it fails it in the one place a prospective client is
actually looking. Every object below is a real physical thing that could be put on a desk
and photographed; the only reason Codex is generating them is that nobody has shot them
yet.

The one screen-shaped asset in the inventory, `system-guardian-03`, is a blank glowing CRT
with nothing on it. That is allowed because the project is an acknowledged joke and the
screen is the object, not the evidence.

## The invariants, restated once

Every prompt below already contains these. Do not edit them out when you paste.

One object, never two. One flat ground from the §3 palette, edge to edge, no gradient, no
vignette. One soft light from the upper left, one soft contact shadow down and to the
right. Camera straight on or 12–18° above, never tilted. Object at 45–60% of frame height,
centred, base slightly below centre, generous air above. Matte over glossy. No text.

Every prompt ends `No text, no logos, no watermark, no people.` — with exactly two
exceptions, both sanctioned: `noragami-01`, where §4 explicitly allows the map's place
names, and the three type specimens, where letterforms are the subject.

## Ground colours

```
cobalt     #1B2ED4   once only, on the strongest card — containerclear-01
amber      #F5A623   object colour on system-guardian, not a ground
bone       #EFEDE9
deep rose  #8C2F3B
forest     #1F3D2F
indigo     #1C2340
ochre      #C8862F
mint       #CFE0D4
CRT        #120E08   ground with #F5A623 object, system-guardian only
```

Grounds alternate within every project group so no two adjacent cards repeat one. The
single exception is `system-guardian`, where the near-black CRT ground *is* the concept;
that group alternates with indigo instead, and it is the only group that does.

---

## 1 · NEEDBE FOUNDATION — 9 assets

Education and access, stated without euphemism. §4 is explicit: dignity, not cuteness. No
flowers, no pastels, no visual winking at the subject. The envelope-and-doorway is the
spine of the group and everything else is paper, chalk and kraft — the material culture of
a thing being taught, not a thing being marketed.

| # | id | role | ground | ratio | concept |
| --- | --- | --- | --- | --- | --- |
| 1 | `needbe-01-hero-envelope-door.webp` | hero card | deep rose | 3:4 | White envelope standing upright; its shadow is an open doorway |
| 2 | `needbe-02-envelope-flat-crease.webp` | detail crop | bone | 4:3 | The same envelope lying flat, a doorway-shaped crease pressed into it |
| 3 | `needbe-03-mark-paper-arch.webp` | logo/mark | deep rose | 1:1 | One paper square folded into a standing arch |
| 4 | `needbe-04-colour-strip-tape.webp` | colour strip | mint | 21:9 | A dyed cotton tape, rose fading to bone along its length |
| 5 | `needbe-05-leaflet-stack.webp` | detail crop | deep rose | 4:3 | A bound stack of blank cream leaflets, top one lifting |
| 6 | `needbe-06-chalk-stub.webp` | portrait-of-an-object | ochre | 3:4 | A stub of white chalk worn to a nub |
| 7 | `needbe-07-texture-kraft.webp` | texture | bone | 16:9 | One sheet of brown kraft envelope paper, torn along one edge |
| 8 | `needbe-08-diagram-threshold.webp` | diagram | forest | 1:1 | A folded drafting sheet, a doorway drawn in plan, no annotation |
| 9 | `needbe-09-stamp-corner.webp` | detail crop | mint | 1:1 | The envelope's corner, one blank gummed stamp squared onto it |

### Prompts

**1 — needbe-01-hero-envelope-door**
```
A conceptual still life photograph. A plain white paper envelope standing upright on its long edge, its cast shadow falling as the shape of an open doorway, centred, occupying about half the frame height, its base sitting slightly below centre. Flat solid deep rose #8C2F3B background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte surfaces, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 3:4 portrait, 1200x1600.
```

**2 — needbe-02-envelope-flat-crease**
```
A conceptual still life photograph. A plain white paper envelope lying flat and closed, a single crisp crease pressed into its face in the outline of an open doorway, centred, occupying about 55% of the frame height, its base sitting slightly below centre. Flat solid bone #EFEDE9 background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte surfaces, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 4:3 landscape, 1600x1200.
```

**3 — needbe-03-mark-paper-arch**
```
A conceptual still life photograph. A single square of heavy white paper folded and stood up into a simple arch, like a doorway cut from one sheet, centred, occupying about half the frame height, its base sitting slightly below centre. Flat solid deep rose #8C2F3B background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte surfaces, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 1:1 square, 1400x1400.
```

**4 — needbe-04-colour-strip-tape**
```
A conceptual still life photograph. A single length of woven cotton tape laid out straight, dyed deep rose at one end and fading in flat bands to bone at the other, centred, occupying about half the frame height, its base sitting slightly below centre. Flat solid mint #CFE0D4 background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte surfaces, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 21:9 ultrawide, 2100x900.
```

**5 — needbe-05-leaflet-stack**
```
A conceptual still life photograph. A single bound stack of blank cream leaflets, the top sheet lifting slightly at one corner, centred, occupying about 55% of the frame height, its base sitting slightly below centre. Flat solid deep rose #8C2F3B background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte surfaces, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 4:3 landscape, 1600x1200.
```

**6 — needbe-06-chalk-stub**
```
A conceptual still life photograph. A single stub of white blackboard chalk worn down to a short nub, standing on end, dust at its base, centred, occupying about half the frame height, its base sitting slightly below centre. Flat solid ochre #C8862F background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte surfaces, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 3:4 portrait, 1200x1600.
```

**7 — needbe-07-texture-kraft**
```
A conceptual still life photograph. A single sheet of brown kraft envelope paper lying flat, one edge torn to a soft fibrous fringe, centred, occupying about 55% of the frame height, its base sitting slightly below centre. Flat solid bone #EFEDE9 background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte surfaces, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 16:9 landscape, 1920x1080.
```

**8 — needbe-08-diagram-threshold**
```
A conceptual still life photograph. A single folded drafting sheet, opened out, carrying one drawn plan of a doorway in thin pencil line — a threshold, two jambs, an arc of swing — and no annotation of any kind, centred, occupying about half the frame height, its base sitting slightly below centre. Flat solid forest #1F3D2F background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte surfaces, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 1:1 square, 1400x1400.
```

**9 — needbe-09-stamp-corner**
```
A conceptual still life photograph. A close crop of one corner of a white paper envelope with a single blank gummed stamp, perforated edges, squared onto it, centred, occupying about 55% of the frame height, its base sitting slightly below centre. Flat solid mint #CFE0D4 background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte surfaces, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 1:1 square, 1400x1400.
```

---

## 2 · CONTINUUM MAGAZINE — 9 assets

Issue 01 is called "The In-Between", so the group is the space between two states: a curl
with another colour under it, a gutter where two pages meet, a slot cut through a sheet.
Cream and terracotta on the objects, bone on the grounds. The type specimen is real —
`projects.ts` names Cormorant Garamond — and it is one of the three assets permitted to
carry letterforms.

| # | id | role | ground | ratio | concept |
| --- | --- | --- | --- | --- | --- |
| 1 | `continuum-01-hero-curling-page.webp` | hero card | bone | 3:4 | Cream page, one corner curling; terracotta underneath |
| 2 | `continuum-02-curl-underside.webp` | detail crop | indigo | 1:1 | Macro of the curl's underside, the terracotta filling the frame |
| 3 | `continuum-03-type-specimen.webp` | type specimen | bone | 4:3 | One printed proof sheet of Cormorant Garamond |
| 4 | `continuum-04-colour-strip-concertina.webp` | colour strip | ochre | 21:9 | A concertina paper strip stepping cream to terracotta |
| 5 | `continuum-05-signature-fold.webp` | portrait-of-an-object | bone | 3:4 | One unbound magazine signature, fore-edge still uncut |
| 6 | `continuum-06-texture-laid-paper.webp` | texture | forest | 16:9 | A sheet of cream laid paper in raking light, tooth visible |
| 7 | `continuum-07-detail-gutter.webp` | detail crop | bone | 4:3 | A spread's gutter, two blank pages meeting in shadow |
| 8 | `continuum-08-mark-slot.webp` | logo/mark | deep rose | 1:1 | A cream sheet with one precise slot cut through the middle |
| 9 | `continuum-09-film-reel.webp` | portrait-of-an-object | mint | 3:4 | A reel of 16mm film, a loop unspooled and clear |

### Prompts

**10 — continuum-01-hero-curling-page**
```
A conceptual still life photograph. A single sheet of cream printed page stock lying flat with one corner curling upward, the colour revealed on the underside of the curl a deep terracotta, centred, occupying about half the frame height, its base sitting slightly below centre. Flat solid bone #EFEDE9 background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte surfaces, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 3:4 portrait, 1200x1600.
```

**11 — continuum-02-curl-underside**
```
A conceptual still life photograph. An extreme close crop of the curled corner of a cream paper sheet, the terracotta underside filling the curve, the fibre of the cut edge visible, centred, occupying about 55% of the frame height, its base sitting slightly below centre. Flat solid indigo #1C2340 background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte surfaces, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 1:1 square, 1400x1400.
```

**12 — continuum-03-type-specimen** *(letterforms permitted — this is a type specimen)*
```
A conceptual still life photograph. A single printed proof sheet lying flat, carrying one specimen setting of the Cormorant Garamond serif typeface in terracotta ink on cream stock — a line of large letterforms above two small lines of the same face — centred, occupying about 55% of the frame height, its base sitting slightly below centre. Flat solid bone #EFEDE9 background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte surfaces, shallow depth of field, muted realistic colour. Generous empty space above the object. No logos, no watermark, no people. Editorial product photography. 4:3 landscape, 1600x1200.
```

**13 — continuum-04-colour-strip-concertina**
```
A conceptual still life photograph. A single long strip of paper folded into a concertina and stood on edge, each fold a flat step of colour from cream through to deep terracotta, centred, occupying about half the frame height, its base sitting slightly below centre. Flat solid ochre #C8862F background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte surfaces, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 21:9 ultrawide, 2100x900.
```

**14 — continuum-05-signature-fold**
```
A conceptual still life photograph. A single unbound magazine signature — one folded gathering of blank cream pages, its fore-edge still uncut and slightly ragged — standing tented on its fold, centred, occupying about half the frame height, its base sitting slightly below centre. Flat solid bone #EFEDE9 background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte surfaces, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 3:4 portrait, 1200x1600.
```

**15 — continuum-06-texture-laid-paper**
```
A conceptual still life photograph. A single sheet of cream laid paper lying flat in raking light so its chain lines and tooth are visible across the surface, one deckle edge soft, centred, occupying about 55% of the frame height, its base sitting slightly below centre. Flat solid forest #1F3D2F background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte surfaces, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 16:9 landscape, 1920x1080.
```

**16 — continuum-07-detail-gutter**
```
A conceptual still life photograph. A close crop of an open magazine spread at the gutter, two blank cream pages rising away from the fold with a soft shadow pooled in the valley between them, centred, occupying about 55% of the frame height, its base sitting slightly below centre. Flat solid bone #EFEDE9 background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte surfaces, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 4:3 landscape, 1600x1200.
```

**17 — continuum-08-mark-slot**
```
A conceptual still life photograph. A single square of cream card standing upright with one precisely cut narrow slot through its middle, the terracotta ground glimpsed through the opening, centred, occupying about half the frame height, its base sitting slightly below centre. Flat solid deep rose #8C2F3B background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte surfaces, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 1:1 square, 1400x1400.
```

**18 — continuum-09-film-reel**
```
A conceptual still life photograph. A single small reel of 16mm film resting on its side with one loop of film unspooled in a soft curve, the visible frames clear and empty, centred, occupying about half the frame height, its base sitting slightly below centre. Flat solid mint #CFE0D4 background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte metal, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 3:4 portrait, 1200x1600.
```

---

## 3 · TANDOHSTAY — 9 assets

A live booking business, so this group carries weight. §4 is firm about what it is not: not
a key, not a little house. The real differentiator in `projects.ts` is power that does not
fail and services stated before arrival — so the group is the lit bulb, a generator gauge
with the needle in the green, a hinge, linen. Hospitality as competence, not as mood.

| # | id | role | ground | ratio | concept |
| --- | --- | --- | --- | --- | --- |
| 1 | `tandohstay-01-hero-bulb-linen.webp` | hero card | forest | 3:4 | A filament bulb on its side on folded white linen, still lit |
| 2 | `tandohstay-02-filament-macro.webp` | detail crop | bone | 1:1 | Macro of the lit filament inside the glass |
| 3 | `tandohstay-03-linen-corner.webp` | portrait-of-an-object | forest | 4:3 | One folded white sheet, a hospital corner pulled tight |
| 4 | `tandohstay-04-mark-hinge.webp` | logo/mark | indigo | 1:1 | One brass hinge, opened flat — the mark for arrive and settle |
| 5 | `tandohstay-05-colour-strip-jacquard.webp` | colour strip | forest | 21:9 | Woven upholstery tape, forest and bone bands |
| 6 | `tandohstay-06-genset-gauge.webp` | portrait-of-an-object | mint | 3:4 | An analogue generator panel gauge, needle resting in the green |
| 7 | `tandohstay-07-towel-edge.webp` | detail crop | bone | 4:3 | Crop of one folded white towel's edge, weave visible |
| 8 | `tandohstay-08-texture-plaster.webp` | texture | ochre | 16:9 | A broken slab of bone lime plaster, one clean fracture |
| 9 | `tandohstay-09-luggage-tag.webp` | portrait-of-an-object | deep rose | 1:1 | A blank manila luggage tag, brass eyelet, string coiled |

### Prompts

**19 — tandohstay-01-hero-bulb-linen**
```
A conceptual still life photograph. A single clear filament light bulb lying on its side on a folded piece of crisp white hotel linen, the filament still lit and warm, no cable and no fitting, centred, occupying about half the frame height, its base sitting slightly below centre. Flat solid forest #1F3D2F background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte surfaces with the glass the only shine, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 3:4 portrait, 1200x1600.
```

**20 — tandohstay-02-filament-macro**
```
A conceptual still life photograph. An extreme close crop of a lit tungsten filament suspended inside clear bulb glass, the coil sharp and glowing, the glass edge catching one highlight, centred, occupying about 55% of the frame height, its base sitting slightly below centre. Flat solid bone #EFEDE9 background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 1:1 square, 1400x1400.
```

**21 — tandohstay-03-linen-corner**
```
A conceptual still life photograph. A single folded white cotton bedsheet with one hospital corner pulled tight and square, the fold crisp and the weave visible, centred, occupying about 55% of the frame height, its base sitting slightly below centre. Flat solid forest #1F3D2F background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte surfaces, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 4:3 landscape, 1600x1200.
```

**22 — tandohstay-04-mark-hinge**
```
A conceptual still life photograph. A single solid brass butt hinge opened flat, its knuckle centred and its screw holes empty, standing on edge, centred, occupying about half the frame height, its base sitting slightly below centre. Flat solid indigo #1C2340 background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Brushed matte brass, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 1:1 square, 1400x1400.
```

**23 — tandohstay-05-colour-strip-jacquard**
```
A conceptual still life photograph. A single length of woven jacquard upholstery tape laid out straight, banded in flat stripes of deep forest green and bone, its cut ends slightly frayed, centred, occupying about half the frame height, its base sitting slightly below centre. Flat solid forest #1F3D2F background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte surfaces, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 21:9 ultrawide, 2100x900.
```

**24 — tandohstay-06-genset-gauge**
```
A conceptual still life photograph. A single round analogue panel gauge in a brass bezel, removed from its housing, its dial unmarked and unlettered, its needle resting in a green arc, centred, occupying about half the frame height, its base sitting slightly below centre. Flat solid mint #CFE0D4 background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte metal with one glass highlight, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 3:4 portrait, 1200x1600.
```

**25 — tandohstay-07-towel-edge**
```
A conceptual still life photograph. A close crop of the folded edge of one white cotton terry towel, the loops of the pile and the flat woven hem both in focus, centred, occupying about 55% of the frame height, its base sitting slightly below centre. Flat solid bone #EFEDE9 background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte surfaces, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 4:3 landscape, 1600x1200.
```

**26 — tandohstay-08-texture-plaster**
```
A conceptual still life photograph. A single broken slab of bone-white lime plaster lying flat, one clean fracture across it revealing the aggregate inside, centred, occupying about 55% of the frame height, its base sitting slightly below centre. Flat solid ochre #C8862F background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte surfaces, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 16:9 landscape, 1920x1080.
```

**27 — tandohstay-09-luggage-tag**
```
A conceptual still life photograph. A single blank manila luggage tag with a brass eyelet and its cotton string coiled loosely beside it, lying flat, the card face entirely unwritten, centred, occupying about half the frame height, its base sitting slightly below centre. Flat solid deep rose #8C2F3B background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte surfaces, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 1:1 square, 1400x1400.
```

---

## 4 · SYSTEM_GUARDIAN_v1 — 5 assets

Fewest in the inventory, on purpose: it is an experiment, not a sale. §4 permits phosphor
glow and scan lines here and nowhere else, and those two licences are the reason the group
needs a few plates of its own rather than one card. The ground is the CRT near-black with
amber objects, alternating with indigo so the group has a seam in it. **These five prompts
replace the last two sentences of the template**, per §5.

| # | id | role | ground | ratio | concept |
| --- | --- | --- | --- | --- | --- |
| 1 | `system-guardian-01-hero-wheel-radar.webp` | hero card | CRT #120E08 | 3:4 | A hamster wheel casting the shadow of a radar dish |
| 2 | `system-guardian-02-wheel-rungs.webp` | detail crop | indigo | 1:1 | Macro of the wheel's rungs, amber-lit |
| 3 | `system-guardian-03-blank-crt.webp` | screen | CRT #120E08 | 4:3 | A rounded CRT glowing blank amber, nothing on it |
| 4 | `system-guardian-04-texture-scanlines.webp` | texture | CRT #120E08 | 16:9 | One curved glass panel holding scan lines |
| 5 | `system-guardian-05-paper-tape.webp` | colour strip | indigo | 21:9 | A punched paper tape, amber light through the holes |

### Prompts

**28 — system-guardian-01-hero-wheel-radar**
```
A conceptual still life photograph. A single wire hamster exercise wheel standing upright on its stand, its cast shadow falling as the shape of a parabolic radar dish, centred, occupying about half the frame height, its base sitting slightly below centre. Flat solid near-black #120E08 background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. The object rendered in amber #F5A623 monochrome. Generous empty space above the object. No text, no logos, no watermark, no people. Retro CRT phosphor glow, visible scan lines, 1980s computer terminal aesthetic. 3:4 portrait, 1200x1600.
```

**29 — system-guardian-02-wheel-rungs**
```
A conceptual still life photograph. A close crop of the rungs of a wire hamster wheel, the parallel bars curving away, centred, occupying about 55% of the frame height, its base sitting slightly below centre. Flat solid indigo #1C2340 background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. The object rendered in amber #F5A623 monochrome. Generous empty space above the object. No text, no logos, no watermark, no people. Retro CRT phosphor glow, visible scan lines, 1980s computer terminal aesthetic. 1:1 square, 1400x1400.
```

**30 — system-guardian-03-blank-crt**
```
A conceptual still life photograph. A single small rounded cathode ray tube removed from its casing, standing on its neck, its face glowing an even blank amber with nothing displayed on it, centred, occupying about half the frame height, its base sitting slightly below centre. Flat solid near-black #120E08 background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Glass and amber #F5A623 phosphor only. Generous empty space above the object. No text, no logos, no watermark, no people, nothing on the screen. Retro CRT phosphor glow, visible scan lines, 1980s computer terminal aesthetic. 4:3 landscape, 1600x1200.
```

**31 — system-guardian-04-texture-scanlines**
```
A conceptual still life photograph. A single curved panel of thick CRT faceplate glass lying flat, holding a field of fine horizontal scan lines in amber across its surface, centred, occupying about 55% of the frame height, its base sitting slightly below centre. Flat solid near-black #120E08 background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Amber #F5A623 monochrome. Generous empty space above the object. No text, no logos, no watermark, no people. Retro CRT phosphor glow, visible scan lines, 1980s computer terminal aesthetic. 16:9 landscape, 1920x1080.
```

**32 — system-guardian-05-paper-tape**
```
A conceptual still life photograph. A single length of punched paper tape laid out straight, lit from behind so amber light comes through its rows of holes, centred, occupying about half the frame height, its base sitting slightly below centre. Flat solid indigo #1C2340 background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Amber #F5A623 light through matte paper. Generous empty space above the object. No text, no logos, no watermark, no people. Retro CRT phosphor glow, visible scan lines, 1980s computer terminal aesthetic. 21:9 ultrawide, 2100x900.
```

---

## 5 · CONTAINERCLEAR — 8 assets

§4 calls this the strongest idea of the eight and gives it the cobalt. Cobalt appears
**once in the entire inventory**, here, on `containerclear-01` — that is the point of the
rule and it is the easiest one to break by accident. Everything else in the group is the
material of freight exception work: a cut seal, corten steel, a stencil grid, a blank
rotary dial. The project's own words are "the resolution lives in phone calls nobody
records", so the group is evidence and metal, not dashboards.

| # | id | role | ground | ratio | concept |
| --- | --- | --- | --- | --- | --- |
| 1 | `containerclear-01-hero-handset-chain.webp` | hero card | **cobalt** | 3:4 | A rotary handset whose coiled cord is a freight lashing chain |
| 2 | `containerclear-02-cord-becomes-chain.webp` | detail crop | bone | 1:1 | Macro of the exact point where coil turns into chain link |
| 3 | `containerclear-03-cut-seal.webp` | portrait-of-an-object | indigo | 3:4 | One bolt container seal, cut clean through |
| 4 | `containerclear-04-diagram-states.webp` | diagram | bone | 4:3 | A carbon-copy form carrying a drawn flow of boxes and arrows, unlabelled |
| 5 | `containerclear-05-stencil-grid.webp` | logo/mark | forest | 1:1 | A steel stencil plate, the ISO 6346 field grid punched empty |
| 6 | `containerclear-06-texture-corten.webp` | texture | bone | 16:9 | One weathered corten steel panel |
| 7 | `containerclear-07-colour-strip-marking-tape.webp` | colour strip | ochre | 21:9 | Reflective freight marking tape, cobalt and bone bands |
| 8 | `containerclear-08-blank-dial.webp` | detail crop | indigo | 1:1 | Macro of a rotary dial's finger holes, the ring unmarked |

### Prompts

**33 — containerclear-01-hero-handset-chain**
```
A conceptual still life photograph. A single black bakelite rotary telephone handset resting on its side, its coiled cord replaced by a heavy galvanised freight lashing chain that coils in the same way, centred, occupying about half the frame height, its base sitting slightly below centre. Flat solid cobalt #1B2ED4 background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte bakelite and matte steel, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 3:4 portrait, 1200x1600.
```

**34 — containerclear-02-cord-becomes-chain**
```
A conceptual still life photograph. An extreme close crop of the point where a black coiled telephone cord becomes a heavy galvanised chain, one link closing over the last coil, centred, occupying about 55% of the frame height, its base sitting slightly below centre. Flat solid bone #EFEDE9 background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte surfaces, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 1:1 square, 1400x1400.
```

**35 — containerclear-03-cut-seal**
```
A conceptual still life photograph. A single steel bolt container seal, cut clean through at its shank, the two halves still touching where they parted, standing on end, its surfaces blank and unstamped, centred, occupying about half the frame height, its base sitting slightly below centre. Flat solid indigo #1C2340 background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte metal with a bright cut face, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 3:4 portrait, 1200x1600.
```

**36 — containerclear-04-diagram-states**
```
A conceptual still life photograph. A single carbon-copy docket form lying flat, carrying one hand-drawn flow of five plain rectangles joined by arrows in blue ballpoint, every box empty and nothing written anywhere on the sheet, centred, occupying about 55% of the frame height, its base sitting slightly below centre. Flat solid bone #EFEDE9 background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte surfaces, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 4:3 landscape, 1600x1200.
```

**37 — containerclear-05-stencil-grid**
```
A conceptual still life photograph. A single thin steel stencil plate standing upright, a grid of eleven empty rectangular windows punched across it in two rows, no characters cut into it at all, centred, occupying about half the frame height, its base sitting slightly below centre. Flat solid forest #1F3D2F background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte brushed steel, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 1:1 square, 1400x1400.
```

**38 — containerclear-06-texture-corten**
```
A conceptual still life photograph. A single flat panel of weathered corten steel, its orange-brown oxide skin even and granular, one edge cut square, centred, occupying about 55% of the frame height, its base sitting slightly below centre. Flat solid bone #EFEDE9 background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte surfaces, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 16:9 landscape, 1920x1080.
```

**39 — containerclear-07-colour-strip-marking-tape**
```
A conceptual still life photograph. A single length of reflective freight marking tape laid out straight, banded in flat diagonal blocks of cobalt blue and bone white, one end curling slightly, centred, occupying about half the frame height, its base sitting slightly below centre. Flat solid ochre #C8862F background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Semi-matte surface, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 21:9 ultrawide, 2100x900.
```

**40 — containerclear-08-blank-dial**
```
A conceptual still life photograph. An extreme close crop of the finger-hole dial of a rotary telephone, the chrome ring behind it completely unmarked with no numerals or letters of any kind, centred, occupying about 55% of the frame height, its base sitting slightly below centre. Flat solid indigo #1C2340 background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte bakelite with one chrome highlight, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people, no numerals. Editorial product photography. 1:1 square, 1400x1400.
```

---

## 6 · GLEAN — 7 assets

"Verifies what was recovered, not what was paid." The whole group is weighing and waste:
the scale, a brass weight, a baled cube, a blank receipt pad. `projects.ts` says it is in
build and not yet carrying live material, so nothing here implies a running operation —
no yards, no trucks, no volumes.

| # | id | role | ground | ratio | concept |
| --- | --- | --- | --- | --- | --- |
| 1 | `glean-01-hero-can-scale.webp` | hero card | mint | 3:4 | A crushed aluminium can in the pan of a brass jeweller's scale |
| 2 | `glean-02-pan-rim.webp` | detail crop | bone | 1:1 | Macro where the crushed can meets the brass pan rim |
| 3 | `glean-03-brass-weight.webp` | portrait-of-an-object | mint | 1:1 | One brass calibration weight, unmarked |
| 4 | `glean-04-colour-strip-aluminium.webp` | colour strip | indigo | 21:9 | An aluminium ribbon, oxidised grey at one end, bright at the other |
| 5 | `glean-05-baled-cube.webp` | portrait-of-an-object | mint | 4:3 | One baled cube of crushed cans, steel-strapped |
| 6 | `glean-06-texture-foil.webp` | texture | ochre | 16:9 | A sheet of crumpled foil flattened out again |
| 7 | `glean-07-receipt-pad.webp` | diagram | forest | 3:4 | A perforated carbon receipt pad, blank, top leaf half torn |

### Prompts

**41 — glean-01-hero-can-scale**
```
A conceptual still life photograph. A single crushed aluminium drinks can, its printing scrubbed off to bare metal, resting in the pan of a small brass jeweller's balance, centred, occupying about half the frame height, its base sitting slightly below centre. Flat solid mint #CFE0D4 background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte brass and dull aluminium, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 3:4 portrait, 1200x1600.
```

**42 — glean-02-pan-rim**
```
A conceptual still life photograph. An extreme close crop of the rim of a brass scale pan with the crumpled edge of a bare aluminium can resting against it, both surfaces sharp, centred, occupying about 55% of the frame height, its base sitting slightly below centre. Flat solid bone #EFEDE9 background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte surfaces, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 1:1 square, 1400x1400.
```

**43 — glean-03-brass-weight**
```
A conceptual still life photograph. A single turned brass calibration weight with a knurled knob, standing upright, its body entirely unmarked and unstamped, centred, occupying about half the frame height, its base sitting slightly below centre. Flat solid mint #CFE0D4 background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte brass, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 1:1 square, 1400x1400.
```

**44 — glean-04-colour-strip-aluminium**
```
A conceptual still life photograph. A single long ribbon of flattened aluminium laid out straight, grey and oxidised at one end and stepping in flat bands to bright mill finish at the other, centred, occupying about half the frame height, its base sitting slightly below centre. Flat solid indigo #1C2340 background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Mostly matte metal, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 21:9 ultrawide, 2100x900.
```

**45 — glean-05-baled-cube**
```
A conceptual still life photograph. A single small baled cube of crushed aluminium cans bound with two steel straps, the compressed metal legible in its faces, all printing scrubbed away, centred, occupying about 55% of the frame height, its base sitting slightly below centre. Flat solid mint #CFE0D4 background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte dull metal, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 4:3 landscape, 1600x1200.
```

**46 — glean-06-texture-foil**
```
A conceptual still life photograph. A single sheet of aluminium foil that has been crumpled and then flattened out again, its creases holding soft light across the whole surface, centred, occupying about 55% of the frame height, its base sitting slightly below centre. Flat solid ochre #C8862F background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Low-sheen metal, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 16:9 landscape, 1920x1080.
```

**47 — glean-07-receipt-pad**
```
A conceptual still life photograph. A single perforated carbon receipt pad standing propped slightly open, its leaves blank and the top one half torn along the perforation, centred, occupying about half the frame height, its base sitting slightly below centre. Flat solid forest #1F3D2F background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte paper, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people, no printed rules or writing on the leaves. Editorial product photography. 3:4 portrait, 1200x1600.
```

---

## 7 · JINGO — 7 assets

Farm meets marketplace. §4's egg-and-barcode is the hero and the rest of the group is the
same collision in other materials: a pulp tray, a feed scoop, sack webbing, and a rubber
stamp with a blank face for "nothing reaches a buyer until it has been approved". The
barcode is bars only — no numerals, which is the one place this group can slip into text.

| # | id | role | ground | ratio | concept |
| --- | --- | --- | --- | --- | --- |
| 1 | `jingo-01-hero-egg-barcode.webp` | hero card | ochre | 3:4 | One brown egg with a barcode printed cleanly across its shell |
| 2 | `jingo-02-barcode-curve.webp` | detail crop | bone | 1:1 | Macro of the bars bending over the curve of the shell |
| 3 | `jingo-03-pulp-tray.webp` | portrait-of-an-object | ochre | 4:3 | One moulded pulp egg tray, empty |
| 4 | `jingo-04-feed-scoop.webp` | portrait-of-an-object | forest | 3:4 | A galvanised feed scoop, grain dust still in it |
| 5 | `jingo-05-colour-strip-webbing.webp` | colour strip | ochre | 21:9 | Woven polypropylene sack webbing, ochre and bone stripes |
| 6 | `jingo-06-texture-jute.webp` | texture | mint | 16:9 | A square of jute sack cloth, one frayed edge |
| 7 | `jingo-07-mark-blank-stamp.webp` | logo/mark | indigo | 1:1 | A wooden-handled rubber stamp, face blank, standing up |

### Prompts

**48 — jingo-01-hero-egg-barcode**
```
A conceptual still life photograph. A single brown hen's egg standing upright, a crisp black barcode of vertical bars printed cleanly across its shell and curving with it, no numerals anywhere, centred, occupying about half the frame height, its base sitting slightly below centre. Flat solid ochre #C8862F background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte shell, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 3:4 portrait, 1200x1600.
```

**49 — jingo-02-barcode-curve**
```
A conceptual still life photograph. An extreme close crop of printed black barcode bars running over the curved surface of a brown eggshell, the bars narrowing as the shell turns away, no numerals anywhere, centred, occupying about 55% of the frame height, its base sitting slightly below centre. Flat solid bone #EFEDE9 background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte shell, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 1:1 square, 1400x1400.
```

**50 — jingo-03-pulp-tray**
```
A conceptual still life photograph. A single moulded grey paper-pulp egg tray, completely empty, resting flat so its rows of cones read as a shallow relief, centred, occupying about 55% of the frame height, its base sitting slightly below centre. Flat solid ochre #C8862F background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte pulp, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 4:3 landscape, 1600x1200.
```

**51 — jingo-04-feed-scoop**
```
A conceptual still life photograph. A single galvanised metal feed scoop resting on its side, a little grain dust still caught in its throat, centred, occupying about half the frame height, its base sitting slightly below centre. Flat solid forest #1F3D2F background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte dull zinc, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 3:4 portrait, 1200x1600.
```

**52 — jingo-05-colour-strip-webbing**
```
A conceptual still life photograph. A single length of woven polypropylene sack webbing laid out straight, striped in flat bands of ochre and bone, its cut end heat-sealed, centred, occupying about half the frame height, its base sitting slightly below centre. Flat solid ochre #C8862F background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte surfaces, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 21:9 ultrawide, 2100x900.
```

**53 — jingo-06-texture-jute**
```
A conceptual still life photograph. A single square of coarse jute sack cloth lying flat, its open weave clear and one edge frayed into loose fibres, centred, occupying about 55% of the frame height, its base sitting slightly below centre. Flat solid mint #CFE0D4 background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte surfaces, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 16:9 landscape, 1920x1080.
```

**54 — jingo-07-mark-blank-stamp**
```
A conceptual still life photograph. A single wooden-handled rubber stamp standing upright on its rubber face tilted just enough to show that the face is entirely blank with nothing cut into it, centred, occupying about half the frame height, its base sitting slightly below centre. Flat solid indigo #1C2340 background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte wood and matte rubber, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 1:1 square, 1400x1400.
```

---

## 8 · NORAGAMI — 7 assets

The map plane, and §4 is explicit that this is the one card permitted a trace of text
because the map carries place names. **That licence applies to `noragami-01` only.** The
other six are blank paper, indigo dye, a compass with an unmarked dial, and a bookmark
clip for the saved-opportunities idea in `projects.ts`. Nora the AI chat gets no asset:
there is no honest object for it and a glowing orb would be exactly the vanity the motto
rules out.

| # | id | role | ground | ratio | concept |
| --- | --- | --- | --- | --- | --- |
| 1 | `noragami-01-hero-map-plane.webp` | hero card | indigo | 3:4 | A paper plane folded from a printed map of Africa, mid-flight |
| 2 | `noragami-02-wing-fold.webp` | detail crop | bone | 1:1 | Macro of the wing fold, blank cream paper |
| 3 | `noragami-03-crease-sheet.webp` | portrait-of-an-object | indigo | 4:3 | The plane unfolded again — one sheet, crease lines only |
| 4 | `noragami-04-colour-strip-resist.webp` | colour strip | mint | 21:9 | Indigo-dyed paper with bleached resist bands |
| 5 | `noragami-05-pocket-compass.webp` | portrait-of-an-object | indigo | 3:4 | A brass pocket compass, lid open, dial unmarked |
| 6 | `noragami-06-texture-washi.webp` | texture | forest | 16:9 | A sheet of indigo-dyed washi, fibres visible |
| 7 | `noragami-07-mark-bookmark-clip.webp` | logo/mark | ochre | 1:1 | A bookmark clip bent from a single brass wire |

### Prompts

**55 — noragami-01-hero-map-plane** *(place names permitted — §4)*
```
A conceptual still life photograph. A single paper plane folded from a printed paper map of the African continent, caught mid-flight, its shadow on the ground below it, the map's small place names legible on the folds and no other text of any kind, centred, occupying about half the frame height, its base sitting slightly below centre. Flat solid indigo #1C2340 background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte paper, shallow depth of field, muted realistic colour. Generous empty space above the object. No logos, no watermark, no people. Editorial product photography. 3:4 portrait, 1200x1600.
```

**56 — noragami-02-wing-fold**
```
A conceptual still life photograph. An extreme close crop of the folded wing of a paper plane made from blank cream paper, the crease sharp and the layered edges stacked, centred, occupying about 55% of the frame height, its base sitting slightly below centre. Flat solid bone #EFEDE9 background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte paper, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 1:1 square, 1400x1400.
```

**57 — noragami-03-crease-sheet**
```
A conceptual still life photograph. A single sheet of blank cream paper laid flat after being folded into a plane and opened out again, its crease lines catching the light as a pattern of angles, centred, occupying about 55% of the frame height, its base sitting slightly below centre. Flat solid indigo #1C2340 background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte paper, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 4:3 landscape, 1600x1200.
```

**58 — noragami-04-colour-strip-resist**
```
A conceptual still life photograph. A single long strip of indigo-dyed paper laid out straight, crossed by flat bleached resist bands stepping from deep indigo to pale, centred, occupying about half the frame height, its base sitting slightly below centre. Flat solid mint #CFE0D4 background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte paper, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 21:9 ultrawide, 2100x900.
```

**59 — noragami-05-pocket-compass**
```
A conceptual still life photograph. A single brass pocket compass with its lid hinged open, the dial inside entirely unmarked with no letters, numerals or graduations, only the needle, centred, occupying about half the frame height, its base sitting slightly below centre. Flat solid indigo #1C2340 background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte brass with one glass highlight, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 3:4 portrait, 1200x1600.
```

**60 — noragami-06-texture-washi**
```
A conceptual still life photograph. A single sheet of indigo-dyed washi paper lying flat, its long fibres visible through the dye and one deckle edge soft, centred, occupying about 55% of the frame height, its base sitting slightly below centre. Flat solid forest #1F3D2F background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte paper, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 16:9 landscape, 1920x1080.
```

**61 — noragami-07-mark-bookmark-clip**
```
A conceptual still life photograph. A single page-marker clip bent from one continuous length of brass wire, standing upright on a fold of blank cream paper it is holding, centred, occupying about half the frame height, its base sitting slightly below centre. Flat solid ochre #C8862F background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte brass and matte paper, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 1:1 square, 1400x1400.
```

---

## 9 · STUDIO-LEVEL — 6 assets

The plates that belong to the studio rather than to any project. Filename id is `studio`.

Two things to be deliberate about. First, **the mark is amber, literally** — raw resin, not
a letterform, because the studio has a flyer and no logo worth faking and a glyph
generated by Codex would be a logo this studio does not own. Second, **the About card's
object is a pair of brass dividers**, because `HOMEPAGE.md` §2 says the rare and true
thing is a marine engineer who builds software. Dividers are the one object that says that
without a caption. No portrait: the About card names one real person in HTML, and a
generated face would be the worst violation of the evidence rule in the whole file.

| # | id | role | ground | ratio | concept |
| --- | --- | --- | --- | --- | --- |
| 1 | `studio-01-mark-amber.webp` | logo/mark | bone | 1:1 | A rough cube of raw amber resin, light caught inside it |
| 2 | `studio-02-colour-strip-swatch-deck.webp` | colour strip | indigo | 21:9 | A fanned paint swatch deck, the nine palette grounds in order |
| 3 | `studio-03-type-specimen.webp` | type specimen | bone | 4:3 | One letterpress proof of the studio's mono and grotesque |
| 4 | `studio-04-ground-plate-paper.webp` | texture | ochre | 21:9 | A sheet of heavy bone cotton paper, one corner lifted |
| 5 | `studio-05-ground-plate-linen.webp` | texture | forest | 16:9 | A grey linen cloth laid flat, the weave even |
| 6 | `studio-06-about-dividers.webp` | portrait-of-an-object | deep rose | 3:4 | Worn brass marine dividers, standing open |

### Prompts

**62 — studio-01-mark-amber**
```
A conceptual still life photograph. A single rough-cut cube of raw amber resin standing on one face, light caught and held inside it so the body glows from within, centred, occupying about half the frame height, its base sitting slightly below centre. Flat solid bone #EFEDE9 background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Unpolished semi-matte resin, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 1:1 square, 1400x1400.
```

**63 — studio-02-colour-strip-swatch-deck**
```
A conceptual still life photograph. A single paint swatch fan deck opened out and laid flat, its blades showing nine flat colours in order — cobalt blue, amber, bone white, deep rose, forest green, dark indigo, ochre, pale mint, near-black — each blade entirely unprinted, centred, occupying about half the frame height, its base sitting slightly below centre. Flat solid indigo #1C2340 background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte card, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 21:9 ultrawide, 2100x900.
```

**64 — studio-03-type-specimen** *(letterforms permitted — this is a type specimen)*
```
A conceptual still life photograph. A single letterpress proof sheet lying flat, carrying one specimen setting in black ink on bone stock — a line of large grotesque capitals above two small lines of monospace — and nothing else, centred, occupying about 55% of the frame height, its base sitting slightly below centre. Flat solid bone #EFEDE9 background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte paper with visible ink bite, shallow depth of field, muted realistic colour. Generous empty space above the object. No logos, no watermark, no people. Editorial product photography. 4:3 landscape, 1600x1200.
```

**65 — studio-04-ground-plate-paper**
```
A conceptual still life photograph. A single sheet of heavy bone-white cotton paper lying flat, its tooth even across the surface and one corner lifted just clear of the ground, centred, occupying about 55% of the frame height, its base sitting slightly below centre. Flat solid ochre #C8862F background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte paper, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 21:9 ultrawide, 2100x900.
```

**66 — studio-05-ground-plate-linen**
```
A conceptual still life photograph. A single piece of grey linen cloth laid flat and smoothed, its weave even and one selvedge edge visible, centred, occupying about 55% of the frame height, its base sitting slightly below centre. Flat solid forest #1F3D2F background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte surfaces, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 16:9 landscape, 1920x1080.
```

**67 — studio-06-about-dividers**
```
A conceptual still life photograph. A single pair of worn brass draughtsman's dividers standing open on their two points, the metal darkened by handling, centred, occupying about half the frame height, its base sitting slightly below centre. Flat solid deep rose #8C2F3B background, edge to edge, no gradient and no vignette. Single soft light source from the upper left casting one soft contact shadow down and to the right. Camera straight on, slightly above, no tilt. Matte patinated brass, shallow depth of field, muted realistic colour. Generous empty space above the object. No text, no logos, no watermark, no people. Editorial product photography. 3:4 portrait, 1200x1600.
```

---

## Checklist

Tick when generated, picked from four variants, and checked in its group.

**Pass 1 — heroes (9).** Do not start pass 2 until all nine are side by side.

- [ ] 1 · needbe-01-hero-envelope-door
- [ ] 10 · continuum-01-hero-curling-page
- [ ] 19 · tandohstay-01-hero-bulb-linen
- [ ] 28 · system-guardian-01-hero-wheel-radar
- [ ] 33 · containerclear-01-hero-handset-chain
- [ ] 41 · glean-01-hero-can-scale
- [ ] 48 · jingo-01-hero-egg-barcode
- [ ] 55 · noragami-01-hero-map-plane
- [ ] 62 · studio-01-mark-amber
- [ ] **Set check:** light from upper-left on all nine, one shadow each, no repeated ground

**Pass 2 — plates (22).** Colour strips, textures, type specimens, ground plates.

- [ ] 4 · needbe-04-colour-strip-tape
- [ ] 7 · needbe-07-texture-kraft
- [ ] 12 · continuum-03-type-specimen
- [ ] 13 · continuum-04-colour-strip-concertina
- [ ] 15 · continuum-06-texture-laid-paper
- [ ] 23 · tandohstay-05-colour-strip-jacquard
- [ ] 26 · tandohstay-08-texture-plaster
- [ ] 31 · system-guardian-04-texture-scanlines
- [ ] 32 · system-guardian-05-paper-tape
- [ ] 38 · containerclear-06-texture-corten
- [ ] 39 · containerclear-07-colour-strip-marking-tape
- [ ] 44 · glean-04-colour-strip-aluminium
- [ ] 46 · glean-06-texture-foil
- [ ] 52 · jingo-05-colour-strip-webbing
- [ ] 53 · jingo-06-texture-jute
- [ ] 58 · noragami-04-colour-strip-resist
- [ ] 60 · noragami-06-texture-washi
- [ ] 63 · studio-02-colour-strip-swatch-deck
- [ ] 64 · studio-03-type-specimen
- [ ] 65 · studio-04-ground-plate-paper
- [ ] 66 · studio-05-ground-plate-linen
- [ ] 67 · studio-06-about-dividers

**Pass 3 — details, marks, objects (36).** By group, judged by group.

- [ ] needbe: 2 · 3 · 5 · 6 · 8 · 9
- [ ] continuum: 11 · 14 · 16 · 17 · 18
- [ ] tandohstay: 20 · 21 · 22 · 24 · 25 · 27
- [ ] system-guardian: 29 · 30
- [ ] containerclear: 34 · 35 · 36 · 37 · 40
- [ ] glean: 42 · 43 · 45 · 47
- [ ] jingo: 49 · 50 · 51 · 54
- [ ] noragami: 56 · 57 · 59 · 61

**Final gates, before any of this goes on the canvas.**

- [ ] Cobalt appears exactly once in 67 images, on `containerclear-01`
- [ ] Amber appears only as object colour on `system-guardian`, never as a ground
- [ ] Scan lines and phosphor glow appear only in the five `system-guardian` prompts
- [ ] Text appears only on `noragami-01`, `continuum-03` and `studio-03`
- [ ] No asset shows a client, a person, a logo, a testimonial, a metric, or a working screen
- [ ] No two adjacent cards in any project group share a ground
- [ ] Every file is `.webp`, named `{project-id}-{nn}-{slug}.webp`, in `studio/public/cards/`

### One note back to the brief

The brief says six of eight projects carry `omitImage: true`. `projects.ts` as it stands
sets it on three — needbe, continuum, tandohstay — and the other five point at a favicon
or a mark rather than a screenshot. Either way the conclusion is the same and this work
order assumes the stricter reading: **there are no product screenshots behind this site,
so none are specified.** If real screens get shot later they replace assets wholesale
rather than sitting beside them, exactly as `ART-DIRECTION.md` §6 says of the
photographed route.
