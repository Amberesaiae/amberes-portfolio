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
	owner: 'Lamptey Odartei Isaiah',
	intro:
		'We design and build digital experiences and systems that work, for people and places the usual software forgets.'
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
}

export interface WorkItem {
	id: string;
	title: string;
	blurb: string;
	status: string;
	art: Art;
	tone: Tone;
}


const ARTS: Art[] = ['rings', 'bars', 'dots', 'diag', 'grid', 'arc', 'cross', 'wave'];
const TONES: Tone[] = ['paper', 'stone', 'ash', 'paper', 'ink', 'stone', 'amber', 'paper'];
const LABELS = [
	'Field notes', 'Ledger', 'Booking', 'Pilot', 'Schools', 'Index', 'Offline', 'Kiosk',
	'Dispatch', 'Roles', 'Archive', 'Terminal', 'Reel', 'Press', 'Survey', 'Market'
];

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
	y: 560,
	rot: 0,
	art: 'rings',
	tone: 'ink',
	label: 'Now building',
	caption: 'Glean, four roles on one ledger'
};

function buildCollage(): CollageItem[] {
	const rnd = mulberry32(48);
	const items: CollageItem[] = [];
	const heroH = (HERO.w * 9) / 16;
	const boxes: Array<[number, number, number, number]> = [
		[HERO.x - 20, HERO.y - 20, HERO.x + HERO.w + 20, HERO.y + heroH + 20]
	];
	const kinds: Array<[CardKind, number]> = [
		['house', 250], ['portrait', 160], ['house', 206], ['house', 250],
		['portrait', 160], ['house', 206], ['house', 206], ['portrait', 160]
	];
	const free = (x: number, y: number, w: number, h: number) =>
		boxes.every(([x0, y0, x1, y1]) => x + w <= x0 + 6 || x >= x1 - 6 || y + h <= y0 + 6 || y >= y1 - 6);
	const bands = 20;
	const perBand = 4;
	let n = 0;
	for (let b = 0; b < bands && n < 35; b++) {
		const baseY = 28 + b * 118;
		for (let s = 0; s < perBand && n < 35; s++) {
			const [kind, w] = kinds[(b * 3 + s * 5 + (b % 2)) % kinds.length];
			const h = kind === 'portrait' ? 220 : w / HOUSE_ASPECT;
			const slot = (BOARD_WIDTH - 48) / perBand;
			for (let attempt = 0; attempt < 8; attempt++) {
				let x = 24 + s * slot + (slot - w) / 2 + (rnd() - 0.5) * 80;
				x = Math.max(28, Math.min(BOARD_WIDTH - w - 28, x));
				const y = Math.max(28, baseY + (rnd() - 0.5) * 80);
				if (!free(x, y, w, h)) continue;
				boxes.push([x, y, x + w, y + h]);
				items.push({
					id: `c${n}`,
					kind,
					w,
					x: Math.round(x),
					y: Math.round(y),
					rot: Math.round((rnd() - 0.5) * (n % 4 === 0 ? 160 : 90)) / 10,
					art: ARTS[n % ARTS.length],
					tone: TONES[(n * 3) % TONES.length],
					label: LABELS[n % LABELS.length],
					caption: kind === 'portrait' ? undefined : 'Real world, built'
				});
				n++;
				break;
			}
		}
	}
	return [...items, HERO];
}

export const collage: CollageItem[] = buildCollage();

/** Collage canvas height: lowest card edge (with rotation slack) plus a gutter, so nothing spills into the grid. */
export const COLLAGE_HEIGHT: number = Math.ceil(
	Math.max(
		...collage.map((c) => c.y + (c.kind === 'portrait' ? 220 : c.kind === 'hero' ? (c.w * 9) / 16 : c.w / HOUSE_ASPECT))
	) + 40
);

export const work: WorkItem[] = [
	{ id: 'needbe', title: 'NeedBe Foundation', blurb: 'Online donations and volunteer sign-up for a Ghanaian menstrual-health NGO, built for low bandwidth.', status: 'Live', art: 'arc', tone: 'paper' },
	{ id: 'continuum', title: 'Continuum Magazine', blurb: 'Issue 01, The In-Between: essays, poems, Q&As and photo series with inline video.', status: 'Live', art: 'bars', tone: 'stone' },
	{ id: 'tandohstay', title: 'TandohStay', blurb: 'Direct booking for Sarpomaa Cottage, with power and transfer stated upfront.', status: 'Live', art: 'grid', tone: 'paper' },
	{ id: 'containerclear', title: 'ContainerClear', blurb: 'Turns phone calls into a written trail. No call goes out without human approval.', status: 'In use', art: 'diag', tone: 'ash' },
	{ id: 'glean', title: 'Glean', blurb: 'Verifies what was recovered, not what was paid. Four roles on one ledger.', status: 'In build', art: 'rings', tone: 'ink' },
	{ id: 'jingo', title: 'Jingo / FarmLink', blurb: 'Livestock, hatcheries, feed and produce in one market. Nothing reaches a buyer unapproved.', status: 'Pilot', art: 'dots', tone: 'paper' },
	{ id: 'noragami', title: 'Noragami', blurb: 'Opportunities across Africa in one feed. Ask Nora what you qualify for.', status: 'In build', art: 'wave', tone: 'stone' },
	{ id: 'guardian', title: 'System_Guardian_v1', blurb: 'An experiment, and a bit. Kept straight.', status: 'Experiment', art: 'cross', tone: 'ash' },
	{ id: 'schools', title: 'School management', blurb: 'Records, fees and results for schools that run on paper today.', status: 'Service', art: 'grid', tone: 'paper' },
	{ id: 'business', title: 'Business management', blurb: 'Stock, sales and staff in one system a small business can actually run.', status: 'Service', art: 'bars', tone: 'stone' },
	{ id: 'web', title: 'Websites and e-commerce', blurb: 'Design and development for sites that load on a bad connection.', status: 'Service', art: 'arc', tone: 'amber' },
	{ id: 'talk', title: 'Talk to us', blurb: 'Tell us the problem. We will tell you honestly if we are the right fit.', status: 'Open', art: 'diag', tone: 'ink' }
];
