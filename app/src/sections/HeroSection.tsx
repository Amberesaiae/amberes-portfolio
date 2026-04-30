import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Badge from '../components/ui/StatusBadge';
import TextReveal from '../components/ui/TextReveal';
import { PADX } from '../styles/layoutTokens';
import { loadYouTubeAPI, FILM_IDS } from '../lib/youtube';

// Ordered list of video IDs for the hero reel
const HERO_IDS = [
  FILM_IDS['the-pen'],
  FILM_IDS['opportunities'],
  FILM_IDS['seen'],
  FILM_IDS['dream-date'],
  FILM_IDS['runaway'],
  FILM_IDS['not-today'],
  FILM_IDS['trying'],
];

const SNIPPET_DURATION = 3.5; // seconds per snippet

// Shared player vars for silent background autoplay
const PLAYER_VARS = {
  autoplay: 1,
  mute: 1,
  controls: 0,
  loop: 1,
  playsinline: 1,
  modestbranding: 1,
  rel: 0,
  showinfo: 0,
  iv_load_policy: 3, // hide annotations
  disablekb: 1,
};

export default function HeroSection() {
  const playerARef = useRef<YT.Player | null>(null);
  const playerBRef = useRef<YT.Player | null>(null);
  const containerARef = useRef<HTMLDivElement>(null);
  const containerBRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showA, setShowA] = useState(true);
  const showARef = useRef(true);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    showARef.current = showA;
  }, [showA]);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    loadYouTubeAPI().then(() => {
      // Create player A with first video
      playerARef.current = new YT.Player(containerARef.current!, {
        videoId: HERO_IDS[0],
        playerVars: { ...PLAYER_VARS, playlist: HERO_IDS[0] },
        events: {
          onReady: (e) => e.target.playVideo(),
        },
      });

      // Create player B with second video (preloaded, hidden)
      playerBRef.current = new YT.Player(containerBRef.current!, {
        videoId: HERO_IDS[1],
        playerVars: { ...PLAYER_VARS, playlist: HERO_IDS[1] },
        events: {
          onReady: (e) => e.target.playVideo(),
        },
      });

      // Crossfade interval
      interval = setInterval(() => {
        const next = (activeIndexRef.current + 1) % HERO_IDS.length;
        const nextNext = (next + 1) % HERO_IDS.length;

        if (showARef.current) {
          // A is visible → load next into B, then show B
          playerBRef.current?.loadVideoById({ videoId: HERO_IDS[next], startSeconds: 0 });
          // Preload the one after into A while B is showing
          setTimeout(() => {
            playerARef.current?.cueVideoById({ videoId: HERO_IDS[nextNext], startSeconds: 0 });
          }, 1000);
        } else {
          // B is visible → load next into A, then show A
          playerARef.current?.loadVideoById({ videoId: HERO_IDS[next], startSeconds: 0 });
          setTimeout(() => {
            playerBRef.current?.cueVideoById({ videoId: HERO_IDS[nextNext], startSeconds: 0 });
          }, 1000);
        }

        setShowA(s => !s);
        setActiveIndex(next);
      }, SNIPPET_DURATION * 1000);
    });

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen w-screen flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* YouTube background players */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          {/* Player A */}
          <div
            className={`absolute inset-0 transition-opacity duration-700 ${showA ? 'opacity-45' : 'opacity-0'}`}
          >
            <div ref={containerARef} className="w-full h-full" />
          </div>
          {/* Player B */}
          <div
            className={`absolute inset-0 transition-opacity duration-700 ${!showA ? 'opacity-45' : 'opacity-0'}`}
          >
            <div ref={containerBRef} className="w-full h-full" />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/90" />
      </div>

      {/* Content */}
      <div className={`relative z-10 w-full ${PADX.page} text-center`}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.19, 1, 0.22, 1] }}
          className="text-white text-xs md:text-sm mb-6 uppercase tracking-[0.28em] md:tracking-[0.6em] font-black"
        >
          Engineer. Creative Director. Builder of Worlds.
        </motion.p>

        <h1
          className="font-serif text-white leading-[0.85] mb-12 drop-shadow-2xl uppercase"
          style={{ fontSize: 'clamp(44px, 11vw, 160px)' }}
        >
          <span className="block overflow-hidden">
            <TextReveal text="EVERY SYSTEM" />
          </span>
          <span className="block overflow-hidden">
            <TextReveal text="TELLS" delay={0.2} className="text-[#FFB000] italic" />
            <TextReveal text=" A STORY." delay={0.4} />
          </span>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1, ease: [0.19, 1, 0.22, 1] }}
          className="max-w-xl mx-auto px-1"
        >
          <p className="text-white text-lg md:text-xl leading-relaxed mb-12 font-light italic font-serif">
            "Bridging the cold logic of digital architecture with the visceral soul of visual storytelling.
            Every system is a sequence; every frame is a choice."
          </p>

          <div className="flex flex-col items-center gap-10">
            <button
              onClick={() => document.getElementById('selected-visuals')?.scrollIntoView({ behavior: 'smooth' })}
              className="relative px-6 md:px-10 py-3 md:py-5 border border-[#FFB000]/30 text-[#FFB000] text-[10px] uppercase tracking-[0.5em] font-black hover:bg-[#FFB000] hover:text-black transition-all duration-500 overflow-hidden group"
            >
              <span className="relative z-10">Watch Reel</span>
              <div className="absolute inset-0 bg-[#FFB000] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            </button>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-[1.5px] h-20 bg-gradient-to-b from-[#FFB000] to-transparent mt-6"
            />
          </div>
        </motion.div>
      </div>

      {/* Scene counter */}
      <div className="absolute bottom-24 left-6 md:left-10 z-10 hidden md:block">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5 }}
          className="font-mono text-[8px] text-white/80 uppercase tracking-[0.4em] space-y-2"
        >
          <Badge variant="default" className="border-none bg-white/10 px-3 py-1 mb-2 text-[#FFB000]">
            REEL_{String(activeIndex + 1).padStart(2, '0')} / {String(HERO_IDS.length).padStart(2, '0')}
          </Badge>
          <div className="pl-1">SNIPPET_ENGINE // ACTIVE // {SNIPPET_DURATION}s_CYCLE</div>
        </motion.div>
      </div>
    </section>
  );
}
