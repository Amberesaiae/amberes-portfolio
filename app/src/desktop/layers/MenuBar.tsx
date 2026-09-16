import { MENUBAR_H } from '@/desktop/config/layout';
import type { ResolvedTheme } from '@/desktop/providers/useTheme';
import { IdentityMenu } from './IdentityMenu';
import { MenuBarClock } from './MenuBarClock';
import { ThemeToggle } from './ThemeToggle';
import { MenuBarWindowList } from './MenuBarWindowList';

interface Props {
  onTidy: () => void;
  theme: ResolvedTheme;
  onToggleTheme: () => void;
}

/** The only persistent chrome: name, open windows, tidy, clock. */
export function MenuBar({ onTidy, theme, onToggleTheme }: Props) {
  return (
    <header
      className="fixed inset-x-0 top-0 z-[1000] flex items-center gap-4 border-b border-border bg-glass px-3 backdrop-blur-xl sm:px-4"
      style={{ height: MENUBAR_H, paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <IdentityMenu />

      <MenuBarWindowList />

      <button
        type="button"
        onClick={onTidy}
        className="type-label hidden shrink-0 text-foreground/45 transition-colors hover:text-foreground/85 md:block"
      >
        Tidy up
      </button>

      <ThemeToggle resolved={theme} onToggle={onToggleTheme} />

      <MenuBarClock />
    </header>
  );
}
