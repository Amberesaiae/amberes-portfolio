import { Label } from '@/desktop/typography/Text';
import { useAsciiModule } from './useAsciiModule';
import { useSaveData } from './useSaveData';

/**
 * What a window shows while its pane chunk is still arriving.
 *
 * Three glyph lines, in the same amber the rest of the chrome uses, rather
 * than a thinking orb: this is a fetch, and the skeleton is plain markup so
 * it paints on the frame the fallback mounts. On a save-data link the sweep
 * stays still.
 */
export function PaneLoader() {
  const thin = useSaveData();
  const ascii = useAsciiModule(true, false);
  const Field = ascii?.AsciiSkeleton;

  return (
    <div className="flex h-full min-h-[180px] flex-col justify-center gap-4 p-6">
      {Field && (
        <Field variant="terminal" lines={3} widths={['34%', '68%', '48%']} seed={4} animate={!thin} />
      )}
      <Label className="text-subtle-foreground">Opening</Label>
    </div>
  );
}
