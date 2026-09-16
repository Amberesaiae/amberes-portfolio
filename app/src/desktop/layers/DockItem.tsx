import { motion } from 'framer-motion';
import { FolderGlyph } from '@/desktop/icons/FolderGlyph';
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
 * One dock slot. The label only appears on hover, so six of these read as a row
 * of icons rather than a menu.
 */
export function DockItem({ def, running, focused, onOpen }: Props) {
  return (
    <DockContextMenu def={def} running={running}>
    <motion.button
      type="button"
      onClick={onOpen}
      whileHover={{ y: -6, scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 520, damping: 26 }}
      aria-label={`${def.title} — ${def.hint}`}
      aria-current={focused || undefined}
      className="group relative flex shrink-0 flex-col items-center rounded-lg p-1.5 outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {/* Name floats above on hover rather than living under every icon. */}
      <span
        className={cn(
          'type-label pointer-events-none absolute -top-8 whitespace-nowrap rounded-md',
          'border border-border bg-popover px-2 py-1 text-popover-foreground opacity-0',
          'transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100',
        )}
      >
        {def.title}
      </span>

      {def.id === 'contact' ? (
        <DockBlob active={running} />
      ) : (
        <FolderGlyph def={def} active={running} />
      )}

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
