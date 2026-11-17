/**
 * Board content + layout for the homepage.
 *
 * Voice: "we" is a register, not a headcount (a studio of one, see HOMEPAGE.md).
 * All geometry is expressed on a 1440-unit-wide canvas and rendered in container
 * query width units, so the measured system (house 1.39 at 206/250, portrait 160x220,
 * hero 665 16:9, 3-up grid of 358 squares at 25.7% pitch) holds at a 1440px board and
 * scales proportionally below that.
 */

export const studio = {
	name: 'Amber Studio',
	motto: 'engineering real world solutions',
	/** Display headline (sentence case, hyphenated, full stop). */
	headline: 'Engineering real-world solutions.',
	owner: 'Lamptey Odartei Isaiah',
	intro:
		'We design and build digital experiences and systems that work, for people and places the usual software forgets.'
} as const;

export const status = {
	availability: 'Taking work',
	building: 'Glean, four roles on one ledger'
} as const;

export const BOARD_WIDTH = 1440;
export const GRID_PITCH = 0.257; // fraction of board width
export const GRID_SQUARE = 358; // px at BOARD_WIDTH
export const GRID_GAP = 12;
export const HOUSE_ASPECT = 1.39;

export type Art = 'rings' | 'bars' | 'dots' | 'diag' | 'grid' | 'arc' | 'cross' | 'wave';
export type Tone = 'paper' | 'stone' | 'ash' | 'ink' | 'amber';
export type CardKind = 'house' | 'portrait' | 'hero';

export interface CollageItem {
	id: string;
	kind: CardKind;
	/** width in canvas px (house 206 | 250, portrait 160, hero 665) */
	w: number;
	/** left/top in canvas px */
	x: number;
	y: number;
	/** rotation in degrees */
	rot: number;
	art: Art;
	tone: Tone;
	label: string;
	caption?: string;
	/** Dev-only temporary mock image (undefined in production builds). */
	mockSrc?: string;
	/** Dev-only hero poster; the hero's mockSrc is the video. */
	mockPoster?: string;
}

export interface WorkItem {
	id: string;
	title: string;
	blurb: string;
	status: string;
	art: Art;
	tone: Tone;
	/** Dev-only temporary mock image (undefined in production builds). */
	mockSrc?: string;
}

/**
 * Temporary mock media (roydenso, user-authorised, dev only). `import.meta.env.DEV` is
 * statically false in production builds so the branch, and every `_mock` string, is dropped.
 * Files are produced by scripts/sync-mock-media.mjs: counts must match its groups.
 */
const MOCK_COUNT = { house: 29, portrait: 14, square: 12 } as const;
const mock = (kind: keyof typeof MOCK_COUNT, i: number): string | undefined =>
	import.meta.env.DEV
		? `/_mock/board/${kind}-${String((i % MOCK_COUNT[kind]) + 1).padStart(2, '0')}.webp`
		: undefined;

const ARTS: Art[] = ['rings', 'bars', 'dots', 'diag', 'grid', 'arc', 'cross', 'wave'];
const TONES: Tone[] = ['paper', 'stone', 'ash', 'paper', 'ink', 'stone', 'amber', 'paper'];

/** Small deterministic PRNG so the collage is identical on server and client. */
function mulberry32(seed: number): () => number {
	let a = seed;
	return () => {
		a |= 0;
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

const HERO: CollageItem = {
	id: 'hero',
	kind: 'hero',
	w: 665,
	x: (BOARD_WIDTH - 665) / 2,
	y: 0,
	rot: 0, // untilted: bounding box is exactly 665x374
	art: 'rings',
	tone: 'ink',
	label: 'Now building',
	caption: 'Glean, four roles on one ledger',
	mockSrc: import.meta.env.DEV ? '/_mock/board/hero.webm' : undefined,
	mockPoster: import.meta.env.DEV ? '/_mock/board/hero-poster.webp' : undefined
};

const NAMES = [
	'Field notes', 'Ledger', 'Booking', 'Pilot', 'Schools', 'Index', 'Offline', 'Kiosk', 'Dispatch', 'Roles',
	'Archive', 'Terminal', 'Reel', 'Press', 'Survey', 'Market', 'Clinic', 'Harvest', 'Receipts', 'Routes',
	'Forms', 'Stock', 'Fees', 'Results', 'Donate', 'Volunteer', 'Cottage', 'Issue 01', 'Hubs', 'Feed',
	'Queue', 'Approvals', 'Handover', 'Trail', 'Ward'
];

export const COLLAGE_HEIGHT = 2000;

/** Dev-only titles paired with the mock images, in the order of scripts/sync-mock-media.mjs. */
const MOCK_TITLES = {
	house: ['Personal', 'Flow', 'Dauber', 'Journal', 'Dauber tiers', 'People', 'Valentines', 'Deck', 'Monogram', 'Folders', 'Reading', 'Shazoom card', 'Dauber boards', 'Shazoom', 'Online safety', '2024', 'Ribbons', 'Coaction', 'Stationery', 'Pin', 'Ceremony', 'Colour bars', 'Shazoom mark', 'MeeOpp', 'Forms', 'Journey', 'Showreel', 'Contract', 'Work that works'],
	portrait: ['Morph', 'The Explorer', 'Stationery', 'Cabinet', 'Go Green', 'French speech', 'Terra', 'Coaction', 'Foamo', 'Sketch', 'Portrait', 'Menu', 'My story', 'Hello']
} as const;
const mockTitle = (kind: 'house' | 'portrait', i: number): string | undefined =>
	import.meta.env.DEV ? MOCK_TITLES[kind][i % MOCK_TITLES[kind].length] : undefined;

type Box = [number, number, number, number];

/** Loose scatter: random-sequential placement (largest first), retried over seeds until all 35 fit. */
function buildCollage(): CollageItem[] {
	const heroH = (HERO.w * 9) / 16;
	const hero: CollageItem = { ...HERO };
	const CLEAR = 16; // px clearance, absorbs rotation (up to +-7deg)
	const hits = (a: Box, b: Box) =>
		a[0] < b[2] + CLEAR && a[2] + CLEAR > b[0] && a[1] < b[3] + CLEAR && a[3] + CLEAR > b[1];
	// 12 portrait (160), 12 house 250, 11 house 206: the measured sizes, nothing new.
	const plan: Array<[CardKind, number]> = [];
	for (let i = 0; i < 35; i++) plan.push(i % 3 === 2 ? ['portrait', 160] : ['house', i % 2 ? 250 : 206]);
	const area = ([k, w]: [CardKind, number]) => w * (k === 'portrait' ? 220 : w / HOUSE_ASPECT);
	plan.sort((a, b) => area(b) - area(a));

	for (let seed = 7; seed < 3000; seed++) {
		const rnd = mulberry32(seed);
		const boxes: Box[] = [[hero.x, hero.y, hero.x + hero.w, hero.y + heroH]];
		const placed: Array<{ kind: CardKind; w: number; x: number; y: number; rot: number }> = [];
		for (const [kind, w] of plan) {
			const h = kind === 'portrait' ? 220 : w / HOUSE_ASPECT;
			for (let t = 0; t < 500; t++) {
				const x = 20 + rnd() * (BOARD_WIDTH - w - 40);
				const y = 12 + rnd() * (COLLAGE_HEIGHT - h - 24);
				const box: Box = [x, y, x + w, y + h];
				if (boxes.some((o) => hits(box, o))) continue;
				boxes.push(box);
				placed.push({ kind, w, x: Math.round(x), y: Math.round(y), rot: Math.round((rnd() - 0.5) * 140) / 10 });
				break;
			}
		}
		if (placed.length < 35) continue;
		// Reading order top-to-bottom so ids, labels and image indices follow the canvas.
		placed.sort((a, b) => a.y - b.y || a.x - b.x);
		const seen = { house: 0, portrait: 0 };
		const items: CollageItem[] = placed.map((c, n) => {
			const k = c.kind as 'house' | 'portrait';
			const idx = seen[k]++;
			return {
				id: `c${n}`,
				...c,
				art: ARTS[n % ARTS.length],
				tone: TONES[(n + Math.floor(n / 8)) % TONES.length],
				label: mockTitle(k, idx) ?? NAMES[n % NAMES.length],
				caption: c.kind === 'portrait' ? undefined : 'Real world, built',
				mockSrc: mock(k, idx)
			};
		});
		return [...items, hero];
	}
	throw new Error('collage: could not place all cards');
}

export const collage: CollageItem[] = buildCollage();

export const work: WorkItem[] = [
	{ id: 'needbe', title: 'NeedBe Foundation', blurb: 'Online donations and volunteer sign-up for a Ghanaian menstrual-health NGO, built for low bandwidth.', status: 'Live', art: 'arc', tone: 'paper', mockSrc: mock('square', 0) },
	{ id: 'continuum', title: 'Continuum Magazine', blurb: 'Issue 01, The In-Between: essays, poems, Q&As and photo series with inline video.', status: 'Live', art: 'bars', tone: 'stone', mockSrc: mock('square', 1) },
	{ id: 'tandohstay', title: 'TandohStay', blurb: 'Direct booking for Sarpomaa Cottage, with power and transfer stated upfront.', status: 'Live', art: 'grid', tone: 'paper', mockSrc: mock('square', 2) },
	{ id: 'containerclear', title: 'ContainerClear', blurb: 'Turns phone calls into a written trail. No call goes out without human approval.', status: 'In use', art: 'diag', tone: 'ash', mockSrc: mock('square', 3) },
	{ id: 'glean', title: 'Glean', blurb: 'Verifies what was recovered, not what was paid. Four roles on one ledger.', status: 'In build', art: 'rings', tone: 'ink', mockSrc: mock('square', 4) },
	{ id: 'jingo', title: 'Jingo / FarmLink', blurb: 'Livestock, hatcheries, feed and produce in one market. Nothing reaches a buyer unapproved.', status: 'Pilot', art: 'dots', tone: 'paper', mockSrc: mock('square', 5) },
	{ id: 'noragami', title: 'Noragami', blurb: 'Opportunities across Africa in one feed. Ask Nora what you qualify for.', status: 'In build', art: 'wave', tone: 'stone', mockSrc: mock('square', 6) },
	{ id: 'guardian', title: 'System_Guardian_v1', blurb: 'An experiment, and a bit. Kept straight.', status: 'Experiment', art: 'cross', tone: 'ash', mockSrc: mock('square', 7) },
	{ id: 'schools', title: 'School management', blurb: 'Records, fees and results for schools that run on paper today.', status: 'Service', art: 'grid', tone: 'paper', mockSrc: mock('square', 8) },
	{ id: 'business', title: 'Business management', blurb: 'Stock, sales and staff in one system a small business can actually run.', status: 'Service', art: 'bars', tone: 'stone', mockSrc: mock('square', 9) },
	{ id: 'web', title: 'Websites and e-commerce', blurb: 'Design and development for sites that load on a bad connection.', status: 'Service', art: 'arc', tone: 'amber', mockSrc: mock('square', 10) },
	{ id: 'talk', title: 'Talk to us', blurb: 'Tell us the problem. We will tell you honestly if we are the right fit.', status: 'Open', art: 'diag', tone: 'ink', mockSrc: mock('square', 11) }
];
