# roydenso dock icons: TEMPORARY MOCKS

© Royden So. These are macOS-style folder/tile icons cropped from the
images in `reference/roydenso-playground/images/` (roydenso.com, "Royden's Playground"
version), resized to 256px PNG. The current live homepage has no dock icons, so these were
taken from the archived playground harvest.

**Temporary mock only**, authorised once by the user, to judge dock layout and
magnification. Never ship them. To be replaced by Codex-made original art.

| Dock item | File | Source image |
| --- | --- | --- |
| work | work.png | aQLj0xBFAoUq4RfvQeORNTyX0hI (orange folder) |
| talk | talk.png | czJ2SG5z5LxRAKeMDikU0VrEoUw (red ID badge tile) |
| terminal | terminal.png | loCvN51Gatr55dOFmxt69kDHc (Framer tile) |
| reel | reel.png | IoO7a0bLccWmIBEEWmqN4f26Q (yellow location tile) |
| games | games.png | oHq086hZwz0EnbfKQgrXVfgINfY (orange sticker tile) |
| archive | archive.png | mUkW0iGdbk1I1JLbSqUw3lqgKFc (gold folder) |

`web/scripts/sync-mock-icons.mjs` copies them to `web/static/_mock/dock/` (gitignored).
A production build fails while `web/static/_mock` exists unless `MOCKS_OK=1`.

Each glyph is desaturated to ink and set on one uniform paper rounded-square plate (28% radius, 58% glyph box) so the set reads as one family. About has no mock: the "R" is Royden's personal mark, so it keeps the Lucide glyph.
