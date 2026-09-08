import { useState, useEffect } from 'react';

export default function SystemClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-6 font-mono text-[9px] uppercase tracking-[0.2em] text-[#555]">
      <div className="flex flex-col items-end">
        <span className="text-white/40">SYSTEM_TIME</span>
        <span>{time.toLocaleTimeString('en-US', { hour12: false })}</span>
      </div>
      <div className="h-6 w-[1px] bg-[#222]" />
      <div className="flex flex-col items-end">
        <span className="text-white/40">LOC_ID</span>
        <span>ACCRA_GH // GMT</span>
      </div>
    </div>
  );
}
