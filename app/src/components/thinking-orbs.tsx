/**
 * The assistant's orb.
 *
 * This file is a re-export, not an implementation. It briefly held a hand-rolled
 * CSS gradient stand-in, written when the real package looked unresolvable — it
 * was not unresolvable, it had simply been dropped from package.json. The real
 * library is a tuned canvas renderer with nine states and two size presets; the
 * stand-in was an orange blob with three. Keeping the shim means call sites can
 * go on importing from '@/components/thinking-orbs'.
 */
export { ThinkingOrb } from 'thinking-orbs';
export type { OrbState, OrbSize, OrbTheme, ThinkingOrbProps } from 'thinking-orbs';
