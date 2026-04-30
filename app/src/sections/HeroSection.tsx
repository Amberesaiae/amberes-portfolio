import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Badge from '../components/ui/StatusBadge';
// Removed MagneticButton import to align with static aesthetic
import TextReveal from '../components/ui/TextReveal';
import { PADX } from '../styles/layoutTokens';

import { getVideoUrl } from '../lib/video-urls';

const HERO_VIDEOS = [
  getVideoUrl("the-pen.mp4"),
  getVideoUrl("opportunities.mp4"),
  getVideoUrl("seen.mp4"),
  getVideoUrl("dream-date.mp4"),
  getVideoUrl("runaway.mp4"),
  getVideoUrl("not-today.mp4"),
  getVideoUrl("try.mp4"),
];

const SNIPPET_DURATION = 3.5; // seconds per snippet

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showA, setShowA] = useState(true);

  // Seek to mid-point unless it's the pen (index 0) which starts from beginning
  const seekVideo = (video: HTMLVideoElement, videoIndex: number) => {
    const handler = () => {
      if (videoIndex === 0) {
        video.currentTime = 0; // pen starts from beginning
      } else {
        video.currentTime = video.duration * 0.5; // all others at 50%
      }
      video.removeEventListener('loadedmetadata', handler);
    };
    if (video.readyState >= 1) {
      handler();
    } else {
      video.addEventListener('loadedmetadata', handler);
    }
  };

  // Fast-cycling snippet logic with crossfade
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => {
        const next = (prev + 1) % HERO_VIDEOS.length;

        const incoming = showA ? videoBRef.current : videoARef.current;
        if (incoming) {
          incoming.src = HERO_VIDEOS[next];
          incoming.load();
          seekVideo(incoming, next);
          incoming.play().catch(() => {});
        }

        setShowA(s => !s);
        return next;
      });
    }, SNIPPET_DURATION * 1000);

    return () => clearInterval(interval);
  }, [showA]);

  useEffect(() => {
    if (videoARef.current) {
      videoARef.current.src = HERO_VIDEOS[0];
      videoARef.current.load();
      seekVideo(videoARef.current, 0);
      videoARef.current.play().catch(() => {});
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-screen flex flex-col items-center justify-center overflow-hidden bg-black"
    >
      {/* Static Image Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 flex items-center justify-center bg-black">
        <video
          ref={videoARef}
          className={showA ? "absolute inset-0 h-full w-full object-contain opacity-45 transition-opacity duration-700" : "absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity duration-700"}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
        />
        <video
          ref={videoBRef}
          className={!showA ? "absolute inset-0 h-full w-full object-contain opacity-45 transition-opacity duration-700" : "absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity duration-700"}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
        />
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
              className="relative px-10 py-5 border border-[#FFB000]/30 text-[#FFB000] text-[10px] uppercase tracking-[0.5em] font-black hover:bg-[#FFB000] hover:text-black transition-all duration-500 overflow-hidden group"
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
          <Badge variant="default" className="border-none bg-white/10 px-3 py-1 mb-2 text-[#FFB000]">REEL_{String(activeIndex + 1).padStart(2, '0')} / {String(HERO_VIDEOS.length).padStart(2, '0')}</Badge>
          <div className="pl-1">SNIPPET_ENGINE // ACTIVE // {SNIPPET_DURATION}s_CYCLE</div>
        </motion.div>
      </div>
    </section>
  );
}
