import { projects } from "./projects";

/**
 * The board, built to the reference's own measurements.
 *
 * Measured off the archived original at a 1440 viewport: a 1425px root, 7409px
 * tall. What looked like free scatter is actually a tight system, and these are
 * the numbers that matter:
 *
 *   · One house aspect ratio, 1.39 — twelve of its twenty-seven frames use it.
 *   · Two frame widths at that ratio, 206 and 250. A ~20% step, nothing between.
 *   · A portrait frame, 160 × 220.
 *   · Exactly one hero, 665 wide at 16:9.
 *   · And at the foot, no scatter at all: a rigid three-up grid of 358px squares
 *     on a 25.7% pitch.
 *
 * So the page is two zones, not one. A loose collage up top that reads as a
 * working surface, and a conventional grid underneath that does the actual
 * navigating. Copying the scatter without the grid would give us atmosphere and
 * no way through; copying the grid alone would be every portfolio ever made.
 */

export const FRAME = {
  /** the house ratio, width ÷ height */
  RATIO: 1.39,
  SM: 206,
  MD: 250,
  LG: 358,
  PORTRAIT: { w: 160, h: 220 },
  HERO: { w: 665, h: 378 },
} as const;

export interface CanvasCard {
  id: string;
  /** the grey micro-type above the frame — the note left on it, never an explanation */
  label: string;
  title?: string;
  /** left edge as a percentage of the board */
  x: number;
  /** top edge in pixels down the board */
  y: number;
  w: number;
  /** height in px; omitted means the house ratio */
  h?: number;
  media?: string;
  href?: string;
  pinned?: boolean;
  swatch?: string[];
}

/** Reference imagery standing in until the real set lands. Never ships. */
const mock = (f: string) => `/playground-mock/${f}`;

const h = (w: number) => Math.round(w / FRAME.RATIO);

/*
 * Zone one — the collage. Studio texture, not navigation: nothing here is a
 * project tile, and none of it is labelled with a claim. It exists so the top
 * of the page reads as a surface someone works on.
 */
const SCATTER: CanvasCard[] = [
  { id: "s1", label: "STUDIO", x: 62, y: 70, w: FRAME.SM, media: mock("M6HAxh15bvW4V3QFYHqTmJUOI.jpg") },
  { id: "s2", label: "PROCESS", x: 80, y: 190, w: FRAME.SM, media: mock("Nc605I5Ho9Tua79NkAK3hzuyDg.png") },
  { id: "s3", label: "ACCRA", x: 60, y: 330, w: FRAME.SM, media: mock("hQAubQ4vbPyESSU2HOgawROk9E.jpg") },
  { id: "s4", label: "SKETCH", x: 20, y: 430, w: FRAME.SM, media: mock("TIng2YGoKBfo1IJIIvTYehW4RKY.png") },
  {
    id: "swatch",
    label: "HOUSE PAINT",
    x: 8,
    y: 620,
    w: FRAME.MD,
    h: 64,
    swatch: ["#1b2ed4", "#f5a623", "#121212", "#efede9", "#8c2f3b"],
  },
  { id: "s5", label: "DETAIL", x: 36, y: 600, w: FRAME.SM, media: mock("6rYOXZF43u6iyRsGmUFX9rWH8.png") },
  { id: "s6", label: "ON THE DESK", x: 66, y: 560, w: FRAME.MD, media: mock("aqOQTHp4L9DDli11AJF3nkKWBg.jpeg") },
  { id: "s7", label: "TYPE", x: 14, y: 830, w: FRAME.PORTRAIT.w, h: FRAME.PORTRAIT.h, media: mock("jbGBljRri75VLWdMUdO5A4l6R4.jpg") },
  { id: "s8", label: "COLOUR STUDY", x: 32, y: 880, w: FRAME.MD, media: mock("yzAVgOUTRFLau2rmwYWPmVHOkn8.png") },
  { id: "s9", label: "MARK", x: 60, y: 840, w: FRAME.MD, media: mock("o5fCZhnF72cZZobIZVkg04xwv8.png") },
  { id: "s10", label: "IN PROGRESS", x: 80, y: 1000, w: FRAME.SM, media: mock("rnR8ZoL9fo3Pl80Udqmgo7WE1j8.png") },
  { id: "s11", label: "PRINT", x: 10, y: 1120, w: FRAME.PORTRAIT.w, h: FRAME.PORTRAIT.h, media: mock("tL98futpdKFjmGsxJRarzejLdrg.png") },
  { id: "s12", label: "SPREAD", x: 30, y: 1180, w: FRAME.MD, media: mock("DA7JqJ2hFIxgL1aUdXQtR9z8Dh4.jpeg") },
  { id: "s13", label: "FIELD", x: 58, y: 1140, w: FRAME.SM, media: mock("OQ2TGvM4kSkwRi3eAmnTg591BaA.webp") },
];

/*
 * Zone two — the work. A 358px square three-up on a 25.7% pitch, exactly as the
 * reference lays out its case studies. Eight projects fall as 3 / 3 / 2.
 */
const GRID_X = [10, 35.7, 61.4];
const GRID_TOP = 1520;
const GRID_STEP = 430;

const ORDER = [
  "needbe",
  "tandohstay",
  "continuum",
  "containerclear",
  "glean",
  "jingo",
  "noragami",
  "system-guardian",
] as const;

const LABELS: Record<string, string> = {
  needbe: "BRAND + PLATFORM · 2024–26",
  tandohstay: "HOSPITALITY · 2025–26",
  continuum: "EDITORIAL · 2026",
  containerclear: "OPERATIONS · 2026",
  glean: "EDGE SYSTEM · IN BUILD",
  jingo: "MARKETPLACE · PILOT",
  noragami: "MOBILE · IN BUILD",
  "system-guardian": "EXPERIMENT · 2025",
};

/* Stand-ins, one per project, until the work order's heroes are generated. */
const MOCK_FOR: Record<string, string> = {
  needbe: "p7RD9047gIIworZkpQBzkrOzA4.png",
  tandohstay: "WYwOfs18ObvfptvCGllUagAB7m0.png",
  continuum: "qBAll0d0pLeQiIDkMeAL1gUcKQ.jpg",
  containerclear: "jPdMIRkNEnbRdwjMMoMxpUnI.webp",
  glean: "X8vYwJfpdejI2xIU4pLrtgedZ8c.webp",
  jingo: "90k9Jzm1XtImrWbJojro8oZfo4w.png",
  noragami: "9XaKw20pMEdhbCjtUWf2ugm5ME.png",
  "system-guardian": "6wWvkt1N3QXb7avsjTGAtHANY.png",
};

const WORK: CanvasCard[] = ORDER.map((id, i) => {
  const p = projects.find((x) => x.id === id);
  return {
    id,
    label: LABELS[id],
    title: p?.title,
    x: GRID_X[i % 3],
    y: GRID_TOP + Math.floor(i / 3) * GRID_STEP,
    w: FRAME.LG,
    h: FRAME.LG,
    media: mock(MOCK_FOR[id]),
    href: `/work/${id}`,
    pinned: i === 0,
  };
});

export const CARDS: CanvasCard[] = [...SCATTER, ...WORK];

/** The work grid is the last thing on the board, plus room to breathe under it. */
export const BOARD_HEIGHT = GRID_TOP + Math.ceil(ORDER.length / 3) * GRID_STEP + 160;

/** Mobile gets the work only, in order — see `Canvas`. */
export const COLUMN: CanvasCard[] = WORK;

export { h as frameHeight };
