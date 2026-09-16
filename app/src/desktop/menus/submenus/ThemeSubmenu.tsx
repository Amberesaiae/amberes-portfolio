import { Check, Monitor, Moon, Sun } from 'lucide-react';
import {
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from '@/components/ui/context-menu';
import type { ThemePreference } from '@/desktop/providers/useTheme';

const THEMES: { id: ThemePreference; label: string; Icon: typeof Sun }[] = [
  { id: 'light', label: 'Light', Icon: Sun },
  { id: 'dark', label: 'Dark', Icon: Moon },
  { id: 'system', label: 'System', Icon: Monitor },
];

/** All three states, including the one the menu-bar toggle cannot express. */
export function ThemeSubmenu({
  preference,
  onSet,
}: {
  preference: ThemePreference;
  onSet: (next: ThemePreference) => void;
}) {
  return (
    <ContextMenuSub>
      <ContextMenuSubTrigger>Theme</ContextMenuSubTrigger>
      <ContextMenuSubContent className="w-40">
        {THEMES.map(({ id, label, Icon }) => (
          <ContextMenuItem key={id} onSelect={() => onSet(id)}>
            <Icon />
            {label}
            {preference === id && <Check className="ml-auto size-3.5" />}
          </ContextMenuItem>
        ))}
      </ContextMenuSubContent>
    </ContextMenuSub>
  );
}
