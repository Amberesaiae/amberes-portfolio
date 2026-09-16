import { cn } from '@/lib/utils';
import type { WindowDef } from '@/desktop/types';

/**
 * The folder art. These are the six SVGs from `icons/`, served as files rather
 * than inlined — the browser caches them, and swapping one is a file swap, not
 * a code change.
 */
export function FolderGlyph({ def, active }: { def: WindowDef; active: boolean }) {
  return (
    <span className="relative block size-11">
      {/* A soft plate behind the art so it reads against the bright sky. */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-[-4px] rounded-xl transition-opacity duration-200',
          active ? 'bg-primary/20 opacity-100' : 'opacity-0',
        )}
      />
      <img
        src={def.icon}
        alt=""
        width={44}
        height={44}
        draggable={false}
        style={{ transform: `scale(${(def.iconScale ?? 1) * (active ? 1.06 : 1)})` }}
        className={cn(
          'relative size-full select-none object-contain transition-transform duration-200',
          'drop-shadow-[0_4px_10px_rgba(0,0,0,0.55)]',
        )}
      />
    </span>
  );
}
