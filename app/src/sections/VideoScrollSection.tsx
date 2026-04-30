import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { PADX, BORDER_SUBTLE } from '../styles/layoutTokens';
import { loadYouTubeAPI, FILMS, BG_PLAYER_VARS, ytThumb } from '../lib/youtube';

const VIDEOS = [
  {
    title: "THE PEN",
    subtitle: "A Filmmaker",
    description: "A 1-minute short film exploring the weight of the creative tool. A meditation on the starting point of every vision.",
    ...FILMS['the-pen'],
    start: 0,
  },
  {
    title: "SEEN",
    subtitle: "Leo Captured",
    description: "A visceral 1-minute short exploring what it means to be truly witnessed. Raw emotion, single-take intensity.",
    ...FILMS['seen'],
    start: 0,
  },
  {
    title: "OPPORTUNITIES",
    subtitle: "Seed Creative",
    description: "Competition entry for Filmstro & Film Riot. A study in momentum, ambition, and the cost of hesitation.",
    ...FILMS['opportunities'],
    start: 0,
  },
  {
    title: "DREAM DATE",
    subtitle: "Howard Guo",
    description: "A 2-minute narrative exploring connection and vulnerability. Intimate cinematography, deliberate pacing.",
    ...FILMS['dream-date'],
    start: 0,
  },
  {
    title: "RUNAWAY",
    subtitle: "Daniel Zheng",
    description: "A visual study in escape and pursuit. Kinetic camera work, atmospheric grading, compressed storytelling.",
    ...FILMS['runaway'],
    start: 0,
  },
  {
    title: "NOT TODAY",
    subtitle: "Howw Films",
    description: "A quiet meditation on resistance and resolve. Understated performance, natural light, lingering frames.",
    ...FILMS['not-today'],
    start: 0,
  },
  {
    title: "TRYING",
    subtitle: "Arnav Sahu Films",
    description: "A cinematic short about the gap between intention and action. Bold color, handheld energy, honest narration.",
    ...FILMS['trying'],
    start: 0,
  },
];

const FILL_STYLE: React.CSSProperties = {
  position: 'absolute',
  top: '50%', left: '50%',
  width: '100%', height: '100%',
  minWidth: '177.78vh',
  minHeight: '56.25vw',
  transform: 'translate(-50%, -50%)',
};

export default function VideoScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef    = useRef<YT.Player | null>(null);
  const playerDivRef = useRef<HTMLDivElement>(null);

  const [activeIndex,  setActiveIndex]  = useState(0);
  const [playerLoaded, setPlayerLoaded] = useState(false);
  const [inView,       setInView]       = useState(false);

  const activeIdxRef = useRef(0);

  const { scrollYProgress } = useScroll({ target: containerRef });

  // ── Scroll → active index (mirrors original exactly) ─────────────
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

  // ── Load YouTube only when section enters viewport ────────────────
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.05 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // ── Create player once in view ────────────────────────────────────
  useEffect(() => {
    if (!inView || !playerDivRef.current) return;

    loadYouTubeAPI().then(() => {
      playerRef.current = new YT.Player(playerDivRef.current!, {
        host: 'https://www.youtube-nocookie.com',
        videoId: VIDEOS[0].id,
        playerVars: {
          ...BG_PLAYER_VARS,
          start:    VIDEOS[0].start,
          playlist: VIDEOS[0].id,
        },
        events: {
          onReady: (e) => {
            e.target.playVideo();
            setPlayerLoaded(true);
          },
        },
      });
    });

    return () => { playerRef.current?.destroy(); };
  }, [inView]);

  // ── Swap video on scroll — mirrors original seekAndPlay logic ─────
  useEffect(() => {
    if (!playerLoaded || !playerRef.current) return;
    // Load from start — tells the story from beginning
    playerRef.current.loadVideoById({
      videoId:      VIDEOS[activeIndex].id,
      startSeconds: VIDEOS[activeIndex].start,
    });
  }, [activeIndex, playerLoaded]);

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

        {/* ── Video area ─────────────────────────────────────────────── */}
        <div className="flex-1 relative overflow-hidden bg-black">

          {/* YouTube player — z-0, behind clip layers */}
          {inView && (
            <div className="absolute inset-0 z-0 overflow-hidden bg-black pointer-events-none">
              <div ref={playerDivRef} style={FILL_STYLE} />
            </div>
          )}

          {/* Clip-path reveal layers — same as original, now transparent after load */}
          {VIDEOS.map((video, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 overflow-hidden"
              initial={false}
              animate={{
                clipPath: i <= activeIndex
                  ? 'inset(0% 0% 0% 0%)'
                  : 'inset(0% 0% 100% 0%)',
                zIndex: VIDEOS.length - i,
              }}
              transition={{ clipPath: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
            >
              {/* Thumbnail shown until player ready — then transparent */}
              {!playerLoaded && (
                <img
                  src={ytThumb(video.id)}
                  alt={video.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
              )}
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
