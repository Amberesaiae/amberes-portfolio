# Next build: panel, work grid, dock, assistant

**Status:** spec, nothing built yet
**Date:** 2026-09-15

Four separate pieces. Three are straightforward and I would build them today. The
fourth — the assistant — is the one that needs decisions from you before a line
of it is worth writing, because it is the only part that costs money, needs a
server, and can say something untrue about you.

---

## 1. Top bar becomes a system panel

Right now the bar is a name, a window list, "Tidy up", a theme toggle and a
clock. The Linux-panel version keeps that shape and fills out the two ends.

```
┌──────────────────────────────────────────────────────────────────────┐
│ ▸ amber ▾    work  reel  terminal        🎙 ◐ ♪ ✨   Tue 15 · 14:52 ▾ │
└──────────────────────────────────────────────────────────────────────┘
  └ app menu   └ open windows            └ tray      └ clock + calendar
```

**Left — app menu.** Clicking `amber` opens a dropdown instead of clearing the
desktop: every folder by name, then Tidy up, then Close all. This is how someone
who does not realise the folders are clickable finds their way in, and it makes
the whole site reachable from one control.

**Middle — open windows.** Unchanged.

**Right — the tray.** Icon-only, 24px, each one a real toggle rather than
decoration:

| | | |
|---|---|---|
| 🎙 | Assistant | opens the assistant; the icon shows listening / thinking / idle |
| ◐ | Theme | light / dark / system (system is currently hidden — the tray exposes it) |
| ♪ | Sound | mutes the reel. Currently there is no global mute at all |
| ✨ | Effects | turns the beam, gooey and shimmer off by hand — today only the OS can |

**Clock.** Becomes a button: date and Accra time, opening a small calendar and a
"local time for you / local time for me" pair, which is the useful thing on a
portfolio belonging to someone in GMT working with people who are not.

All of it is `DropdownMenu` and `Popover`, both already installed. Two new
components, no new dependency.

---

## 2. Work becomes a three-up card grid

Rows were the right call when there was nothing to show. Now that every project
has real screenshots in `public/images` — with avif and webp variants already
generated — cards are strictly better.

**The card.** Image at 16:10, title, `year · category`, status dot. Nothing else;
the card is a door, not a summary.

**The grid.** Three across, but keyed off *the window's* width, not the
viewport — a window can be dragged narrow at any screen size, so this uses
container queries:

| Window width | Columns |
|---|---|
| ≥ 900px | 3 |
| 620–899px | 2 |
| < 620px | 1 |

**The click.** The card pushes a detail *view* inside the same window, with a
back arrow in the pane header — not an accordion, not a modal, not a new window.
One window, two levels. The detail is what is already built (gallery, problem,
what I built, metrics, spec sheet, stack, links), just no longer squeezed under
a row.

The URL follows: `#/work` is the grid, `#/work/needbe` is the detail, so a
project is linkable and the back button behaves.

---

## 3. The dock stays video

Cleared up: the bottom strip keeps the films. The "queue for images like the
works have" is the Work grid in §2 — images get a queue, it is just not at the
bottom of the screen, because that is where the videos live.

So the dock is unchanged except for one thing: it currently starts at the left
edge and is centred on desktop. The assistant bar (§4) needs the same band of
screen, so the two share it:

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   ┌──────────────────────────────────┐                       │
│   │ 🎙  Ask about my work…           │   ← assistant bar     │
│   └──────────────────────────────────┘                       │
│   [▸][▸][▸][▸][▸][▸][▸]                  ← film dock         │
└──────────────────────────────────────────────────────────────┘
```

Assistant bar above, films below, both centred, both pinned to the bottom. The
films keep their current behaviour: hover lifts, click opens the Reel, and they
pause while the Reel window is open.

---

## 4. The assistant

This is the ambitious one, and I want to separate what is easy from what is not.

### What you described

- a mic on the desktop, obvious, not hidden in a folder
- press it, speak, and what you said becomes text
- an AI that talks back — helps a visitor say what they want
- it should sound like you

### What is actually easy

**Speech in.** The browser's own `SpeechRecognition` is free, needs no server and
no key. It works in Chrome, Edge and Safari; **it does not work in Firefox at
all**, so a typed input has to sit beside it regardless — which is fine, because
some people will not speak to a website in an office.

**Speech out.** `speechSynthesis` is free and everywhere. It sounds like a
sat-nav. Good enough to be a feature, not good enough to be *your voice*. Off by
default, on via the tray.

### What is not easy

**The brain needs a server and a budget.** An API key cannot live in the browser
— anyone can read it and spend your money. This has to be a serverless function
next to the contact form you already have:

```
api/contact.ts   ← exists
api/chat.ts      ← new: takes the conversation, calls the model, returns the reply
```

Vercel runs it, the key lives in a Vercel environment variable, and the browser
never sees it. Roughly: a few hundred conversations a month on a small model is
single-digit dollars. Unrated and unlimited, a bored person with a script can
run that up fast — so it needs a per-IP rate limit and a hard token cap from day
one, not later.

**It has to be grounded, or it will lie about you.** A general chatbot asked
"has amber worked with Kubernetes?" will happily say yes. The fix is that it is
given nothing but your own data — `projects.ts`, `aboutData.ts`, `reel.ts`,
serialised into its system prompt at build time — and instructed to say "that is
not something on his site, ask him directly" when the answer is not in there.
Scoped like that it is genuinely useful: *"which of these used Postgres"*,
*"what did he do at the shipyard"*, *"is he available for contract work"*.

**"Sound like me" is the part I would push back on.** There are two readings:

- *A tone of voice.* The assistant writes in your register — plain, direct, no
  marketing language. This is easy and I would do it.
- *Speaking as you, in the first person.* A visitor asks a question and "amber"
  answers. This is where it goes wrong: it will eventually state something about
  your experience, your rates or your availability that is not true, in your
  voice, to someone deciding whether to hire you. I would build it as **an
  assistant that talks about you in the third person**, clearly labelled, with
  your tone. Same usefulness, none of the liability.

### Where it lives

Not only a folder. A permanent bar sitting directly above the film dock,
reading **"Ask about my work"** with a mic on the right. Click or type and it
grows into the assistant window. That answers "must be obvious on the home
page" without taking the bottom strip away from the films.

### What it can do

Beyond answering, it drives the desktop, which the terminal already proves is
possible — same `openWindow` / `closeWindow` handle:

- "show me the agritech one" → opens Work on Lampfarms
- "play Seen" → opens the Reel on that clip
- "I need a site for my shop" → opens Contact **with the subject and message
  already drafted** from the conversation

That last one is the actual product. It is the difference between a chatbot and
a thing that gets you work.

### What I need from you

1. An Anthropic API key, added to Vercel as an environment variable. I never see
   it and it never reaches the browser.
2. A ceiling you are comfortable with per month, so the rate limit is set to
   something rather than guessed.
3. A decision on third person vs first person (see above).

---

## Order I would build in

1. **Panel** — self-contained, improves the site immediately, no dependencies.
2. **Work grid + detail view** — the biggest visible gain, all the data exists.
3. **Assistant bar** — the empty pill above the dock, wired to open a window.
4. **Assistant, in two halves:**
   - typed, grounded, no speech, no cost to speak of — prove it is useful
   - mic and voice on top once it is

Splitting the assistant matters. If the typed version is not useful, a
microphone will not save it — and if it is, adding speech is an afternoon.

---

## Open questions

1. Assistant voice: third person about you (my recommendation) or first person as
   you?
2. Is there an API budget, and roughly what?
3. The tray toggles — sound and effects: useful, or clutter? I think sound yes,
   effects maybe.
4. Should the assistant be able to pre-fill the contact form, or only talk?
