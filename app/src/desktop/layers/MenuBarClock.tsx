import { useEffect, useState } from 'react';
import { Mono } from '@/desktop/typography/Text';

const format = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

export function MenuBarClock() {
  const [now, setNow] = useState(() => format(new Date()));

  useEffect(() => {
    const t = setInterval(() => setNow(format(new Date())), 15_000);
    return () => clearInterval(t);
  }, []);

  return <Mono as="time" className="shrink-0 text-foreground/70">{now}</Mono>;
}
