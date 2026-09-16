import { useEffect } from 'react';
import { IDENTITY } from '@/desktop/config/identity';
import { WINDOW_DEFS } from '@/desktop/config/windows';
import { useDesktop } from './windowStore';

const DEFAULT_TITLE = `${IDENTITY.handle} — ${IDENTITY.titleShort}`;

/** The focused window names the tab, so bookmarks and history stay meaningful. */
export function useDocumentTitle() {
  const { windows, focused } = useDesktop();

  useEffect(() => {
    document.title =
      focused && windows[focused].open ? `${WINDOW_DEFS[focused].title} — ${IDENTITY.handle}` : DEFAULT_TITLE;
  }, [focused, windows]);
}
