import { ThinkingOrb } from '@/components/thinking-orbs';
import { useEffectsEnabled } from '@/desktop/effects/useEffectsEnabled';
import { cn } from '@/lib/utils';

/**
 * The live blob that stands where the Contact folder icon used to.
 *
 * It is alive on purpose: among six static folders, the one thing that moves is
 * the one thing that reads as a way to *talk* to someone rather than a place to
 * look. The orb is the assistant's face — the same component will show
 * `listening` and `working` once the microphone and the model are wired in, so
 * this is the final shape of that control, not a placeholder for it.
 */
export function DockBlob({ active }: { active: boolean }) {
  const { heavy } = useEffectsEnabled();

  return (
    <span className="relative block size-11">
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-[-4px] rounded-xl transition-opacity duration-200',
          active ? 'bg-primary/20 opacity-100' : 'opacity-0',
        )}
      />

      {heavy ? (
        <ThinkingOrb
          state={active ? 'listening' : 'breathing'}
          size={64}
          theme="auto"
          speed={active ? 1 : 0.6}
          style={{ width: 44, height: 44 }}
        />
      ) : (
        // No canvas loop where the budget says no: a still ring reads the same.
        <span className="grid size-11 place-items-center">
          <span className="size-7 rounded-full border-2 border-primary/70" />
        </span>
      )}
    </span>
  );
}
