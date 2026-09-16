export type WindowId =
  | 'work'
  | 'reel'
  | 'about'
  | 'contact'
  | 'terminal'
  | 'games'
  | 'legal';

export interface Size {
  w: number;
  h: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface WindowState extends Point, Size {
  id: WindowId;
  open: boolean;
  minimized: boolean;
  maximized: boolean;
  z: number;
  /** transient payload — the selected project, the playing clip */
  arg?: string;
}

export interface WindowDef {
  id: WindowId;
  title: string;
  /** one line, used as the icon's accessible description and the menubar hint */
  hint: string;
  /** the icon file in public/icons */
  icon: string;
  /** per-icon nudge — the six SVGs carry different internal padding, and this
      is what makes them read as one size on the desktop */
  iconScale?: number;
  defaultSize: Size;
  minSize: Size;
  /** default spot for the folder, in % of the viewport */
  home: Point;
}
