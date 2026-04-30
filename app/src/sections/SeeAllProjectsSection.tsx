import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

export default function SeeAllProjectsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Parallax on background
      const img = sectionRef.current?.querySelector('img');
      if (img) {
        gsap.to(img, {
          y: -80,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[50vh] overflow-hidden">
      <img
        src="/images/redline-2.jpg"
        alt=""
        className="absolute inset-0 w-full h-[120%] object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 min-h-[50vh] flex items-center justify-center">
        <Link to="/portfolio">
          <h2
            ref={textRef}
            className="font-serif text-white text-center hover:opacity-70 transition-opacity cursor-pointer"
            style={{ fontSize: 'clamp(32px, 6vw, 72px)' }}
          >
            SEE ALL PROJECTS
          </h2>
        </Link>
      </div>
    </section>
  );
}
