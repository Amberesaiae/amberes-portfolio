import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import SystemOverlay from './ui/SystemOverlay';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { fullPageVariants, reducedMotionVariants } from '../styles/animationTokens';

export default function PageWrapper({ 
  children,
  bgImage
}: { 
  children: ReactNode,
  bgImage?: string
}) {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      variants={prefersReducedMotion ? reducedMotionVariants : fullPageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative min-h-screen bg-transparent"
    >
      {/* Static Background Image Layer */}
      <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden bg-[#050505]">
        {bgImage && (
          <>
            {/* Desktop: Full background image */}
            <img 
              src={bgImage} 
              className="hidden md:block w-full h-full object-cover opacity-[0.25] brightness-[0.7]"
              alt=""
            />
            {/* Mobile: Lighter SVG pattern instead of heavy image */}
            <div className="md:hidden absolute inset-0 opacity-[0.15]">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-pattern)" />
              </svg>
            </div>
          </>
        )}
        <div className="absolute inset-0 bg-[#050505]/40" />
        
        {/* Blueprint Markers */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-10 left-10 w-4 h-4 border-t border-l border-white" />
          <div className="absolute top-10 right-10 w-4 h-4 border-t border-r border-white" />
          <div className="absolute bottom-10 left-10 w-4 h-4 border-b border-l border-white" />
          <div className="absolute bottom-10 right-10 w-4 h-4 border-b border-r border-white" />
        </div>
      </div>

      <SystemOverlay />
      
      <div id="main-content" className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
