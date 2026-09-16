import { useEffect, useState } from 'react';

/** 26 October. Month is zero-based, so 9 is October. */
const BIRTH_MONTH = 9;
const BIRTH_DAY = 26;

export interface Countdown {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  /** true on the day itself */
  today: boolean;
  /** the year being counted to */
  year: number;
}

const pad = (n: number) => String(Math.max(0, n)).padStart(2, '0');

function read(): Countdown {
  const now = new Date();
  const year = now.getFullYear();
  const todayIsIt = now.getMonth() === BIRTH_MONTH && now.getDate() === BIRTH_DAY;

  // Once the day has passed, count to next year's.
  let target = new Date(year, BIRTH_MONTH, BIRTH_DAY);
  if (now > target && !todayIsIt) target = new Date(year + 1, BIRTH_MONTH, BIRTH_DAY);

  const ms = target.getTime() - now.getTime();

  return {
    days: String(Math.max(0, Math.floor(ms / 86_400_000))),
    hours: pad(Math.floor(ms / 3_600_000) % 24),
    minutes: pad(Math.floor(ms / 60_000) % 60),
    seconds: pad(Math.floor(ms / 1000) % 60),
    today: todayIsIt,
    year: target.getFullYear(),
  };
}

/**
 * How long until 26 October.
 *
 * The interval stops while the tab is hidden and resyncs from the clock on
 * return, so it never drifts and never keeps a timer alive for a screen nobody
 * is looking at.
 */
export function useBirthdayCountdown(): Countdown {
  const [countdown, setCountdown] = useState(read);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;

    const start = () => {
      setCountdown(read());
      timer = setInterval(() => setCountdown(read()), 1000);
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

  return countdown;
}
