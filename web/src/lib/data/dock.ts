export type DockIconKey =
	| 'work'
	| 'about'
	| 'talk'
	| 'terminal'
	| 'reel'
	| 'games'
	| 'archive';

export type DockGroup = 'pitch' | 'evidence' | 'stack';

export interface DockItemData {
	id: string;
	label: string;
	/** Anchor/route to navigate to. If omitted the item is an action only. */
	href?: string;
	/** Action id emitted via the Dock `onaction` callback (e.g. open the terminal window). */
	action?: string;
	icon: DockIconKey;
	/** Optional custom icon image. Temporary mocks live in /_mock/dock (dev only); a 404 falls back to the Lucide glyph. */
	iconSrc?: string;
	group: DockGroup;
	/** Shown in the 4-item mobile dock. The rest live under "More". */
	mobile: boolean;
}

/** Desktop order: pitch | evidence | stack (macOS apps | folders split). Legal lives in the menubar. */
const mock = (k: DockIconKey): string | undefined =>
	import.meta.env.DEV ? `/_mock/dock/${k}.png` : undefined; // dev only: never in a production bundle

export const dockItems: DockItemData[] = [
	{ id: 'work', label: 'Work', href: '#work', icon: 'work', iconSrc: mock('work'), group: 'pitch', mobile: true },
	{ id: 'about', label: 'About', href: '#about', icon: 'about', iconSrc: mock('about'), group: 'pitch', mobile: true },
	{ id: 'talk', label: 'Talk', href: '#contact', icon: 'talk', iconSrc: mock('talk'), group: 'pitch', mobile: true },
	{ id: 'terminal', label: 'Terminal', action: 'terminal', icon: 'terminal', iconSrc: mock('terminal'), group: 'evidence', mobile: false },
	{ id: 'reel', label: 'Reel', action: 'reel', icon: 'reel', iconSrc: mock('reel'), group: 'evidence', mobile: false },
	{ id: 'games', label: 'Games', action: 'games', icon: 'games', iconSrc: mock('games'), group: 'evidence', mobile: false },
	{ id: 'archive', label: 'Archive', action: 'archive', icon: 'archive', iconSrc: mock('archive'), group: 'stack', mobile: false }
];

export const mobileItems = dockItems.filter((i) => i.mobile);
export const moreItems = dockItems.filter((i) => !i.mobile);

/** Magnification tuning (DOCK-AND-BRAND.md). */
export const DOCK_BASE = 56;
export const DOCK_MAX_SCALE = 1.7;
export const DOCK_RADIUS = 140;
