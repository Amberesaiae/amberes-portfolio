import { ThinkingOrb } from '@/components/thinking-orbs';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/desktop/typography/Text';
import { useEffectsEnabled } from './useEffectsEnabled';

/**
 * What a window shows while its pane is still arriving.
 *
 * The orb is built for AI thinking states; here it reads as the machine
 * fetching something, which is what is actually happening. Without the effect
 * budget it falls back to three skeleton lines.
 */
export function PaneLoader() {
  const { heavy } = useEffectsEnabled();

  if (!heavy) {
    return (
      <div className="space-y-3 p-6">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-[180px] flex-col items-center justify-center gap-4">
      <ThinkingOrb state="working" size={64} theme="auto" />
      <Label className="text-muted-foreground/50">Opening</Label>
    </div>
  );
}
