import { Moon, Sun } from 'lucide-react';
import type { ResolvedTheme } from '@/desktop/providers/useTheme';

interface Props {
  resolved: ResolvedTheme;
  onToggle: () => void;
}

export function ThemeToggle({ resolved, onToggle }: Props) {
  const next = resolved === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      onClick={onToggle}
      title={`Switch to ${next} mode`}
      aria-label={`Switch to ${next} mode`}
      className="grid size-7 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
    >
      {resolved === 'dark' ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
    </button>
  );
}
