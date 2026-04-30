import { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const FlipUnit = ({ value, label, wide = false }: { value: number; label: string; wide?: boolean }) => {
  const [currentValue, setCurrentValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (value !== currentValue) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentValue(value);
        setIsAnimating(false);
      }, 600); // Faster animation
    }
  }, [value, currentValue]);

  const format = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="flip-unit-wrapper">
      <div className={`flip-unit ${isAnimating ? 'flip-animating' : ''} ${wide ? 'wide' : ''}`}>
        <div className="flip-card">
          <div className="flip-card-top"><span>{format(isAnimating ? currentValue : value)}</span></div>
          <div className="flip-card-bottom"><span>{format(value)}</span></div>
        </div>
      </div>
      <span className="text-[#555] text-[10px] uppercase tracking-wider">{label}</span>
    </div>
  );
};

export default function BirthdayCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft => {
      const now = new Date();
      const currentYear = now.getFullYear();
      let birthday = new Date(currentYear, 9, 26); // Oct 26
      
      if (now > birthday) {
        birthday = new Date(currentYear + 1, 9, 26);
      }
      
      const difference = birthday.getTime() - now.getTime();
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000); // 1000ms for smoothness

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flip-clock">
      <FlipUnit value={timeLeft.days} label="Days" wide={true} />
      <FlipUnit value={timeLeft.hours} label="Hours" />
      <FlipUnit value={timeLeft.minutes} label="Minutes" />
      <FlipUnit value={timeLeft.seconds} label="Seconds" />
    </div>
  );
}
