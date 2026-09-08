import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface ScrollIndicatorProps {
  containerRef: React.RefObject<HTMLDivElement>;
  className?: string;
  showArrow?: boolean;
  showGradient?: boolean;
}

export default function ScrollIndicator({ 
  containerRef, 
  className = '',
  showArrow = true,
  showGradient = true
}: ScrollIndicatorProps) {
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const checkScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const isScrollable = scrollWidth > clientWidth;
      const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10; // 10px threshold
      
      setShowIndicator(isScrollable && !isAtEnd);
    };

    checkScroll();
    container.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      container.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [containerRef]);

  if (!showIndicator) return null;

  return (
    <>
      {/* Gradient fade */}
      {showGradient && (
        <div 
          className={`absolute right-0 top-0 bottom-0 w-24 pointer-events-none bg-gradient-to-l from-black/80 to-transparent z-10 ${className}`}
          aria-hidden="true"
        />
      )}
      
      {/* Arrow indicator */}
      {showArrow && (
        <div 
          className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 pointer-events-none ${className}`}
          aria-hidden="true"
        >
          <div className="animate-pulse">
            <ChevronRight className="text-white/40 w-6 h-6" />
          </div>
        </div>
      )}
    </>
  );
}
