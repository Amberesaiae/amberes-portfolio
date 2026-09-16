import { useEffect, useState } from 'react';

const ZONE = 'Africa/Accra';

interface Clock {
  hours: string;
  minutes: string;
  seconds: string;
  weekday: string;
  date: string;
}

function read(): Clock {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: ZONE,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(now);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '00';

  return {
    hours: get('hour'),
    minutes: get('minute'),
    seconds: get('second'),
    weekday: new Intl.DateTimeFormat('en-GB', { timeZone: ZONE, weekday: 'long' }).format(now),
    date: new Intl.DateTimeFormat('en-GB', { timeZone: ZONE, day: 'numeric', month: 'long' }).format(now),
  };
}

/**
 * Accra time, ticking once a second.
 *
 * The interval stops while the tab is hidden — a clock nobody is looking at
 * should not keep a timer alive, and it resyncs on return rather than drifting.
 */
export function useAccraClock(): Clock {
  const [clock, setClock] = useState(read);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;

    const start = () => {
      setClock(read());
      timer = setInterval(() => setClock(read()), 1000);
    };
    const stop = () => {
      if (timer) clearInterval(timer);
      timer = undefined;
    };

    const onVisibility = () => (document.hidden ? stop() : start());

    start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return clock;
}
