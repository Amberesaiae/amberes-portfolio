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
	rot: 1.5,
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

function buildCollage(): CollageItem[] {
	const rnd = mulberry32(7);
	const heroH = (HERO.w * 9) / 16;
	const hero: CollageItem = { ...HERO };
	const boxes: Array<[number, number, number, number]> = [[hero.x, hero.y, hero.x + hero.w, hero.y + heroH]];
	const items: CollageItem[] = [];
	// Mix of kinds: ~ 2/3 house (both widths), 1/3 portrait.
	const plan: Array<[CardKind, number]> = [];
	for (let i = 0; i < 35; i++) plan.push(i % 3 === 2 ? ['portrait', 160] : ['house', i % 2 ? 250 : 206]);
	const CLEAR = 12; // px clearance, absorbs rotation
	const hits = (a: number[], b: number[]) =>
		a[0] < b[2] + CLEAR && a[2] + CLEAR > b[0] && a[1] < b[3] + CLEAR && a[3] + CLEAR > b[1];
	// Cell-based packing: 5 columns x 8 rows, jittered inside each cell; a cell is skipped
	// only when no jittered position clears the hero (or its neighbours) by CLEAR px.
	const COLS = 5;
	const ROWS = 8;
	const cw = BOARD_WIDTH / COLS;
	const ch = COLLAGE_HEIGHT / ROWS;
	let n = 0;
	let p = 0;
	const seen = { house: 0, portrait: 0 };
	for (let r = 0; r < ROWS; r++) {
		for (let c = 0; c < COLS; c++) {
			if (n >= 35) break;
			const [kind, w] = plan[p % plan.length];
			const h = kind === 'portrait' ? 220 : w / HOUSE_ASPECT;
			let best: [number, number] | null = null;
			for (let t = 0; t < 60 && !best; t++) {
				const x = c * cw + 12 + rnd() * Math.max(0, cw - w - 24);
				const y = r * ch + 12 + rnd() * Math.max(0, ch - h - 24);
				const box = [x, y, x + w, y + h];
				if (x < 20 || x + w > BOARD_WIDTH - 20) continue;
				if (boxes.some((o) => hits(box, o))) continue;
				best = [x, y];
			}
			if (!best) continue;
			p++;
			const [x, y] = best;
			boxes.push([x, y, x + w, y + h]);
			items.push({
				id: `c${n}`,
				kind,
				w,
				x: Math.round(x),
				y: Math.round(y),
				rot: Math.round((rnd() - 0.5) * (n % 4 === 0 ? 150 : 80)) / 10,
				art: ARTS[n % ARTS.length],
				tone: TONES[(n + Math.floor(n / 8)) % TONES.length],
				label: NAMES[n % NAMES.length],
				caption: kind === 'portrait' ? undefined : 'Real world, built',
				mockSrc: mock(kind as 'house' | 'portrait', seen[kind as 'house' | 'portrait']++)
			});
			n++;
		}
	}
	// Top up skipped cells with any free spot on the canvas.
	for (let guard = 0; n < 35 && guard < 400; guard++) {
		const [kind, w] = plan[p % plan.length];
		const h = kind === 'portrait' ? 220 : w / HOUSE_ASPECT;
		const x = 20 + rnd() * (BOARD_WIDTH - w - 40);
		const y = 12 + rnd() * (COLLAGE_HEIGHT - h - 24);
		const box = [x, y, x + w, y + h];
		if (boxes.some((o) => hits(box, o))) continue;
		p++;
		boxes.push([x, y, x + w, y + h]);
		items.push({ id: `c${n}`, kind, w, x: Math.round(x), y: Math.round(y), rot: Math.round((rnd() - 0.5) * 80) / 10, art: ARTS[n % ARTS.length], tone: TONES[(n + Math.floor(n / 8)) % TONES.length], label: NAMES[n % NAMES.length], caption: kind === 'portrait' ? undefined : 'Real world, built', mockSrc: mock(kind as 'house' | 'portrait', seen[kind as 'house' | 'portrait']++) });
		n++;
	}
	return [...items, hero];
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
