import { Cake } from 'lucide-react';
import { IDENTITY } from '@/desktop/config/identity';
import { useIsMobile } from '@/desktop/providers/useIsMobile';
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
  const mobile = useIsMobile();

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

  /*
   * On a phone the countdown is a corner ornament, not a panel. It was taking a
   * full-width card with a heading and a year for what is, in the end, two
   * digits — space the home screen needs for the work. Same flaps, a quarter
   * the size, and the label is the aria description rather than printed twice.
   */
  if (mobile) {
    return (
      <div
        className="flex items-center gap-1 px-2.5 py-2"
        role="img"
        aria-label={`${days} days to go`}
      >
        {days.split('').map((digit, i) => (
          <FlipDigit key={`d${i}`} value={digit} compact />
        ))}
        <Label className="pl-1 text-[0.5625rem] leading-none text-subtle-foreground">
          days
        </Label>
      </div>
    );
  }

  return (
    <div className="w-full p-5 sm:w-[272px]">
      <div
        className="mb-3 flex items-end gap-1.5"
        role="img"
        aria-label={`${days} days, ${hours} hours, ${minutes} minutes to go`}
      >
        {days.split('').map((digit, i) => (
          <FlipDigit key={`d${i}`} value={digit} />
        ))}
        <Label className="pb-2 pl-0.5 text-subtle-foreground">days</Label>

        <Mono className="ml-auto pb-2 tabular-nums text-subtle-foreground">
          {hours}:{minutes}:{seconds}
        </Mono>
      </div>

      <div className="flex items-baseline justify-between border-t border-border pt-3">
        <Label className="text-subtle-foreground">Days to go</Label>
        <Mono className="text-subtle-foreground">{year}</Mono>
      </div>
    </div>
  );
}
