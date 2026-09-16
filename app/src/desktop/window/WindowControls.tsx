import { Minus, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ControlProps {
  label: string;
  colour: string;
  Icon: typeof X;
  onClick: () => void;
}

/**
 * One traffic light.
 *
 * The glyph only appears when the group is hovered, which is the detail that
 * makes these read as real controls rather than three coloured dots: you can
 * see what each one does the moment you go for it, and not before.
 */
function Control({ label, colour, Icon, onClick }: ControlProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerDown={(e) => e.stopPropagation()}
      className={cn(
        'grid size-3 place-items-center rounded-full border border-black/25',
        'transition-transform active:scale-90',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring',
        colour,
      )}
    >
      <Icon
        className="size-2 stroke-[3.5] text-black/55 opacity-0 transition-opacity group-hover/controls:opacity-100"
        aria-hidden="true"
      />
    </button>
  );
}

interface Props {
  maximized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
}

export function WindowControls({ maximized, onClose, onMinimize, onToggleMaximize }: Props) {
  return (
    <div className="group/controls flex items-center gap-2">
      <Control label="Close" colour="bg-[#ff5f57]" Icon={X} onClick={onClose} />
      <Control label="Minimise" colour="bg-[#febc2e]" Icon={Minus} onClick={onMinimize} />
      <Control
        label={maximized ? 'Restore' : 'Maximise'}
        colour="bg-[#28c840]"
        Icon={Plus}
        onClick={onToggleMaximize}
      />
    </div>
  );
}
