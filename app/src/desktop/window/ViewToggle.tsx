import { LayoutGrid, Rows3 } from 'lucide-react';
import type { ViewMode } from '@/desktop/config/views';
import { cn } from '@/lib/utils';

interface Props {
  mode: ViewMode;
  onChange: (next: ViewMode) => void;
}

const OPTIONS: { id: ViewMode; label: string; Icon: typeof Rows3 }[] = [
  { id: 'list', label: 'List', Icon: Rows3 },
  { id: 'grid', label: 'Grid', Icon: LayoutGrid },
];

/**
 * A segmented control in the title bar. It sits in the window chrome rather
 * than inside the pane because it is a property of the window, not of the
 * content — the same reason the close button lives there.
 */
export function ViewToggle({ mode, onChange }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="View"
      onPointerDown={(e) => e.stopPropagation()}
      className="flex items-center gap-0.5 rounded-md border border-border bg-foreground/[0.04] p-0.5"
    >
      {OPTIONS.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={mode === id}
          aria-label={label}
          title={label}
          onClick={() => onChange(id)}
          className={cn(
            'grid size-5 place-items-center rounded transition-colors',
            mode === id
              ? 'bg-foreground/10 text-foreground'
              : 'text-subtle-foreground hover:text-foreground',
          )}
        >
          <Icon className="size-3" />
        </button>
      ))}
    </div>
  );
}
