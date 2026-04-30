import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { PADX, BORDER_SUBTLE } from '../styles/layoutTokens';
import { loadYouTubeAPI, FILM_IDS } from '../lib/youtube';

const VIDEOS = [
  {
    title: "THE PEN",
    subtitle: "A Filmmaker",
    description: "A 1-minute short film exploring the weight of the creative tool. A meditation on the starting point of every vision.",
    id: FILM_IDS['the-pen'],
  },
  {
    title: "SEEN",
    subtitle: "Leo Captured",
    description: "A visceral 1-minute short exploring what it means to be truly witnessed. Raw emotion, single-take intensity.",
    id: FILM_IDS['seen'],
  },
  {
    title: "OPPORTUNITIES",
    subtitle: "Seed Creative",
    description: "Competition entry for Filmstro & Film Riot. A study in momentum, ambition, and the cost of hesitation.",
    id: FILM_IDS['opportunities'],
  },
  {
    title: "DREAM DATE",
    subtitle: "Howard Guo",
    description: "A 2-minute narrative exploring connection and vulnerability. Intimate cinematography, deliberate pacing.",
    id: FILM_IDS['dream-date'],
  },
  {
    title: "RUNAWAY",
    subtitle: "Daniel Zheng",
    description: "A visual study in escape and pursuit. Kinetic camera work, atmospheric grading, compressed storytelling.",
    id: FILM_IDS['runaway'],
  },
  {
    title: "NOT TODAY",
    subtitle: "Howw Films",
    description: "A quiet meditation on resistance and resolve. Understated performance, natural light, lingering frames.",
    id: FILM_IDS['not-today'],
  },
  {
    title: "TRYING",
    subtitle: "Arnav Sahu Films",
    description: "A cinematic short about the gap between intention and action. Bold color, handheld energy, honest narration.",
    id: FILM_IDS['trying'],
  },
];

export default function VideoScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [ytReady, setYtReady] = useState(false);
  const activeIndexRef = useRef(0);

  const { scrollYProgress } = useScroll({ target: containerRef });

  // Track active index from scroll
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (value) => {
      const index = Math.min(
        Math.floor(value / (1 / VIDEOS.length)),
        VIDEOS.length - 1
      );
      if (index !== activeIndexRef.current) {
        activeIndexRef.current = index;
        setActiveIndex(index);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Load YouTube API and create single player
  useEffect(() => {
    loadYouTubeAPI().then(() => {
      playerRef.current = new YT.Player(playerContainerRef.current!, {
        videoId: VIDEOS[0].id,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          loop: 1,
          playsinline: 1,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          disablekb: 1,
          playlist: VIDEOS[0].id,
        },
        events: {
          onReady: (e) => {
            e.target.playVideo();
            setYtReady(true);
          },
        },
      });
    });

    return () => {
      playerRef.current?.destroy();
    };
  }, []);

  // Swap video when active index changes
  useEffect(() => {
    if (!ytReady || !playerRef.current) return;
    playerRef.current.loadVideoById({
      videoId: VIDEOS[activeIndex].id,
      startSeconds: 0,
    });
  }, [activeIndex, ytReady]);

  return (
    <section
      id="selected-visuals"
      ref={containerRef}
      style={{ height: `${VIDEOS.length * 60}vh` }}
      className={`relative border-t ${BORDER_SUBTLE}`}
    >
      {/* Sticky viewport */}
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

        {/* YouTube player — fills the video area */}
        <div className="flex-1 relative overflow-hidden bg-black">
          {/* Clip-path reveal layers per video */}
          {VIDEOS.map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 bg-black"
              initial={false}
              animate={{
                clipPath: i <= activeIndex
                  ? 'inset(0% 0% 0% 0%)'
                  : 'inset(0% 0% 100% 0%)',
                zIndex: i,
              }}
              transition={{ clipPath: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
            />
          ))}

          {/* Single YouTube player on top of all clip layers */}
          <div className="absolute inset-0 z-[10] pointer-events-none">
            {/* Scale iframe to fill container regardless of aspect ratio */}
            <div
              ref={playerContainerRef}
              className="absolute"
              style={{
                // YouTube iframes are 16:9 — scale to cover the container
                top: '50%',
                left: '50%',
                width: '100%',
                height: '100%',
                minWidth: '177.78vh', // 16/9 * 100vh
                minHeight: '56.25vw', // 9/16 * 100vw
                transform: 'translate(-50%, -50%)',
              }}
            />
          </div>
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
