import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    const label = labelRef.current;
    if (!cursor || !follower || !label) return;

    gsap.set([cursor, follower, label], { xPercent: -50, yPercent: -50 });

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'none'
      });
      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6,
        ease: 'power3.out'
      });
      gsap.to(label, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.2,
        ease: 'power2.out'
      });
    };

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isProject = target.closest('.project-card, .gallery-item');
      const isVideo = target.closest('video, .video-trigger');
      const isInteractive = target.closest('a, button, .catalog-drawer, .book-spine');
      
      if (isProject) {
        gsap.to(follower, { scale: 2.5, backgroundColor: 'rgba(255, 176, 0, 0.15)', borderColor: '#FFB000', duration: 0.4 });
        gsap.to(cursor, { opacity: 0, duration: 0.3 });
        gsap.to(label, { opacity: 1, scale: 1, y: -45, duration: 0.4 });
        label.innerHTML = '<span class="text-[#FFB000] text-[9px] uppercase tracking-[0.3em] font-bold bg-black/90 px-3 py-1.5 border border-[#FFB000]/30">View Case</span>';
      } else if (isVideo) {
        gsap.to(follower, { scale: 2.5, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'white', duration: 0.4 });
        gsap.to(cursor, { opacity: 0, duration: 0.3 });
        gsap.to(label, { opacity: 1, scale: 1, y: -45, duration: 0.4 });
        label.innerHTML = '<span class="text-white text-[9px] uppercase tracking-[0.3em] font-bold bg-black/90 px-3 py-1.5 border border-white/20">Play</span>';
      } else if (isInteractive) {
        gsap.to(follower, { scale: 1.8, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.3)', duration: 0.4 });
        gsap.to(cursor, { scale: 0.5, opacity: 0.5, duration: 0.3 });
        gsap.to(label, { opacity: 0, scale: 0.5, duration: 0.3 });
      } else {
        gsap.to(follower, { scale: 1, backgroundColor: 'transparent', borderColor: 'rgba(255, 255, 255, 0.08)', duration: 0.4 });
        gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.3 });
        gsap.to(label, { opacity: 0, scale: 0.5, y: 0, duration: 0.3 });
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', handleHover);
    document.addEventListener('mouseenter', () => gsap.to([cursor, follower], { opacity: 1 }));
    document.addEventListener('mouseleave', () => gsap.to([cursor, follower], { opacity: 0 }));

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', handleHover);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
      />
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-10 h-10 border border-white/[0.08] rounded-full pointer-events-none z-[9998] transition-colors duration-500"
      />
      <div
        ref={labelRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] opacity-0 scale-50"
      >
        <span className="text-[#FFB000] text-[9px] uppercase tracking-[0.3em] font-bold bg-black/80 px-2 py-1 rounded-[2px] backdrop-blur-sm border border-[#FFB000]/20">
          Explore
        </span>
      </div>
    </>
  );
}
