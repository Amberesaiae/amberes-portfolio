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
export function DockBlob({ active, compact = false }: { active: boolean; compact?: boolean }) {
  const { heavy } = useEffectsEnabled();

  return (
    <span className={cn('relative block', compact ? 'size-8' : 'size-11')}>
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
          style={{ width: compact ? 32 : 44, height: compact ? 32 : 44 }}
        />
      ) : (
        // No canvas loop where the budget says no: a still ring reads the same.
        <span className={cn('grid place-items-center', compact ? 'size-8' : 'size-11')}>
          <span
            className={cn('rounded-full border-2 border-primary/70', compact ? 'size-5' : 'size-7')}
          />
        </span>
      )}
    </span>
  );
}
