import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Badge from '../components/ui/StatusBadge';
import TextReveal from '../components/ui/TextReveal';
import { PADX } from '../styles/layoutTokens';
import { loadYouTubeAPI, FILMS, BG_PLAYER_VARS, ytThumb } from '../lib/youtube';

const HERO_VIDEOS = [
  FILMS['the-pen'],
  FILMS['opportunities'],
  FILMS['seen'],
  FILMS['dream-date'],
  FILMS['runaway'],
  FILMS['not-today'],
  FILMS['trying'],
];

const SNIPPET_DURATION = 3.5;

export default function HeroSection() {
  const playerARef = useRef<YT.Player | null>(null);
  const playerBRef = useRef<YT.Player | null>(null);
  const divARef = useRef<HTMLDivElement>(null);
  const divBRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [showA, setShowA] = useState(true);
  const [aReady, setAReady] = useState(false);
  const [bReady, setBReady] = useState(false);
  const [ytLoaded, setYtLoaded] = useState(false);

  const showARef = useRef(true);
  const activeIdxRef = useRef(0);
  const aReadyRef = useRef(false);
  const bReadyRef = useRef(false);

  useEffect(() => { showARef.current = showA; }, [showA]);
  useEffect(() => { activeIdxRef.current = activeIndex; }, [activeIndex]);
  useEffect(() => { aReadyRef.current = aReady; }, [aReady]);
  useEffect(() => { bReadyRef.current = bReady; }, [bReady]);

  // Defer YouTube loading until after loading screen (3.5s)
  useEffect(() => {
    const timer = setTimeout(() => {
      loadYouTubeAPI().then(() => setYtLoaded(true));
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  // Create players once YT is loaded
  useEffect(() => {
    if (!ytLoaded) return;

    let interval: ReturnType<typeof setInterval>;

    // Player A
    playerARef.current = new YT.Player(divARef.current!, {
      host: 'https://www.youtube-nocookie.com',
      videoId: HERO_VIDEOS[0].id,
      playerVars: {
        ...BG_PLAYER_VARS,
        start: HERO_VIDEOS[0].start,
        playlist: HERO_VIDEOS[0].id,
      },
      events: {
        onReady: (e) => e.target.playVideo(),
        onStateChange: (e) => {
          if (e.data === YT.PlayerState.PLAYING && !aReadyRef.current) {
            setAReady(true);
          }
        },
      },
    });

    // Player B
    playerBRef.current = new YT.Player(divBRef.current!, {
      host: 'https://www.youtube-nocookie.com',
      videoId: HERO_VIDEOS[1].id,
      playerVars: {
        ...BG_PLAYER_VARS,
        start: HERO_VIDEOS[1].start,
        playlist: HERO_VIDEOS[1].id,
      },
      events: {
        onReady: (e) => e.target.playVideo(),
        onStateChange: (e) => {
          if (e.data === YT.PlayerState.PLAYING && !bReadyRef.current) {
            setBReady(true);
          }
        },
      },
    });

    // Crossfade interval
    interval = setInterval(() => {
      const current = activeIdxRef.current;
      const next = (current + 1) % HERO_VIDEOS.length;
      const preload = (next + 1) % HERO_VIDEOS.length;

      if (showARef.current) {
        setBReady(false);
        playerBRef.current?.loadVideoById({
          videoId: HERO_VIDEOS[next].id,
          startSeconds: HERO_VIDEOS[next].start,
        });
        setTimeout(() => {
          playerARef.current?.cueVideoById({
            videoId: HERO_VIDEOS[preload].id,
            startSeconds: HERO_VIDEOS[preload].start,
          });
        }, 800);
      } else {
        setAReady(false);
        playerARef.current?.loadVideoById({
          videoId: HERO_VIDEOS[next].id,
          startSeconds: HERO_VIDEOS[next].start,
        });
        setTimeout(() => {
          playerBRef.current?.cueVideoById({
            videoId: HERO_VIDEOS[preload].id,
            startSeconds: HERO_VIDEOS[preload].start,
          });
        }, 800);
      }

      setShowA(s => !s);
      setActiveIndex(next);
    }, SNIPPET_DURATION * 1000);

    return () => clearInterval(interval);
  }, [ytLoaded]);

  const aVisible = showA && aReady;
  const bVisible = !showA && bReady;

  return (
    <section className="relative min-h-screen w-screen flex flex-col items-center justify-center overflow-hidden bg-black">

      {/* Background: Thumbnail poster until YT loads, then video players */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-black">
        
        {/* Static thumbnail poster (visible until first video plays) */}
        {!aReady && !bReady && (
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={ytThumb(HERO_VIDEOS[0].id)}
              alt=""
              className="w-full h-full object-cover opacity-45"
            />
          </div>
        )}

        {/* Player A */}
        <div className={`absolute inset-0 transition-opacity duration-700 ${aVisible ? 'opacity-45' : 'opacity-0'}`}>
          <div className="relative w-full h-full overflow-hidden bg-black">
            <div
              ref={divARef}
              className="absolute"
              style={{
                top: '50%', left: '50%',
                width: '100%', height: '100%',
                minWidth: '177.78vh',
                minHeight: '56.25vw',
                transform: 'translate(-50%, -50%)',
              }}
            />
          </div>
        </div>

        {/* Player B */}
        <div className={`absolute inset-0 transition-opacity duration-700 ${bVisible ? 'opacity-45' : 'opacity-0'}`}>
          <div className="relative w-full h-full overflow-hidden bg-black">
            <div
              ref={divBRef}
              className="absolute"
              style={{
                top: '50%', left: '50%',
                width: '100%', height: '100%',
                minWidth: '177.78vh',
                minHeight: '56.25vw',
                transform: 'translate(-50%, -50%)',
              }}
            />
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
            REEL_{String(activeIndex + 1).padStart(2, '0')} / {String(HERO_VIDEOS.length).padStart(2, '0')}
          </Badge>
          <div className="pl-1">SNIPPET_ENGINE // ACTIVE // {SNIPPET_DURATION}s_CYCLE</div>
        </motion.div>
      </div>
    </section>
  );
}
