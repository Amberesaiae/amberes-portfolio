import type { ReactNode } from 'react';

export function Pane({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`px-5 py-5 sm:px-7 sm:py-6 ${className}`}>{children}</div>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.28em] text-white/40">{children}</p>
  );
}

export function Rule() {
  return <hr className="my-6 border-0 border-t border-white/10" />;
}
