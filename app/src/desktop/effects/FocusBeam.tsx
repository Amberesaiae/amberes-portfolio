import { BorderBeam } from '@/components/border-beam';
import { useEffectsEnabled } from './useEffectsEnabled';

/**
 * The focused window wears a beam.
 *
 * This is the one effect doing real work: focus used to be signalled by a
 * slightly brighter 1px border, which is almost nothing once three windows
 * overlap. 'sunset' is the variant that matches --primary.
 *
 * Rendered as an inert overlay rather than a wrapper, so it cannot interfere
 * with the window's own positioning, dragging or hit-testing.
 */
export function FocusBeam({ active }: { active: boolean }) {
  const { light } = useEffectsEnabled();
  if (!light) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1]">
      <BorderBeam
        size="md"
        colorVariant="sunset"
        theme="auto"
        active={active}
        duration={4}
        strength={0.85}
        brightness={1.35}
        borderRadius={12}
        className="size-full"
      >
        <div className="size-full rounded-xl" />
      </BorderBeam>
    </div>
  );
}
