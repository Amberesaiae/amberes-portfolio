import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Badge from '../components/ui/StatusBadge';
import TextReveal from '../components/ui/TextReveal';
import { PADX } from '../styles/layoutTokens';
import { useConnectionSpeed, shouldLoadVideos } from '../hooks/useConnectionSpeed';
import { useViewport } from '../hooks/useViewport';

// 6s loop clips — WebM/VP9 primary, MP4/H.264 fallback for older Safari
// Served from Vercel static CDN, total ~2.4MB
const HERO_LOOPS: { webm: string; mp4: string }[] = [
  { webm: '/vids/loops/the-pen.webm',       mp4: '/vids/loops/the-pen.mp4' },
  { webm: '/vids/loops/opportunities.webm', mp4: '/vids/loops/opportunities.mp4' },
  { webm: '/vids/loops/seen.webm',          mp4: '/vids/loops/seen.mp4' },
  { webm: '/vids/loops/dream-date.webm',    mp4: '/vids/loops/dream-date.mp4' },
  { webm: '/vids/loops/runaway.webm',       mp4: '/vids/loops/runaway.mp4' },
  { webm: '/vids/loops/not-today.webm',     mp4: '/vids/loops/not-today.mp4' },
  { webm: '/vids/loops/trying.webm',        mp4: '/vids/loops/trying.mp4' },
];

const SNIPPET_DURATION = 4; // seconds per clip

export default function HeroSection() {
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showA, setShowA] = useState(true);
  const showARef = useRef(true);
  const connectionInfo = useConnectionSpeed();
  const { isMobile } = useViewport();
  const [userWantsVideo, setUserWantsVideo] = useState(false);

  // Determine if we should show videos
  const canLoadVideos = shouldLoadVideos(connectionInfo);
  const showVideos = !isMobile && (canLoadVideos || userWantsVideo);

  useEffect(() => { showARef.current = showA; }, [showA]);

  // Load and play a clip on a video element using WebM + MP4 sources
  const loadAndPlay = (video: HTMLVideoElement, index: number) => {
    // Clear existing sources
    while (video.firstChild) video.removeChild(video.firstChild);
    const webmSrc = document.createElement('source');
    webmSrc.src  = HERO_LOOPS[index].webm;
    webmSrc.type = 'video/webm';
    const mp4Src = document.createElement('source');
    mp4Src.src  = HERO_LOOPS[index].mp4;
    mp4Src.type = 'video/mp4';
    video.appendChild(webmSrc);
    video.appendChild(mp4Src);
    video.load();
    video.oncanplay = () => {
      video.play().catch(() => {});
      video.oncanplay = null;
    };
  };

  // Initial load — preload both A (active) and B (next)
  useEffect(() => {
    if (!showVideos) return;
    
    if (videoARef.current) loadAndPlay(videoARef.current, 0);
    if (videoBRef.current) {
      // Silently preload next clip
      const webmSrc = document.createElement('source');
      webmSrc.src  = HERO_LOOPS[1].webm;
      webmSrc.type = 'video/webm';
      const mp4Src = document.createElement('source');
      mp4Src.src  = HERO_LOOPS[1].mp4;
      mp4Src.type = 'video/mp4';
      videoBRef.current.appendChild(webmSrc);
      videoBRef.current.appendChild(mp4Src);
      videoBRef.current.load();
    }
  }, [showVideos]);

  // Crossfade interval — exact original blob pattern
  useEffect(() => {
    if (!showVideos) return;
    
    const interval = setInterval(() => {
      setActiveIndex(prev => {
        const next    = (prev + 1) % HERO_LOOPS.length;
        const preload = (next + 1) % HERO_LOOPS.length;

        const incoming = showARef.current ? videoBRef.current : videoARef.current;
        const outgoing = showARef.current ? videoARef.current : videoBRef.current;

        if (incoming) loadAndPlay(incoming, next);

        // Preload the clip after next into the outgoing player while it fades out
        setTimeout(() => {
          if (outgoing) {
            while (outgoing.firstChild) outgoing.removeChild(outgoing.firstChild);
            const webmSrc = document.createElement('source');
            webmSrc.src  = HERO_LOOPS[preload].webm;
            webmSrc.type = 'video/webm';
            const mp4Src = document.createElement('source');
            mp4Src.src  = HERO_LOOPS[preload].mp4;
            mp4Src.type = 'video/mp4';
            outgoing.appendChild(webmSrc);
            outgoing.appendChild(mp4Src);
            outgoing.load();
          }
        }, 800);

        setShowA(s => !s);
        return next;
      });
    }, SNIPPET_DURATION * 1000);

    return () => clearInterval(interval);
  }, [showVideos]);

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black">

      {/* ── Video background ───────────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        {showVideos ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black">

            {/* Player A */}
            <video
              ref={videoARef}
              muted
              loop
              playsInline
              preload="auto"
              className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ${showA ? 'opacity-45' : 'opacity-0'}`}
            />

            {/* Player B */}
            <video
              ref={videoBRef}
              muted
              loop
              playsInline
              preload="auto"
              className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ${!showA ? 'opacity-45' : 'opacity-0'}`}
            />
          </div>
        ) : (
          // Static background for slow connections or mobile
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <img 
              src="/images/hero-bg.jpg" 
              alt="" 
              className="absolute inset-0 h-full w-full object-cover opacity-30"
            />
            {!canLoadVideos && !isMobile && (
              <button
                onClick={() => setUserWantsVideo(true)}
                className="relative z-10 px-6 py-3 border border-white/20 text-white/60 text-xs uppercase tracking-widest hover:border-[#FFB000] hover:text-[#FFB000] transition-all"
              >
                Load Videos
              </button>
            )}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/90" />
      </div>

      {/* ── Content ────────────────────────────────────────────────── */}
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
          style={{ fontSize: 'clamp(44px, 8vw + 1rem, 160px)' }}
        >
          <span className="block overflow-hidden">
            <TextReveal text="EVERY SYSTEM" />
          </span>
          <span className="block overflow-hidden">
            <TextReveal text="TELLS" delay={0.2} className="text-[#FFB000] italic" />
            {' '}
            <TextReveal text="A STORY." delay={0.4} />
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

      {/* ── Scene counter ───────────────────────────────────────────── */}
      {showVideos && (
        <div className="absolute bottom-6 md:bottom-24 left-4 sm:left-6 md:left-10 lg:left-16 z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5 }}
            className="font-mono text-[8px] text-white/80 uppercase tracking-[0.4em] space-y-2"
          >
            <Badge variant="default" className="border-none bg-white/10 px-3 py-1 mb-2 text-[#FFB000]">
              REEL_{String(activeIndex + 1).padStart(2, '0')} / {String(HERO_LOOPS.length).padStart(2, '0')}
            </Badge>
            <div className="pl-1 hidden md:block">SNIPPET_ENGINE // ACTIVE // {SNIPPET_DURATION}s_CYCLE</div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
