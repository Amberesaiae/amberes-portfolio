import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { PADX, BORDER_SUBTLE } from '../styles/layoutTokens';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useViewport } from '../hooks/useViewport';

// 15s WebM previews — VP9, ~250-750KB each, start from second 4 (skip title cards)
const VIDEOS = [
  {
    title: "THE PEN",
    subtitle: "A Filmmaker",
    description: "A 1-minute short film exploring the weight of the creative tool. A meditation on the starting point of every vision.",
    webm: '/vids/previews/the-pen.webm',
    mp4:  '/vids/loops/the-pen.mp4',
  },
  {
    title: "SEEN",
    subtitle: "Leo Captured",
    description: "A visceral 1-minute short exploring what it means to be truly witnessed. Raw emotion, single-take intensity.",
    webm: '/vids/previews/seen.webm',
    mp4:  '/vids/loops/seen.mp4',
  },
  {
    title: "OPPORTUNITIES",
    subtitle: "Seed Creative",
    description: "Competition entry for Filmstro & Film Riot. A study in momentum, ambition, and the cost of hesitation.",
    webm: '/vids/previews/opportunities.webm',
    mp4:  '/vids/loops/opportunities.mp4',
  },
  {
    title: "DREAM DATE",
    subtitle: "Howard Guo",
    description: "A 2-minute narrative exploring connection and vulnerability. Intimate cinematography, deliberate pacing.",
    webm: '/vids/previews/dream-date.webm',
    mp4:  '/vids/loops/dream-date.mp4',
  },
  {
    title: "RUNAWAY",
    subtitle: "Daniel Zheng",
    description: "A visual study in escape and pursuit. Kinetic camera work, atmospheric grading, compressed storytelling.",
    webm: '/vids/previews/runaway.webm',
    mp4:  '/vids/loops/runaway.mp4',
  },
  {
    title: "NOT TODAY",
    subtitle: "Howw Films",
    description: "A quiet meditation on resistance and resolve. Understated performance, natural light, lingering frames.",
    webm: '/vids/previews/not-today.webm',
    mp4:  '/vids/loops/not-today.mp4',
  },
  {
    title: "TRYING",
    subtitle: "Arnav Sahu Films",
    description: "A cinematic short about the gap between intention and action. Bold color, handheld energy, honest narration.",
    webm: '/vids/previews/trying.webm',
    mp4:  '/vids/loops/trying.mp4',
  },
];

export default function VideoScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIdxRef = useRef(0);
  const touchStartY = useRef<number>(0);
  const touchStartX = useRef<number>(0);
  
  // Always call hooks unconditionally at the top level
  const prefersReducedMotion = useReducedMotion();
  const { isMobile } = useViewport();
  const { scrollYProgress } = useScroll({ target: containerRef });
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  // Scroll → active index
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (value) => {
      const segmentSize = 1 / VIDEOS.length;
      const index = Math.min(
        Math.floor(value / segmentSize),
        VIDEOS.length - 1
      );
      if (index !== activeIdxRef.current) {
        activeIdxRef.current = index;
        setActiveIndex(index);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Play active video, pause others
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;

      if (i === activeIndex) {
        // Lazy-load: assign src only when first activated
        if (!video.getAttribute('src') && !video.querySelector('source')) {
          const webmSrc = document.createElement('source');
          webmSrc.src  = VIDEOS[i].webm;
          webmSrc.type = 'video/webm';
          const mp4Src = document.createElement('source');
          mp4Src.src  = VIDEOS[i].mp4;
          mp4Src.type = 'video/mp4';
          video.appendChild(webmSrc);
          video.appendChild(mp4Src);
          video.load();
        }

        const play = () => {
          video.currentTime = 0;
          video.play().catch(() => {});
        };

        if (video.readyState >= 3) {
          play();
        } else {
          video.oncanplay = () => { play(); video.oncanplay = null; };
        }
      } else {
        video.pause();
      }
    });
  }, [activeIndex]);

  // Touch gesture handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaY = touchStartY.current - touchEndY;
    const deltaX = touchStartX.current - touchEndX;

    // Swipe threshold
    const threshold = 50;

    // Horizontal swipe for video navigation
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
      if (deltaX > 0 && activeIndex < VIDEOS.length - 1) {
        setActiveIndex(prev => prev + 1);
        activeIdxRef.current = activeIndex + 1;
      } else if (deltaX < 0 && activeIndex > 0) {
        setActiveIndex(prev => prev - 1);
        activeIdxRef.current = activeIndex - 1;
      }
    }
  }, [activeIndex]);

  // Click handlers for mobile dots
  const handleDotClick = useCallback((index: number) => {
    setActiveIndex(index);
    activeIdxRef.current = index;
  }, []);

  // Reduced motion: disable scroll-based video switching, use simple navigation
  const sectionHeight = isMobile ? `${VIDEOS.length * 40}vh` : `${VIDEOS.length * 60}vh`;

  return (
    <section
      id="selected-visuals"
      ref={containerRef}
      style={{ height: prefersReducedMotion ? 'auto' : sectionHeight }}
      className={`relative border-t ${BORDER_SUBTLE}`}
      onTouchStart={isMobile ? handleTouchStart : undefined}
      onTouchEnd={isMobile ? handleTouchEnd : undefined}
    >
      <div className={`${prefersReducedMotion ? 'relative' : 'sticky top-0'} min-h-screen w-full overflow-hidden bg-black flex flex-col`}>

        {/* Section label */}
        <div className={`absolute top-6 ${PADX.page} z-30`}>
          <AnimatePresence mode="wait">
            <motion.p
              key={activeIndex}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
              className="text-white/60 text-[9px] md:text-[10px] font-mono uppercase tracking-[0.3em]"
            >
              ({activeIndex + 1}) SELECTED VISUALS
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Video area */}
        <div className="flex-1 relative">
          {VIDEOS.map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0"
              initial={prefersReducedMotion ? { opacity: i === activeIndex ? 1 : 0 } : false}
              animate={{
                opacity: i === activeIndex ? 1 : 0,
                clipPath: prefersReducedMotion 
                  ? undefined 
                  : i <= activeIndex ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)',
                zIndex: i,
              }}
              transition={{ 
                duration: prefersReducedMotion ? 0 : 0.8,
                ease: [0.76, 0, 0.24, 1]
              }}
            >
              <video
                ref={el => { videoRefs.current[i] = el; }}
                loop
                muted
                playsInline
                preload={i <= activeIndex + 1 ? "metadata" : "none"}
                className="w-full h-full object-contain"
                aria-label={VIDEOS[i].title}
              />
            </motion.div>
          ))}
        </div>

        {/* Title & description */}
        <div className={`relative z-20 ${PADX.page} py-6 md:py-8 bg-black flex-shrink-0`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: [0.33, 1, 0.68, 1] }}
            >
              <h2 className="font-serif text-white text-2xl md:text-5xl tracking-tight uppercase mb-2">
                {VIDEOS[activeIndex].title}
                <span className="text-white/30 ml-2 md:ml-4 text-lg md:text-3xl">— {VIDEOS[activeIndex].subtitle}</span>
              </h2>
              <p className="text-white/40 text-xs md:text-sm max-w-2xl leading-relaxed">
                {VIDEOS[activeIndex].description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress dots - visible on all devices, clickable on mobile */}
        <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-1">
          {VIDEOS.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              className="flex items-center justify-center w-8 h-8 touch-target"
              aria-label={`Go to video ${i + 1}: ${VIDEOS[i].title}`}
              aria-current={i === activeIndex ? 'true' : 'false'}
            >
              <div className={`transition-all duration-500 rounded-full ${
                i === activeIndex ? 'w-2 h-2 bg-[#FFB000]' : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
              }`} />
            </button>
          ))}
        </div>

        {/* Mobile swipe hint */}
        {isMobile && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 text-white/30 text-[10px] uppercase tracking-widest animate-pulse">
            Swipe to navigate
          </div>
        )}

        {/* Bottom progress bar - hidden on mobile */}
        {!isMobile && (
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5 z-30">
            <motion.div
              className="h-full bg-[#FFB000]"
              style={{ width: progressWidth }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
