/**
 * The gooey merge, from `liquid-gooey` on libraries.dev.
 *
 * What stood here was a hand-written SVG blur-and-alpha-crush filter — the
 * classic CSS trick, and a fair imitation, but an imitation. The library does
 * the same idea properly (springs, morph tuning, dissolve) and is re-exported
 * whole rather than reimplemented.
 *
 * Nothing mounts it today: it belonged to the folder-drag merge on the old icon
 * layer, which the dock replaced. Kept wired to the real package so that when a
 * surface wants it, it is one import away and not a rewrite.
 */
export { Liquid, presets, easingFunction } from 'liquid-gooey';
export type {
  LiquidProps,
  LiquidEffect,
  LiquidItemProps,
  MorphTuning,
  Transition,
  TransitionPreset,
} from 'liquid-gooey';
