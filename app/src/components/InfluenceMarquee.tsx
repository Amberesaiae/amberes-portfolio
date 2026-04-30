import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CONTAINER, CENTER, PADX } from '../styles/layoutTokens';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useTouchDevice } from '../hooks/useTouchDevice';

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    title: 'Theology & Spirit',
    authors: ['Arthur Pink', 'Charles Spurgeon', 'A.W. Tozer', 'Derek Prince', 'John Bunyan']
  },
  {
    title: 'Poetry & Prose',
    authors: ['William Blake', 'Robert Frost', 'Shakespeare', 'Osamu Dazai']
  },
  {
    title: 'Narrative & Light',
    authors: ['C.S. Lewis', 'Hannah Hurnard', 'Pilgrim\'s Progress', 'Mere Christianity']
  }
];

export default function InfluenceMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { isTouchOptimized } = useTouchDevice();

  useEffect(() => {
    // Skip animations on reduced motion or touch-optimized devices
    if (prefersReducedMotion || isTouchOptimized) {
      // Make all elements visible immediately
      const drawers = containerRef.current?.querySelectorAll('.catalog-drawer');
      if (drawers) {
        gsap.set(drawers, { opacity: 1, y: 0 });
      }
      return;
    }

    const ctx = gsap.context(() => {
      const drawers = containerRef.current?.querySelectorAll('.catalog-drawer');
      if (drawers && drawers.length > 0) {
        gsap.fromTo(drawers,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.05,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    }, containerRef);
    
    return () => ctx.revert();
  }, [prefersReducedMotion, isTouchOptimized]);

  return (
    <div ref={containerRef} className={`py-20 bg-[#0a0a0a] border-y border-white/5`}>
      <div className={`${CONTAINER.content} ${CENTER} ${PADX.page}`}>
        
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 gap-8">
          <div className="flex items-baseline gap-4">
            <h2 className="font-serif text-white text-3xl md:text-5xl">
              THE LIBRARY
            </h2>
            <p className="text-[#555] text-[10px] uppercase tracking-[0.4em] font-medium">Internal Architecture</p>
          </div>
          <p className="text-[#444] text-[10px] uppercase tracking-[0.3em] font-serif italic max-w-xs md:text-right">
            "Literature is life."
          </p>
        </div>

        <div className="space-y-12">
          {categories.map((cat, i) => (
            <div key={i} className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="text-[#333] text-[9px] uppercase tracking-[0.4em] whitespace-nowrap">
                  {cat.title}
                </span>
                <div className="h-[1px] flex-grow bg-white/5" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {cat.authors.map((author, j) => (
                  <div 
                    key={j} 
                    className="catalog-drawer group relative h-14 bg-[#0d0d0d] border border-white/5 flex items-center px-4 transition-all duration-500 hover:border-[#FFB000]/30 hover:bg-[#111] overflow-hidden touch-target"
                    style={{ opacity: prefersReducedMotion ? 1 : undefined }}
                  >
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-6 bg-white/5 group-hover:bg-[#FFB000] transition-colors duration-500" />
                    <span className="text-[#FFB000] font-serif text-sm md:text-base opacity-60 group-hover:opacity-100 transition-opacity duration-500 truncate">
                      {author}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
