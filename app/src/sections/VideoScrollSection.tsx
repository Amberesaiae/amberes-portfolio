import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { PADX, BORDER_SUBTLE } from '../styles/layoutTokens';

// 15s WebM previews — VP9, ~250-750KB each, start from second 4 (skip title cards)
// MP4 fallback for older Safari
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
  const videoRefs    = useRef<(HTMLVideoElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIdxRef = useRef(0);

  const { scrollYProgress } = useScroll({ target: containerRef });

  // Scroll → active index (exact original pattern)
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

  // Play active video, pause others — exact original seekAndPlay pattern
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;

      if (i === activeIndex) {
        // Lazy-load: assign src only when first activated
        if (!video.getAttribute('src') && !video.querySelector('source')) {
          // Set sources dynamically
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

  return (
    <section
      id="selected-visuals"
      ref={containerRef}
      style={{ height: `${VIDEOS.length * 60}vh` }}
      className={`relative border-t ${BORDER_SUBTLE}`}
    >
      <div className="sticky top-0 min-h-screen w-full overflow-hidden bg-black flex flex-col">

        {/* Section label */}
        <div className={`absolute top-6 ${PADX.page} z-30`}>
          <AnimatePresence mode="wait">
            <motion.p
              key={activeIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="text-white/60 text-[9px] md:text-[10px] font-mono uppercase tracking-[0.3em]"
            >
              ({activeIndex + 1}) SELECTED VISUALS
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Video area — clip-path reveal, exact original */}
        <div className="flex-1 relative">
          {VIDEOS.map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0"
              initial={false}
              animate={{
                clipPath: i <= activeIndex
                  ? 'inset(0% 0% 0% 0%)'
                  : 'inset(0% 0% 100% 0%)',
                zIndex: i,
              }}
              transition={{ clipPath: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
            >
              <video
                ref={el => { videoRefs.current[i] = el; }}
                loop
                muted
                playsInline
                preload="none"
                className="w-full h-full object-contain"
              />
            </motion.div>
          ))}
        </div>

        {/* Title & description */}
        <div className={`relative z-20 ${PADX.page} py-6 md:py-8 bg-black flex-shrink-0`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
            >
              <h2 className="font-serif text-white text-3xl md:text-5xl tracking-tight uppercase mb-2">
                {VIDEOS[activeIndex].title}
                <span className="text-white/30 ml-4">— {VIDEOS[activeIndex].subtitle}</span>
              </h2>
              <p className="text-white/40 text-xs md:text-sm max-w-2xl leading-relaxed">
                {VIDEOS[activeIndex].description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress dots */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-3">
          {VIDEOS.map((_, i) => (
            <div
              key={i}
              className={`transition-all duration-500 rounded-full ${
                i === activeIndex ? 'w-2 h-2 bg-[#FFB000]' : 'w-1.5 h-1.5 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Bottom progress bar */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5 z-30">
          <motion.div
            className="h-full bg-[#FFB000]"
            style={{ width: useTransform(scrollYProgress, [0, 1], ['0%', '100%']) }}
          />
        </div>
      </div>
    </section>
  );
}
