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
	group: DockGroup;
	/** Shown in the 4-item mobile dock. The rest live under "More". */
	mobile: boolean;
}

/** Desktop order: pitch | evidence | stack (macOS apps | folders split). Legal lives in the menubar. */
export const dockItems: DockItemData[] = [
	{ id: 'work', label: 'Work', href: '#work', icon: 'work', group: 'pitch', mobile: true },
	{ id: 'about', label: 'About', href: '#about', icon: 'about', group: 'pitch', mobile: true },
	{ id: 'talk', label: 'Talk', href: '#contact', icon: 'talk', group: 'pitch', mobile: true },
	{ id: 'terminal', label: 'Terminal', action: 'terminal', icon: 'terminal', group: 'evidence', mobile: false },
	{ id: 'reel', label: 'Reel', action: 'reel', icon: 'reel', group: 'evidence', mobile: false },
	{ id: 'games', label: 'Games', action: 'games', icon: 'games', group: 'evidence', mobile: false },
	{ id: 'archive', label: 'Archive', action: 'archive', icon: 'archive', group: 'stack', mobile: false }
];

export const mobileItems = dockItems.filter((i) => i.mobile);
export const moreItems = dockItems.filter((i) => !i.mobile);

/** Magnification tuning (DOCK-AND-BRAND.md). */
export const DOCK_BASE = 56;
export const DOCK_MAX_SCALE = 1.7;
export const DOCK_RADIUS = 140;
