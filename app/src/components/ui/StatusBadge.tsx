import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'shipped' | 'in-progress' | 'experiment' | 'default';
  className?: string;
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    shipped: 'text-green-400/80 border-green-400/20 bg-green-400/5',
    'in-progress': 'text-[#FFB000]/80 border-[#FFB000]/20 bg-[#FFB000]/5',
    experiment: 'text-blue-400/80 border-blue-400/20 bg-blue-400/5',
    default: 'text-[#555] border-white/10 bg-white/5'
  };

  return (
    <span className={cn(
      "text-[11px] md:text-[12px] uppercase tracking-[0.3em] font-mono px-4 py-1.5 border transition-colors duration-300",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
