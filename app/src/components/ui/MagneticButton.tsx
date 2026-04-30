import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export default function MagneticButton({ 
  children, 
  onClick, 
  className,
  variant = 'primary'
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    
    setPosition({ x: x * 0.35, y: y * 0.35 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const variants = {
    primary: "bg-white text-black hover:pr-14",
    secondary: "bg-[#1a1a1a] text-white border border-white/10 hover:border-[#FFB000]/30",
    outline: "bg-transparent text-white border border-white/20 hover:border-[#FFB000]"
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={cn(
        "group relative inline-flex items-center justify-center px-10 py-4 overflow-hidden transition-all duration-500",
        variants[variant],
        className
      )}
    >
      <span className="relative z-10 font-sans font-bold text-[10px] uppercase tracking-[0.3em]">
        {children}
      </span>
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-[#FFB000] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
      )}
    </motion.button>
  );
}
