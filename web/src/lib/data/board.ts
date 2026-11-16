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

const NAMES = [
	'Field notes', 'Ledger', 'Booking', 'Pilot', 'Schools', 'Index', 'Offline', 'Kiosk', 'Dispatch', 'Roles',
	'Archive', 'Terminal', 'Reel', 'Press', 'Survey', 'Market', 'Clinic', 'Harvest', 'Receipts', 'Routes',
	'Forms', 'Stock', 'Fees', 'Results', 'Donate', 'Volunteer', 'Cottage', 'Issue 01', 'Hubs', 'Feed',
	'Queue', 'Approvals', 'Handover', 'Trail', 'Ward'
];

export const COLLAGE_HEIGHT = 1400;

function buildCollage(): CollageItem[] {
	const rnd = mulberry32(7);
	const heroH = (HERO.w * 9) / 16;
	const hero: CollageItem = { ...HERO, y: Math.round((COLLAGE_HEIGHT - heroH) / 2) };
	const boxes: Array<[number, number, number, number]> = [[hero.x, hero.y, hero.x + hero.w, hero.y + heroH]];
	const items: CollageItem[] = [];
	// Mix of kinds: ~ 2/3 house (both widths), 1/3 portrait.
	const plan: Array<[CardKind, number]> = [];
	for (let i = 0; i < 35; i++) plan.push(i % 3 === 2 ? ['portrait', 160] : ['house', i % 2 ? 250 : 206]);
	const overlap = (a: number[], b: number[]) => {
		const w = Math.min(a[2], b[2]) - Math.max(a[0], b[0]);
		const h = Math.min(a[3], b[3]) - Math.max(a[1], b[1]);
		return w > 0 && h > 0 ? w * h : 0;
	};
	let n = 0;
	for (const [kind, w] of plan) {
		const h = kind === 'portrait' ? 220 : w / HOUSE_ASPECT;
		let best: [number, number] | null = null;
		let bestScore = Infinity;
		for (let t = 0; t < 250; t++) {
			const x = 28 + rnd() * (BOARD_WIDTH - w - 56);
			const y = 28 + rnd() * (COLLAGE_HEIGHT - h - 56);
			const box = [x, y, x + w, y + h];
			let worst = 0;
			let total = 0;
			for (const o of boxes) {
				const ov = overlap(box, o);
				const frac = ov / Math.min(w * h, (o[2] - o[0]) * (o[3] - o[1]));
				worst = Math.max(worst, frac);
				total += ov;
			}
			// the hero must stay clear; cards may only lightly overlap one another
			if (overlap(box, boxes[0]) > 0) continue;
			const score = worst > 0.14 ? 1e9 + total : total;
			if (score < bestScore) { bestScore = score; best = [x, y]; }
		}
		if (!best) continue;
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
			caption: kind === 'portrait' ? undefined : 'Real world, built'
		});
		n++;
	}
	return [...items, hero];
}

export const collage: CollageItem[] = buildCollage();

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
