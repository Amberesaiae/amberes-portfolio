import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PATH_TO_WINDOW } from '@/desktop/config/routes';
import { useDesktop, useDesktopDispatch } from './windowStore';

/**
 * The URL is a projection of window state, not its driver: it is read once per
 * navigation (deep link, back button) and written whenever focus changes. One
 * ref guards both directions so they cannot chase each other.
 */
export function useRouteSync() {
  const { windows, focused } = useDesktop();
  const dispatch = useDesktopDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const lastPath = useRef('');

  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;

    const [, head, tail] = pathname.split('/');
    const id = head ? PATH_TO_WINDOW[head] : undefined;
    if (id) dispatch({ type: 'open', id, arg: tail || undefined });
  }, [pathname, dispatch]);

  useEffect(() => {
    const path = focused && windows[focused].open ? `/${focused}` : '/';
    if (path === lastPath.current) return;
    lastPath.current = path;
    navigate(path);
  }, [focused, windows, navigate]);
}
