import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CONTAINER, CENTER, PADX, PADY } from '../styles/layoutTokens';

gsap.registerPlugin(ScrollTrigger);

export default function ScatteredTextSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const phrasesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      phrasesRef.current.forEach((phrase, i) => {
        if (phrase) {
          const fromX = i % 2 === 0 ? -60 : 60;
          const fromY = i % 3 === 0 ? 40 : -20;

          gsap.fromTo(
            phrase,
            { x: fromX, y: fromY, opacity: 0 },
            {
              x: 0,
              y: 0,
              opacity: 1,
              duration: 1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: phrase,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          );
        }
      });

      // Parallax on images
      const images = sectionRef.current?.querySelectorAll('.scatter-img');
      images?.forEach((img, i) => {
        gsap.to(img, {
          y: -30 * (i + 1) * 0.3,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={`${PADX.page} ${PADY.large} min-h-[80vh] relative overflow-hidden`}>
      <div className={`${CONTAINER.content} ${CENTER} relative`}>
        {/* 8 YEARS OF */}
        <div
          ref={(el) => { phrasesRef.current[0] = el; }}
          className="flex items-center justify-end gap-4 mb-2"
        >
          <div className="scatter-img w-32 md:w-48 h-40 md:h-56 overflow-hidden">
            <img
              src="/images/project-likeafish.jpg"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <span
            className="font-serif text-white"
            style={{ fontSize: 'clamp(40px, 8vw, 100px)', lineHeight: 1 }}
          >
            8 YEARS OF
          </span>
        </div>

        {/* SHAPING STORIES */}
        <div
          ref={(el) => { phrasesRef.current[1] = el; }}
          className="text-right mb-12 md:mb-20"
        >
          <span
            className="font-serif text-white block"
            style={{ fontSize: 'clamp(40px, 8vw, 100px)', lineHeight: 1 }}
          >
            SHAPING
          </span>
          <span
            className="font-serif text-white block"
            style={{ fontSize: 'clamp(40px, 8vw, 100px)', lineHeight: 1 }}
          >
            STORIES
          </span>
        </div>

        {/* CRAFTING CAMPAIGNS */}
        <div
          ref={(el) => { phrasesRef.current[2] = el; }}
          className="mb-8 md:mb-12"
        >
          <span
            className="font-serif text-white block"
            style={{ fontSize: 'clamp(40px, 8vw, 100px)', lineHeight: 1 }}
          >
            CRAFTING
          </span>
          <div className="flex items-center gap-4">
            <span
              className="font-serif text-[#888] block"
              style={{ fontSize: 'clamp(40px, 8vw, 100px)', lineHeight: 1 }}
            >
              CAMPAIGNS,
            </span>
            <div className="scatter-img w-24 md:w-36 h-32 md:h-44 overflow-hidden hidden md:block">
              <img
                src="/images/project-kettlebell.jpg"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* AND BUILDING */}
        <div
          ref={(el) => { phrasesRef.current[3] = el; }}
          className="text-center mb-4"
        >
          <span
            className="font-serif text-[#888]"
            style={{ fontSize: 'clamp(40px, 8vw, 100px)', lineHeight: 1 }}
          >
            AND BUILDING
          </span>
        </div>

        {/* IDEAS THAT LAST */}
        <div
          ref={(el) => { phrasesRef.current[4] = el; }}
          className="text-center"
        >
          <span
            className="font-serif text-white"
            style={{ fontSize: 'clamp(40px, 8vw, 100px)', lineHeight: 1 }}
          >
            IDEAS THAT LAST.
          </span>
        </div>

      </div>
    </section>
  );
}
