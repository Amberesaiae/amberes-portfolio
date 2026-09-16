import { Cake } from 'lucide-react';
import { IDENTITY } from '@/desktop/config/identity';
import { Display, Label, Mono } from '@/desktop/typography/Text';
import { FlipDigit } from './FlipDigit';
import { useBirthdayCountdown } from './useBirthdayCountdown';

/**
 * Days to 26 October, on split-flap.
 *
 * Days get as many cards as the number needs — three digits for most of the
 * year, two as it closes in — so the board grows and shrinks the way a real one
 * would rather than padding to a fixed width.
 */
export function FlipClock() {
  const { days, hours, minutes, seconds, today, year } = useBirthdayCountdown();

  // On the day the card stops counting and turns amber. It is the one moment
  // the site is allowed to be about him rather than about the work.
  if (today) {
    return (
      <div className="relative w-[272px] overflow-hidden rounded-xl p-5">
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary to-[#ffb07a]"
        />
        <div className="relative">
          <div className="flex items-center gap-2.5">
            <Cake className="size-4 text-primary-foreground" />
            <Label className="text-primary-foreground/85">Today</Label>
          </div>

          <Display className="mt-3 text-[1.75rem] text-primary-foreground">
            Happy birthday, {IDENTITY.handle}
          </Display>

          <Mono className="mt-3 block text-primary-foreground/70">{year}</Mono>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[272px] p-5">
      <div
        className="mb-3 flex items-end gap-1.5"
        role="img"
        aria-label={`${days} days, ${hours} hours, ${minutes} minutes to go`}
      >
        {days.split('').map((digit, i) => (
          <FlipDigit key={`d${i}`} value={digit} />
        ))}
        <Label className="pb-2 pl-0.5 text-muted-foreground/60">days</Label>

        <Mono className="ml-auto pb-2 tabular-nums text-muted-foreground/70">
          {hours}:{minutes}:{seconds}
        </Mono>
      </div>

      <div className="flex items-baseline justify-between border-t border-border pt-3">
        <Label className="text-muted-foreground/70">Days to go</Label>
        <Mono className="text-muted-foreground/60">{year}</Mono>
      </div>
    </div>
  );
}
