# UI/UX Consistency Approach

## Goals
- Maintain one visual language across all pages and breakpoints.
- Ensure touch/keyboard parity for interaction feedback.
- Reduce style drift by normalizing tracking, spacing, and viewport-height rules.
- Remove trust-breaking UI behaviors (placeholder links, hover-only critical cues).

## Standards Applied
1. Typography rhythm:
- Keep micro-label tracking moderate on mobile (`0.2em - 0.4em`), reserve larger tracking for desktop only.

2. Interaction parity:
- Any hover-only affordance must have a non-hover fallback for touch devices.
- Interactive icon links must include meaningful `aria-label`.

3. Layout consistency:
- Use `min-h-screen` for major full-bleed hero/section blocks where content can grow.
- Avoid mixed fixed heights that create inconsistent vertical pacing unless intentionally cinematic.

4. Trust and accessibility:
- No production-facing placeholder links (`href="#"`) for visible actions.
- Preserve keyboard-visible focus indicators globally.

5. Maintainability:
- Prefer tokenized classes and extracted section components for repeated structures.
- Avoid ambiguous utility classes that produce warnings in build output.

## Verification
- Run `npm run build` to ensure no type/build regressions.
- Spot-check desktop + mobile interactions for hover/focus/touch equivalence.
