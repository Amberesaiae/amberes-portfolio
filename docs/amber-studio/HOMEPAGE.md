# Amber Studio — the homepage

What it is, what goes on it, what we keep from Garaje, what we throw away.

Written 2026-11-16, after the intro teardown. Opinionated on purpose — argue with it.

> **Engineering real-world solutions.**

---

## 1. Start with the motto, because it decides everything else

Most portfolio mottos are decoration. This one isn't, and it is the most useful thing in
this whole document, because it is **falsifiable**. A studio that says "engineering
real-world solutions" can be checked against its own site in about four seconds.

Check the current site against it:

- Six of nine projects have no screenshot. `omitImage: true`, a favicon on a grey square.
- The metrics are technical vanity: *"7+ pages shipped"*, *"99 Lighthouse Score"*,
  *"Mobile-first architecture"*. None of those is a real-world outcome. A Lighthouse score
  is not a solution to anything; it is a number about a number.
- The mobile home screen currently leads with a **birthday countdown**.

So the motto is already indicting the site. That is not a criticism of the work — the work
is real. NeedBe Foundation is a Ghanaian NGO doing menstrual-health education. TandohStay
is a live booking business. School management systems and business management systems are
on the flyer. **These are literally real-world solutions.** The site just doesn't say so.

Everything below follows from closing that gap.

---

## 2. Studio or person — DECIDED 2026-11-16

**A studio of one. "We" is the voice, not a headcount claim.**

Those are not in conflict, and the distinction is the whole rule:

- **"We" is fine as a register.** "We design and build digital experiences and systems that
  work" (the flyer) is studio voice. Nobody is deceived by studio voice; it reads as the
  business speaking rather than the person, which is exactly what it is. Use it in copy,
  CTAs, services and project write-ups.
- **Never claim a team.** No "our team of designers", no "our engineers", no headcount, no
  invented collaborator names, no team page with stock portraits. The moment "we" implies
  *people*, it stops being voice and starts being a lie — and it's the kind that collapses
  on the first call.
- **About names one person, plainly.** Lamptey Odartei Isaiah. Marine engineer, then
  software. That page drops the "we" and says "I".
- **Credit real collaborators by name** when there are any. A studio of one that brings in
  a photographer or a second dev on a job should say so — that's a strength, not a dilution.

The practical test for any sentence: *could a client read this and form a wrong belief
about who will be doing the work?* "We build school management systems" — no. "Our team
handles design and engineering in parallel" — yes, cut it.

---

### The positioning that follows

`config/identity.ts` says *Lamptey Odartei Isaiah · Engineer · Software Engineer · Builder
of Worlds*. The flyer says *AMBER STUDIO · we design and build*. The About window's hint
says *marine engineer who builds software*.

**Take the studio name, speak as "we", keep the one person findable.**

A studio voice that never claims a team costs nothing and reads as a business. What would
cost credibility is a *pretend agency* — plural people who don't exist — and the rule above
rules that out. A named studio with one named engineer behind it is both more memorable
than another personal portfolio and more trustworthy than an invented team.

And the thing that actually makes this stand out is already in that About hint and is
currently buried: **a marine engineer who builds software.** That is not a positioning
exercise, it is true, and it is rare. "Engineering real-world solutions" from someone who
has worked on real engines in the real world is a different sentence from the same words
on a bootcamp portfolio.

So:

```
AMBER STUDIO
Engineering real-world solutions.
Accra, Ghana. One engineer — marine, then software.
```

That is the whole positioning. It should be legible within five seconds of the film ending.

---

## 3. The one ownable idea

> The desk is not a visual metaphor. The desk is the argument.

Every desktop-OS portfolio on the internet uses an abstract gradient wallpaper, glassy
windows and neon. The genre is crowded and it all looks the same, because it is all
*simulating* a computer.

Ours should be a **photograph of a real desk**, shot top-down in Accra, with real objects
on it, real daylight, real shadows. The project "icons" are physical things lying on that
surface — a printed page, a phone running the app, a notebook, a caliper. Windows are white
paper plates that lie *on* the desk with proper contact shadows, not floating glass.

This is the Royden lesson from the intro teardown, applied to the Garaje structure:

| | Garaje gives us | Royden gives us | Amber gets |
| --- | --- | --- | --- |
| Structure | desktop, files, dock, windows | — | the spatial layout |
| Art direction | abstract 3D renders | **photograph the work as a real object** | the photography |
| Entry | loader + marquee | **the film** | a title sequence |

And it is the motto, drawn instead of written. A studio claiming real-world engineering
whose site is made of photographs of real things is **congruent**. A studio claiming it
with a purple gradient is not. This congruence is the differentiator — not the fact that
it's a desktop.

The flyer's halftone treatment belongs here too: halftone is a *printing press* artefact.
Physical. Use it for photography throughout.

---

## 4. The homepage, concretely

### Desktop (≥1024px)

```
┌──────────────────────────────────────────────────────────────────────┐
│ AMBER STUDIO ◆          Work Reel About Talk        ● Open · 14:32 GMT│  menubar 48px
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   NEEDBE.site            ┌───────────────────────┐      ◷ Accra      │
│   [printed page]         │                       │      14:32        │
│                          │   THE PLATE           │      ● Taking work│
│        TANDOHSTAY.app    │   one featured        │                   │
│        [phone, flat-lay] │   project, printed,   │      NOW BUILDING │
│                          │   lying on the desk,  │      Glean · Jingo │
│   CONTINUUM.mag          │   rotated ~4°         │                   │
│   [print]                │                       │                   │
│                          └───────────────────────┘      ARCHIVE/     │
│   README.txt                                            MYSTERY/     │
│                   Amber Studio — Accra                               │
│              Engineering real-world solutions.                       │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│         [ Work  Reel  About  Talk  Terminal  Games ]                 │  dock 96px
└──────────────────────────────────────────────────────────────────────┘
```

The things that matter in that sketch:

1. **There is a focal point.** Garaje's desk is twelve equal icons and a giant centre
   artwork that is decoration. Ours has **one hero plate** showing current work. A studio
   homepage with no hierarchy is a mood board. Rotate it a few degrees so it reads as an
   object placed there, not a div.
2. **The motto is set on the desk itself**, small, mono, like something printed on the
   surface. Not a 90px hero headline. The restraint is the point — loud type on a
   photographed desk fights the photograph.
3. **The right edge is instruments, not decoration**: Accra time, availability, what's
   being built this week. Business signals. These say a person is at this desk today.
4. **Nine projects + README + ARCHIVE + MYSTERY** ≈ fifteen objects. A full desk, not a
   sparse one. Sparse reads as "I haven't done much."

### Mobile

Do not shrink the desk. A desktop metaphor on a phone is always a lie, and the current
mobile layout already half-admits this (`Desktop.tsx` renders a separate non-scrolling
column).

**On mobile, the coverflow from your video *is* the home screen.**

```
AMBER STUDIO              14:32 ● 
Engineering real-world solutions.

      ╱│  ┌──────┐  │╲
     ╱ │  │      │  │ ╲         ← 3D rail, flickable
    │  │  │ card │  │  │
     ╲ │  │      │  │ ╱
      ╲│  └──────┘  │╱

         TANDOHSTAY
         2025–2026 · shipped

[ Work  Reel  About  Talk ]
```

One thing, done well, thumb-driven. The spec is in `PLAN.md` §4.

---

## 5. The coverflow is a *mode*, not a widget

This is the idea I'd most want you to take from this document.

Don't bolt the coverflow on as another plate. Make it the desk's **Exposé** — the macOS
Mission Control gesture, which is already part of the vocabulary we're borrowing.

Hit `Space`, or click WORK, and every project object **lifts off the desk and flies into
the 3D rail from your video.** Flick through, hit `Escape`, and they fly back down to their
places on the desk.

Why this is right and not just clever:

- It makes the coverflow **native to the metaphor** instead of a carousel someone dropped
  on a desktop.
- It solves the hierarchy problem without removing the scatter — browse mode and ambient
  mode become different states of the same objects.
- It is the **same component on mobile**, where it's the permanent home state rather than a
  mode. One implementation, two uses.
- It gives you a genuine "oh —" moment at second three, which is what you asked for when
  you said you want it to stand out.

The transition is a FLIP animation: measure each icon's position on the desk, measure its
slot on the rail, interpolate transforms. ~80 lines, no library.

---

## 6. Features: keep, drop, add

### Keep from Garaje

| Feature | Why |
| --- | --- |
| Loader → **replaced by the film** | see `INTRO-TEARDOWN.md`; this is the main reason to rebuild on the clone |
| Draggable file icons with press-scale | the single most convincing behaviour on the site |
| Finder window (name / modified / format) | the modification-date column is the most believable detail Garaje has |
| macOS windows, traffic lights, cascade, Escape | solved; don't re-solve |
| Marquee drag-selection | cheap, delightful, nobody expects it |
| Gravity toggle | keep, but see below |
| Idle screensaver | keep at 50s, reduced-motion aware |

### Drop from Garaje

| Feature | Why |
| --- | --- |
| Music player / Deezer worker | it's Garaje's worker and we have no playlist |
| Timed notification popups | they read as ads and they push a CTA at people who didn't ask |
| Speakers overlay | no speakers |
| Mystery easter-egg choreography | keep the folder, bin the bespoke 4-step teleport — point it at the Games instead |

### Keep from the current Amber app — **do not throw these away**

The migration's biggest risk is losing these. Garaje has none of them, and they are the
things that make the site yours rather than a reskin.

| Feature | Note |
| --- | --- |
| **The terminal** (`terminal/Shell.ts`, command registry, completion, history) | a *real* shell. This is the best thing in the codebase. |
| Games — Tetris, Minesweeper | genuinely playable, not a gag |
| Talk pane with speech in/out | nobody else has this |
| Reel player + queue | if the films stay (see §9) |
| Window resize handles | Garaje's windows can't resize. Ours can. |
| Persisted widget/window positions | the foundation for §7 |
| Context menus, theme switching | already done, already good |

### Add — the improvements on Garaje

1. **Exposé → coverflow** (§5). The headline feature.
2. **One command registry, three surfaces.** The terminal already has a command registry.
   Make the **dock**, a **⌘K palette**, and the **terminal** all read from that one
   registry. Then the Terminal window's existing hint — *"Drive the whole site by
   keyboard"* — becomes literally true, and every new feature shows up in all three
   surfaces for free. This is an architecture decision, not a feature, and it is the kind
   of thing an engineering studio should be able to point at.
3. **The desk remembers you.** Positions already persist. Extend it: on a second visit the
   desk is how you left it, and the menubar says so quietly — *"welcome back, you left Work
   open."* Twenty lines, disproportionate payoff, and no one else in the genre does it.
4. **"Get Info" panels.** `projects.ts` already has a `spec` field — architecture,
   deployment, performance, role. Surface it as a Finder-style Get Info panel (`⌘I`).
   Evidence, presented as system metadata. Perfectly on-motto.
5. **Live availability.** Accra time, open/closed for work, what's shipping this week.
   `useAccraClock`, `ContactAvailability` and `SystemStatus` already exist — they're just
   not on the home screen.
6. **Calm mode.** A menubar toggle that stops the grain, the screensaver, the loops. The
   genre is exhausting and an escape hatch is a maturity signal. Wire
   `prefers-reduced-motion` to it by default.
7. **Real keyboard + focus management.** Garaje's windows are mouse-only. Tab order, focus
   traps, `aria-*`, a visible focus ring. A desktop-OS site is usually an accessibility
   disaster; shipping one that isn't is a thing a studio can legitimately boast about.
8. **Rename Gravity.** "Gravity" is Garaje's joke. Ours is `TIDY` / `SCATTER` — tidy snaps
   everything to a grid, scatter drops it with Matter.js. Same physics, now it does
   something useful half the time.

---

## 7. The content fix — consequence, not stack

This is the other half of "engineering real-world solutions", and it's a copy change, not
a code change.

Current metrics read like a CV:

> 7+ pages shipped · Mobile-first architecture · Donation flow integrated
> 99 Lighthouse Score · React + Vite · Vercel Edge

Rewrite every one of them as **what changed in the world**:

> Donations accepted from 4 countries · Volunteer signups running since Aug 2024
> Runs on a 2G connection in rural Ghana · Replaced a paper attendance register

Keep the stack — put it in the Get Info panel (§6.4) where an engineer who cares can find
it. Lead with consequence. For in-progress work with no outcome yet, say what it's *for*,
not what it's built with.

Also, per `PLAN.md` §0: every object needs a **real modification date**. The Finder column
is wasted on `2025 – 2026`.

---

## 8. What will actually make it stand out

Honestly? Not the fact that it's a desktop. That genre is full. Four things will:

1. **The photography.** Nobody else in this genre photographs their work as physical
   objects. It is also the cheapest item on this list — one afternoon, a printer, a phone,
   a dark table and a window.
2. **Everything on it actually works.** A real shell, real games, a real player, a real
   chat. Most OS-portfolios are a wallpaper and three fake windows. Ours isn't, and that is
   itself a demonstration of the motto.
3. **The film.** A proper title sequence, three seconds, skippable. Covered in
   `INTRO-TEARDOWN.md`.
4. **Accra.** A studio that is unmistakably from somewhere specific is more memorable than
   one from nowhere. The clock, the language, the projects, the 2G-connection constraint —
   lean into it rather than sanding it off. This is free differentiation and you already
   have the components built.

---

## 9. Open, and I'd push for a decision before Phase 1

1. **The reel.** Seven films credited to other filmmakers (`data/reel.ts` — The Pen, Seen,
   Runaway…) with `role` left blank. On a studio desk, unlabelled, they read as work you
   claim. Either fill in the `role` field for each and keep them, or move them behind
   ARCHIVE/. The ambiguity is the only thing on the site that could cost you trust.
2. **The birthday countdown.** Currently the lead element on mobile. It's charming and it's
   the single thing most likely to make a prospective client file this as a hobby. Move it
   into About, or make it a terminal easter egg.
3. **Services.** The flyer lists six (web, UI/UX, e-commerce, custom software, school
   management, business management). Do they become an object on the desk — `SERVICES.txt`
   — or does the work speak for itself? I lean toward a plain text file, because a studio
   with a motto about solutions should say what it sells.
4. **Domain.** `amberesaiae.space` on the flyer vs. whatever this currently deploys to.

---

## 10. Build order

Phases 0–6 in `PLAN.md` still hold, with these slotted in:

- **Phase 0** gains the photo shoot (§3) and the copy rewrite (§7). Still first. Still the
  thing that unblocks everything.
- **Phase 2** (CoverFlow) becomes Exposé mode (§5) rather than a widget.
- **Phase 3** gains the command registry refactor (§6.2) — do it while porting the dock,
  not after.
- A new **Phase 3.5**: persistence + Get Info + live availability (§6.3–6.5). Small, and
  it's where the desk starts feeling inhabited.
