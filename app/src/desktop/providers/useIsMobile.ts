import { useEffect, useState } from 'react';
import { MOBILE_QUERY } from '@/desktop/config/layout';

/** Below this width the desktop metaphor changes shape rather than shrinking. */
export function useIsMobile() {
  const [mobile, setMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const onChange = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener('change', onChange);
    setMobile(mq.matches);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return mobile;
}
