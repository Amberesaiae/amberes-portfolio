import { motion } from 'framer-motion';
import { FolderGlyph } from '@/desktop/icons/FolderGlyph';
import { useIsMobile } from '@/desktop/providers/useIsMobile';
import { DockBlob } from './DockBlob';
import { DockContextMenu } from '@/desktop/menus/DockContextMenu';
import type { WindowDef } from '@/desktop/types';
import { cn } from '@/lib/utils';

interface Props {
  def: WindowDef;
  /** its window is open — the dot under the icon lights up */
  running: boolean;
  focused: boolean;
  onOpen: () => void;
}

/**
 * One dock slot, with its name under it.
 *
 * The name used to appear only on hover, which reads well on a desktop and not
 * at all anywhere else: touch has no hover, so on a phone these were seven
 * unlabelled pictures and you had to tap one to learn what it was. Folders have
 * names. These are folders.
 */
export function DockItem({ def, running, focused, onOpen }: Props) {
  /*
   * Seven labelled folders at desktop size come to 518px, which is wider than
   * any phone — so the dock scrolled and the last folders sat off-screen. At
   * this size they all fit at once, which is what a dock is supposed to do.
   */
  const compact = useIsMobile();

  return (
    <DockContextMenu def={def} running={running}>
      <motion.button
        type="button"
        onClick={onOpen}
        whileHover={{ y: -4, scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 520, damping: 26 }}
        aria-label={`${def.title} — ${def.hint}`}
        aria-current={focused || undefined}
        className={cn(
          'group relative flex shrink-0 flex-col items-center rounded-lg outline-none',
          'focus-visible:ring-2 focus-visible:ring-ring',
          compact ? 'w-[49px] px-0 py-1' : 'w-[74px] px-1 py-1.5',
        )}
      >
        {def.id === 'contact' ? (
          <DockBlob active={running} compact={compact} />
        ) : (
          <FolderGlyph def={def} active={running} compact={compact} />
        )}

        <span
          className={cn(
            'type-label mt-1 w-full truncate text-center leading-none transition-colors',
            compact ? 'text-[0.4375rem] tracking-[0.06em]' : 'text-[0.5625rem]',
            focused ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground',
          )}
        >
          {def.title}
        </span>

        <span
          aria-hidden="true"
          className={cn(
            'mt-1 size-1 rounded-full transition-colors',
            running ? (focused ? 'bg-primary' : 'bg-foreground/45') : 'bg-transparent',
          )}
        />
      </motion.button>
    </DockContextMenu>
  );
}
