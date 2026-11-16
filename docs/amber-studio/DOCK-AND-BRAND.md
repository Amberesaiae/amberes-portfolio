# The dock, and what else the brand needs

Two things, written together because they turn out to be the same thing: on a Mac, the
dock icons are the most-looked-at brand surface there is.

---

# Part 1 — The dock

## What you have

`layers/Dock.tsx` + `DockItem.tsx` are already further along than Garaje's. You have a
running-state dot, always-visible labels (a deliberate choice, correctly argued in the
comment — touch has no hover), a per-item context menu, scroll-edge fades, and safe-area
padding. Keep all of it.

What's missing is the one thing that makes a dock read as *the* dock:

```tsx
whileHover={{ y: -4, scale: 1.06 }}
```

That's an **independent hover**. Each icon reacts only to itself. macOS magnification is a
**field effect** — the cursor has a radius of influence and every icon inside it scales by
its distance from the pointer. That difference is the whole feel. You can't get there by
tuning the numbers on `whileHover`.

## The magnification, properly

Three parts, and most implementations get the third one wrong.

**1. Distance → scale.** For pointer `x` and each item centre `cᵢ`:

```
d  = |x − cᵢ|
t  = clamp(d / R, 0, 1)            R ≈ 2.5 × base item width
f  = 0.5 × (1 + cos(π × t))        raised cosine — 1 at the pointer, 0 at the edge
scaleᵢ = 1 + (MAX − 1) × f
```

Use the raised cosine, not a linear falloff and not `cos(t·π/2)`. It's smooth at **both**
ends, so icons don't visibly "pop" as the cursor crosses the influence boundary. Suggested:
base 56px, MAX 1.7 (≈96px), R 140px.

**2. Grow upward.** `transform-origin: bottom center`, and the row is `items-end` — which
yours already is. Icons rise out of the dock; they don't inflate through its floor.

**3. Re-layout, don't just scale.** This is the part that's usually broken. If you only
scale, neighbours overlap and the row's width jumps. The row has to be laid out from the
scaled widths:

```
widthᵢ  = base × scaleᵢ
offsetᵢ = Σ widthⱼ for j < i       then shift the whole row so it stays centred
```

Each item gets a `translateX` as well as a `scale`. Without this the dock wobbles and
everyone can tell, even if they can't say why.

**Performance.** Do not put pointer position in React state — that's a re-render per
mousemove across every item. You already have framer-motion: one `useMotionValue` for
pointer x on the `<nav>`, and `useTransform` per item. No re-renders, compositor-only.

Also: ease the pointer value itself with a spring (`stiffness ~400, damping ~30`) so fast
cursor movement doesn't make the row snap.

## Touch — and this is the interesting half

**Do not port magnification to touch.** There's no hover; a finger either isn't there or
has already committed. Faking it with tap-scale is the uncanny-valley version.

The honest translation is **drag-along**:

> Press anywhere on the dock and slide your thumb across it. The icon under your thumb
> magnifies and its label lifts. Release to open that one. Slide off the dock to cancel.

This is genuinely better than tapping on a phone, because it makes the dock usable without
looking precisely, and it's the same mental model as magnification — *the thing under the
pointer grows* — expressed in the input device you actually have. Same `useMotionValue`,
driven by `pointermove` instead of `mousemove`.

Everything else on mobile stays as you have it: labels always on, no scroll, safe-area
inset.

## What goes in it

Seven is too many, and `Legal` in a dock is wrong — nobody docks their terms of service.

macOS splits the dock with a separator: **applications** on the left, **folders and stacks**
on the right. Use that.

```
┌──────────────────────────────────────────────┐
│  Work   About   Talk  │  Terminal  Reel  Games │  Archive │
│   ●                   │                        │          │
└──────────────────────────────────────────────┘
      the pitch          the proof you build      the stack
```

- **Left — the pitch.** Work, About, Talk. What a client came for.
- **Right — the evidence.** Terminal, Reel, Games. These exist to prove the site isn't a
  costume: a real shell, a real player, real games. They earn their place by working.
- **Far right — the stack.** `Archive` as a macOS-style stack: click-and-hold and it fans
  out. Old work, experiments, `SYSTEM_GUARDIAN_v1`, `README.txt`.
- **Legal** moves to the menubar, under an "Amber Studio" menu, which is where the  menu
  lives on a Mac. Correct and it frees a slot.

**Mobile: four, like an iPhone.** `Work · About · Talk · More`, where More is the same
stack component fanning out the rest. Seven icons on a phone dock is a scroll nobody
discovers; four is the platform convention for a reason.

## Work as a stack — the bit worth stealing

macOS stacks fan into **fan**, **grid**, or **list**. You have nine projects and a
coverflow you want to build.

Click-and-hold **Work** → the projects fan out of the dock. Keep holding / drag up → the fan
becomes the Exposé coverflow from `HOMEPAGE.md` §5.

Same gesture macOS already teaches, and it means the coverflow has a home in the dock as
well as on the desk. One component, two entry points.

## Icons are a brand asset, not a utility

You currently use `FolderGlyph` for everything except Talk. That's consistent, which is
right, but it's generic.

Given the photographed-desk direction in `HOMEPAGE.md` §3, the dock icons should be
**photographed objects on a squircle**, shot in the same session as everything else:

| Dock item | Object |
| --- | --- |
| Work | a short stack of printed pages, slightly squared up |
| About | the portrait, cropped square |
| Talk | a desk telephone, or a mic |
| Terminal | a keyboard, top-down, raking light |
| Reel | film can or a lens |
| Games | dice |
| Archive | a cardboard box, lid ajar |

Rules that make a set read as one family: identical camera height, one light direction,
the same squircle mask, the same drop shadow, one background tone. Get those four right and
mismatched objects still look like a system.

This is the cheapest brand win available and it doubles as part of the Phase 0 shoot.

---

# Part 2 — The brand

## You're right about the flyer, with one caveat

> "The flyer tells what I can do, projects actually tell what I've done."

Correct, and it's the better instinct. Projects are evidence; a services list is a claim.
Lead with evidence. I'd drop the `services` export rather than fix it.

**The caveat:** evidence only covers what you've shown. Someone who needs a school
management system and sees nine projects — none of which is one — does not conclude "he can
do that." They conclude "he hasn't."

So don't bring back a services page. Do two smaller things:

1. **Each project names the capability it proves.** ContainerClear proves operations
   tooling and telephony integration. Jingo proves marketplaces and moderation. Glean proves
   edge architecture and multi-role systems. One line per project, in the Get Info panel.
2. **One honest sentence about range**, in About, not a list: *"Most of the work is
   operations systems, marketplaces and the websites around them. If it runs a business, it's
   probably in scope."*

That covers the gap without claiming a catalogue.

And per `PHASE0-NUMBERS.md` decision C — the school and business management systems are on
your flyer as things you sell with no project behind them. If there *is* shipped work
there, that's the most on-motto thing you own and it's currently invisible.

## The position I'd build the brand on

You already have it, written in your own project data, and you haven't noticed it's a
position:

- TandohStay ships **silent-genset backup power** as a guest-facing feature.
- NeedBe is **optimised for low-bandwidth connections common in target regions**.
- Jingo is a **controlled pilot** in Ghana, for livestock and feed sellers.
- Glean coordinates **material recovery** between households and collectors.

That is not a portfolio of websites. That is a studio that builds software for conditions
most software assumes away — intermittent power, expensive data, users on cheap Android
phones, businesses that still run on phone calls and paper.

> **Software that works when the power doesn't.**

A studio in London cannot say that. You can, and you can prove every word of it from work
you've already shipped. That is what "breaking barriers" looks like when it's true rather
than aspirational — and it sits exactly underneath "engineering real-world solutions."

Lean in rather than sanding it off. Accra is not a detail to get past; it's the expertise.

## Five gaps, ranked

**1. There is nothing to read.** This is the biggest hole. The site has no point of view —
nothing that isn't about a specific project. A studio with a motto has to have said
something, or the motto is decoration. Three short pieces is enough:

- *What marine engineering taught me about shipping software* — the ownable one. Nobody
  else can write it.
- *Designing for 2G* — the Accra position, made concrete.
- *Why the phone call is still the integration* — ContainerClear's actual thesis.

Put them in a `NOTES/` folder on the desk. Three is a body of work; one is a blog nobody
updated.

**2. No free thing with your name on it.** On Royden's site the most memorable item isn't a
case study — it's **Joiner**, "a small tool for HUGE collages", free. A small useful tool is
the highest-leverage asset a one-person studio can make: it gets passed around, it proves
competence without a pitch, and it works while you sleep.

Make it Ghana-specific so it can't be commoditised. A Ghana Post GPS address component. A
mobile-money fee calculator. A "will this load on 2G" checker you point at a URL. The last
one is on-brand to the point of being a mission statement you can run.

**3. No stated way to work with you.** Every studio has a contact form; the barrier is the
awkward first email — people don't know what to ask for, what it costs, or how long it
takes. Saying it plainly is a real barrier removed:

> Engagements: a build, an audit, or a month. Typical project 4–8 weeks. Budgets start
> around X. Accra time, GMT, replies within a day.

Being specific about money is the single most trust-building thing a small studio can do
and almost nobody does it.

**4. The process is invisible.** Three projects are `in-progress` and the site treats that
as a weakness to label. Invert it: a `WORKING/` folder with in-progress shots, what shipped
this week, what broke. Studios that show the middle get trusted more than studios that only
show finished things — and you've got a terminal on the desk that could print the last ten
commits for real.

**5. The mark isn't a system.** The flyer has the amber burst and the cobalt/gold pair, but
the site doesn't carry them. Needed, and all of it falls out of the Phase 0 shoot: favicon,
OG image (every link anyone shares), the dock icon family above, and the loading mark for
the film.

## What I would not do

- **No testimonials.** Three quotes from clients of a studio of one reads thin. The work is
  the testimonial; if you want social proof, show the live URLs, which you already do.
- **No "our process" diagram.** Discover → Design → Build → Launch. Every agency has it and
  nobody reads it. The `WORKING/` folder is the same claim, demonstrated.
- **No fake team.** Covered in `HOMEPAGE.md` §2, repeated here because it's the one
  mistake that can't be undone once a client has seen it.

---

## Order I'd do it in

1. Dock magnification + drag-along touch (a day; it's the most-touched control on the site)
2. Dock contents: 7 → 3 + 3 + stack, Legal to the menubar
3. Photographed icon set, in the Phase 0 shoot
4. The positioning line and the About range sentence — free, just words
5. `NOTES/` with the marine-engineering piece
6. The free tool, when there's room
