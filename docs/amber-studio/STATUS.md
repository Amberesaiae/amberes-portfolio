# Amber Studio SvelteKit rebuild: STATUS (single source of truth)

Head: orchestrator session (cloud). Updated: 2026-11-16.
Base branch: `amber-studio-roydenso-rebuild`. Head branch: `svelte-rebuild`. Never merge to main. Never ship `reference/` or mock images.

## Decisions
- New project in `web/`: SvelteKit (runes) + Tailwind v4 + shadcn-svelte tooling. `app/` and `site/` are REFERENCE ONLY.
- shadcn-svelte "maia" preset DOES exist in CLI v1.8.1 (`init --preset maia`, Hugeicons/Figtree, soft/rounded). The registry host (shadcn-svelte.com) is blocked by this environment's proxy, so `init` could not run. Scaffold was written by hand: `components.json` (style maia), `src/lib/utils.ts` (`cn`), tokens in `src/routes/layout.css`. To pull real components later the env must allow `shadcn-svelte.com`; until then write components by hand in shadcn style (bits-ui is installed).
- Aliases are `#lib/...` (SvelteKit package.json imports), not `$lib` in components.json.
- Fonts: Geist/Inter stand-ins until PP Neue Montreal is licensed. Garaje GIFs dropped; only gravity/scatter idea ported (Matter.js).
- Rules: one component per file, typed props, data in `src/lib/data/`, no global mutable state outside Svelte stores, reduced-motion respected everywhere. Workers use subagents for search/checks.
- Board system: house aspect 1.39 at widths 206 and 250; portrait 160x220; one 665-wide 16:9 hero; rigid 3-up grid of 358 squares at 25.7% pitch under the collage; mobile drops collage, work tiles single column.

## Ownership (non-overlapping file areas)
| Task | Branch | Owns |
| --- | --- | --- |
| IntroFilm | `intro-film` | `web/src/lib/components/intro/**`, `web/src/lib/stores/intro.ts`, `web/src/lib/data/intro.ts` |
| Board + mobile | `board-mobile` | `web/src/lib/components/board/**`, `web/src/lib/data/board.ts`, `web/src/routes/+page.svelte` |
| Gravity/scatter | `physics-gravity` | `web/src/lib/physics/**`, `web/src/lib/components/physics/**` |
| Dock (+mobile) | `dock` | `web/src/lib/components/dock/**`, `web/src/lib/data/dock.ts` |
| Accessibility | `a11y-pass` | `web/src/lib/a11y/**`, `web/src/routes/+layout.svelte`, `web/src/routes/layout.css`, `docs/amber-studio/A11Y.md` |

Rule: touch only your area. Need a change elsewhere? Note it in your final report, do not edit. Each worker pushes its own branch and does not touch STATUS.md.

## Tasks
| Task | Session | Branch | State |
| --- | --- | --- | --- |
| Scaffold `web/` | head | `svelte-rebuild` | done, build + check green |
| IntroFilm | session_012MfFGkLgPVG4zRxF2SYSHz | `intro-film` | built; scope + check + build verified by head (clean merge of all five) |
| Board + mobile | session_012MfFGpHpr8APB1PDRYQmHn | `board-mobile` | built; scope + check + build verified by head (clean merge of all five) |
| Gravity/scatter | session_012MfFGmopJp1AFNnXEX5dDa | `physics-gravity` | built; scope + check + build verified by head (clean merge of all five) |
| Dock | session_012MfFGkPwbbn76iRd3sHcup | `dock` | built; scope + check + build verified by head (clean merge of all five) |
| Accessibility | session_012MfFGkZGRYqf8rfayqFEWY | `a11y-pass` | built; scope + check + build verified by head (clean merge of all five) |
| Integration + verify | head | `svelte-rebuild` | next: merge five branches, mount Intro/Dock, add data-reveal + .site-header markers, run a11y audit |

## Round 2 (build -> review -> judge loop), started
- All five builder branches integrated into `svelte-rebuild`; Intro + Dock mounted in `+layout`; check + build green.
- Each builder runs its own BUILD -> REVIEW -> JUDGE loop with fresh subagents until 9/10 on every criterion; pushes each round to its branch.
- Independent Judge: `session_012MfFGpR69vWMkpSx8SwauS`, branch `judge-reports`, writes `JUDGE-<n>.md` (up to 5 rounds).
- Dock mock icons: user-approved roydenso icons as temporary mocks only (`reference/roydenso-dock/`, gitignored `web/static/_mock/`, production build guard).
- Head loop: fetch branches, verify check/build, merge, route judge punch lists, repeat.

### Tick 16:30
- Merged all builders into svelte-rebuild (check 0 errors, build ok, vitest 11/11). Judge R3: intro 7, typography 6, collage 5, physics/dock/mobile 6 (R3 predates latest builder pushes; R4 next).
- Dock mock icons: dock worker refused relayed instruction; new session `session_012MfFGmh3X1t2XASdoiwjrc` branch `dock-icons` (from `dock`) carries the user's decision.

## Result (Judge round 7, svelte-rebuild f056e10): 11/11 criteria >= 9
geometry 9, collage 9, intro 9 (2.71s), dock 9, physics 9, mobile 9, typography 9, motion 9, a11y 9 (axe 0), perf 9 (158.5KB JS, CLS 0), code 9.
Prod build: 0 _mock requests, 0 console errors, no mock files in output. Server sourcemap mentions `_mock` in source text only (not served).
Non-blocking leftovers: dock actions are stub sheets, 48px menubar deferred, intro/board art are neutral placeholders awaiting Codex assets, roydenso dock mocks are dev-only (MOCKS_OK=1, never in CI), fonts are Geist stand-ins. Awaiting user decision before any merge. Loop stopped.
