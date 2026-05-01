import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useTouchDevice } from '../hooks/useTouchDevice';

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const { isTouchOptimized } = useTouchDevice();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      // Focus trap for accessibility
      const focusableElements = document.querySelectorAll(
        '.menu-overlay a, .menu-overlay button, .menu-overlay [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      firstElement?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  const navLinks = [
    { label: 'Hero Page', path: '/' },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'About Me', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const menuVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.5,
        staggerChildren: 0.05,
        staggerDirection: -1,
      }
    },
    open: {
      opacity: 1,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants: Variants = {
    closed: { y: prefersReducedMotion ? 0 : 50, opacity: prefersReducedMotion ? 1 : 0 },
    open: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        duration: prefersReducedMotion ? 0 : 0.6, 
        ease: [0.215, 0.61, 0.355, 1] 
      } 
    }
  };

  return (
    <>
      {/* Skip to content link for accessibility */}
      <a 
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[#FFB000] focus:text-black focus:font-bold focus:rounded"
      >
        Skip to content
      </a>

      {/* TOP MENU BAR */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-10 lg:px-16 py-5 flex items-center justify-between transition-all duration-700 ${
          scrolled ? 'bg-[#0a0a0a]/90 backdrop-blur-xl' : 'bg-transparent'
        }`}
        role="banner"
      >
        <div className="flex items-center">
          <Link 
            to="/" 
            className="text-white font-sans font-extrabold text-lg tracking-wider uppercase group touch-target flex items-center"
            aria-label="Amber - Home"
          >
            AMBER
            <span className="block h-[1px] w-0 group-hover:w-full bg-[#FFB000] transition-all duration-500" />
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen(true)}
          className="group touch-target min-h-11 min-w-11 px-3 flex items-center gap-4 text-white font-sans font-semibold text-sm tracking-widest uppercase no-tap-highlight"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-controls="menu-overlay"
        >
          <span className="opacity-60 group-hover:opacity-100 transition-opacity hidden sm:inline">Menu</span>
          <div className="flex flex-col gap-1.5 w-6">
            <div className="h-[2px] w-full bg-white group-hover:bg-[#FFB000] transition-colors" />
            <div className="h-[2px] w-2/3 bg-white group-hover:w-full group-hover:bg-[#FFB000] transition-all" />
          </div>
        </button>

        {/* Dynamic bottom border line */}
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: scrolled ? 1 : 0 }}
          transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/20 origin-left"
        />
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="menu-overlay"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="menu-overlay fixed inset-0 z-[101] bg-[#0a0a0a] flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Main navigation"
          >
            {/* Technical Overlays */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
            
            <div className="px-4 sm:px-6 md:px-10 lg:px-16 py-5 flex items-center justify-between relative z-10">
              <Link 
                to="/" 
                className="text-white font-sans font-extrabold text-lg tracking-wider uppercase touch-target flex items-center"
                onClick={() => setMenuOpen(false)}
              >
                AMBER
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                className="touch-target min-h-11 min-w-11 px-3 text-white font-sans font-semibold text-sm tracking-widest uppercase hover:opacity-70 transition-opacity flex items-center justify-center"
                aria-label="Close menu"
              >
                <span className="hidden sm:inline mr-2">CLOSE</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 flex flex-col justify-center px-4 sm:px-8 md:px-16 lg:px-24" aria-label="Main menu">
              <ul className="flex flex-col items-center gap-4 md:gap-6">
                {navLinks.map((link) => (
                  <motion.li key={link.path} variants={itemVariants}>
                    <Link
                      to={link.path}
                      onClick={() => setMenuOpen(false)}
                      className="group relative font-serif text-white text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl transition-all hover:italic text-center leading-[0.95] touch-target block py-2 no-tap-highlight"
                    >
                      <span className="relative z-10">{link.label}</span>
                      <span 
                        className={`absolute -left-6 md:-left-8 top-1/2 -translate-y-1/2 text-[#FFB000] text-2xl opacity-0 transition-opacity ${
                          isTouchOptimized ? '' : 'group-hover:opacity-100'
                        }`}
                      >
                        //
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <footer className="px-6 md:px-10 pb-8 md:pb-12 flex flex-col md:flex-row items-center justify-between gap-6">
              <motion.div 
                variants={itemVariants}
                className="flex gap-6 md:gap-12 text-[10px] uppercase tracking-[0.3em] md:tracking-[0.5em] text-[#555] opacity-40"
              >
                <span>ACCRA, GHANA</span>
                <span>SYSTEM_V4.2</span>
              </motion.div>
              
              <div className="flex gap-6 md:gap-8">
                {[
                  { label: 'Instagram', href: 'https://www.instagram.com/is_lamptey/' },
                  { label: 'Twitter', href: 'https://x.com/Esaiaemose' },
                  { label: 'Github', href: 'https://github.com/Amberesaiae' },
                ].map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${social.label} profile`}
                    variants={itemVariants}
                    whileHover={isTouchOptimized ? undefined : { opacity: 1, y: -2 }}
                    className="touch-target flex items-center justify-center text-white/60 text-[10px] uppercase tracking-[0.3em] font-mono hover:text-white transition-colors no-tap-highlight min-h-11 min-w-11"
                  >
                    {social.label}
                  </motion.a>
                ))}
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
