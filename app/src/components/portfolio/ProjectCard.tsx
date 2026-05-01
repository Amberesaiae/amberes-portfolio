import { ExternalLink, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProjectData } from '../../data/projects';
import { useState, useEffect, useMemo, useRef } from 'react';

export default function ProjectCard({ 
  project, 
  onClick 
}: { 
  project: ProjectData;
  onClick: () => void;
}) {
  const hasImage = !project.omitImage;
  const gallery = useMemo(() => project.gallery ?? [], [project.gallery]);
  const hasMultipleImages = gallery.length > 1;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const cardRef = useRef<HTMLButtonElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Detect if user prefers reduced motion
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  // Intersection Observer to pause auto-swipe when not visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  // Preload gallery images
  useEffect(() => {
    if (!hasMultipleImages) return;
    
    gallery.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [hasMultipleImages, gallery]);

  // Auto-swipe effect for projects with multiple images
  useEffect(() => {
    if (!hasMultipleImages || prefersReducedMotion || !isVisible) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => 
        prev === gallery.length - 1 ? 0 : prev + 1
      );
    }, 5000); // Change image every 5 seconds (slower)

    return () => clearInterval(interval);
  }, [hasMultipleImages, prefersReducedMotion, isVisible, gallery.length]);

  const currentImage = hasMultipleImages 
    ? gallery[currentImageIndex] 
    : project.image;

  return (
    <button
      ref={cardRef}
      onClick={onClick}
      aria-label={`Open ${project.title} project details`}
      className="group relative flex flex-col w-full h-full text-left bg-black/40 border border-white/5 hover:border-[#FFB000]/30 transition-all duration-500 overflow-hidden focus-visible:outline-2 focus-visible:outline-[#FFB000] focus-visible:outline-offset-2"
    >
      {/* Image Section */}
      {hasImage && (
        <div className="relative w-full bg-[#050505] overflow-hidden flex items-center justify-center h-40 sm:h-48 md:h-52 lg:h-56">
          <img
            src={currentImage}
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-contain transition-opacity duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-20" />
          
          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <span className={cn(
              "text-[8px] font-mono uppercase tracking-[0.2em] px-2 py-1 border backdrop-blur-sm",
              project.status === 'shipped' 
                ? "border-[#00FF99]/30 text-[#00FF99] bg-[#00FF99]/5" 
                : "border-[#FFB000]/30 text-[#FFB000] bg-[#FFB000]/5"
            )}>
              {project.status === 'shipped' ? 'SHIPPED' : 'PENDING'}
            </span>
          </div>

          {/* Image Indicators */}
          {hasMultipleImages && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5" role="status" aria-live="polite" aria-label={`Image ${currentImageIndex + 1} of ${gallery.length}`}>
              {gallery.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-2 h-2 md:w-1.5 md:h-1.5 rounded-full transition-all duration-300",
                    index === currentImageIndex 
                      ? "bg-[#FFB000] w-5 md:w-4" 
                      : "bg-white/30"
                  )}
                  aria-label={index === currentImageIndex ? `Current image ${index + 1}` : `Image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content Section - Flex grow to fill remaining space */}
      <div className="flex-1 flex flex-col p-5 space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-serif text-lg text-white/90 group-hover:text-[#FFB000] uppercase tracking-tight transition-colors leading-tight">
              {project.title}
            </h3>
            <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-[#FFB000] group-hover:translate-x-1 transition-all flex-shrink-0" />
          </div>
          
          {/* Meta Info */}
          <div className="flex items-center gap-4 text-[9px] font-mono uppercase tracking-[0.2em] text-white/40">
            <span>{project.year}</span>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <span>{project.category}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-white/60 leading-relaxed line-clamp-2 flex-grow">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1.5">
          {project.stack.slice(0, 4).map((tech) => (
            <span 
              key={tech} 
              className="text-[8px] font-mono uppercase tracking-wider text-white/40 border border-white/10 px-2 py-0.5"
            >
              {tech}
            </span>
          ))}
          {project.stack.length > 4 && (
            <span className="text-[8px] font-mono uppercase tracking-wider text-white/30 px-2 py-0.5">
              +{project.stack.length - 4}
            </span>
          )}
        </div>

        {/* Links */}
        {project.link && (
          <div className="pt-2 border-t border-white/5 mt-auto">
            <div className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-[0.2em] text-[#FFB000]/70 group-hover:text-[#FFB000]">
              <ExternalLink className="w-3 h-3" />
              <span>Live Site</span>
            </div>
          </div>
        )}
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 border border-[#FFB000]/0 group-hover:border-[#FFB000]/20 transition-all duration-500 pointer-events-none" />
    </button>
  );
}
