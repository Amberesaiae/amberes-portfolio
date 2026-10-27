import { useEffect, useState } from 'react';

type NetInfo = EventTarget & {
  saveData?: boolean;
  effectiveType?: string;
};

function thinLink() {
  if (typeof navigator === 'undefined') return false;
  const conn = (navigator as Navigator & { connection?: NetInfo }).connection;
  return conn?.saveData === true || /^(slow-)?2g$/.test(conn?.effectiveType ?? '');
}

/**
 * A canvas loading effect is the wrong trade on a link that already asked us
 * to be quiet. Reduced motion is not handled here — ascii-reveal turns that
 * into a still field and a short fade on its own.
 */
export function useSaveData() {
  const [thin, setThin] = useState(thinLink);

  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: NetInfo }).connection;
    if (!conn?.addEventListener) return;
    const update = () => setThin(thinLink());
    conn.addEventListener('change', update);
    return () => conn.removeEventListener('change', update);
  }, []);

  return thin;
}
