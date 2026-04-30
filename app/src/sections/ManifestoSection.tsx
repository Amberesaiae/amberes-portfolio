import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ParallaxImage from '../components/ui/ParallaxImage';
import { CONTAINER, CENTER, PADX } from '../styles/layoutTokens';

gsap.registerPlugin(ScrollTrigger);

export default function ManifestoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = textRef.current?.querySelectorAll('.manifesto-word');
      if (words) {
        gsap.fromTo(
          words,
          { opacity: 0.2 },
          {
            opacity: 1,
            stagger: 0.08,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              end: 'bottom 40%',
              scrub: 1,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const text = "GREAT WORK ISN'T BORN FROM TEMPLATES — IT'S FORGED IN THE TENSION BETWEEN PRECISION AND CHAOS.";
  const words = text.split(' ');

  return (
    <section
      ref={sectionRef}
      className={`relative min-h-[70vh] md:min-h-[100vh] flex items-center justify-center ${PADX.page} py-20 md:py-32 overflow-hidden border-b border-white/5`}
    >
      {/* Parallax Industrial Background */}
      <div className="absolute inset-0 pointer-events-none">
        <ParallaxImage 
          src="/images/industrial-glow.jpg" 
          containerClassName="w-full h-full"
          className="opacity-20 grayscale hover:grayscale-0 transition-all scale-125"
          style={{ transitionDuration: '3000ms' }}
          offset={100}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#111] via-transparent to-[#111] z-10" />
        <div className="absolute inset-0 bg-black/60 z-10" />
      </div>

      <p
        ref={textRef}
        className={`relative z-20 font-serif text-white text-center ${CONTAINER.content} ${CENTER}`}
        style={{ fontSize: 'clamp(28px, 8vw, 84px)', lineHeight: 1.1 }}
      >
        {words.map((word, i) => (
          <span key={i} className="manifesto-word inline-block mr-[0.3em]">
            {word}
          </span>
        ))}
      </p>
    </section>
  );
}
