import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
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
        duration: 0.5,
        staggerChildren: 0.05,
        staggerDirection: -1,
      }
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants: Variants = {
    closed: { y: 50, opacity: 0 },
    open: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] } }
  };

  return (
    <>
      {/* TOP MENU BAR */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-10 lg:px-16 py-5 flex items-center justify-between transition-all duration-700 ${
          scrolled ? 'bg-[#0a0a0a]/90 backdrop-blur-xl' : 'bg-transparent'
        }`}
      >
        <div className="flex items-center">
          <Link to="/" className="text-white font-sans font-extrabold text-lg tracking-wider uppercase group">
            AMBER
            <span className="block h-[1px] w-0 group-hover:w-full bg-[#FFB000] transition-all duration-500" />
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen(true)}
          className="group min-h-11 px-1 flex items-center gap-4 text-white font-sans font-semibold text-sm tracking-widest uppercase"
          aria-label="Open menu"
        >
          <span className="opacity-60 group-hover:opacity-100 transition-opacity">Menu</span>
          <div className="flex flex-col gap-1.5 w-6">
            <div className="h-[1px] w-full bg-white group-hover:bg-[#FFB000] transition-colors" />
            <div className="h-[1px] w-2/3 bg-white group-hover:w-full group-hover:bg-[#FFB000] transition-all" />
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
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col"
          >
            {/* Technical Overlays */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
            
            <div className="px-4 sm:px-6 md:px-10 lg:px-16 py-5 flex items-center justify-between relative z-10">
              <Link to="/" className="text-white font-sans font-extrabold text-lg tracking-wider uppercase">
                AMBER
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                className="min-h-11 px-2 text-white font-sans font-semibold text-sm tracking-widest uppercase hover:opacity-70 transition-opacity"
                aria-label="Close menu"
              >
                CLOSE
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-center px-6 md:px-20">
              <nav className="flex flex-col items-center gap-2 md:gap-4">
                {navLinks.map((link) => (
                  <motion.div key={link.path} variants={itemVariants}>
                    <Link
                      to={link.path}
                      onClick={() => setMenuOpen(false)}
                      className="group relative font-serif text-white text-4xl sm:text-5xl md:text-7xl lg:text-9xl transition-all hover:italic text-center leading-[0.95]"
                    >
                      <span className="relative z-10">{link.label}</span>
                      <motion.span 
                        className="absolute -left-8 top-1/2 -translate-y-1/2 text-[#FFB000] text-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                        initial={{ x: -20 }}
                        whileHover={{ x: 0 }}
                      >
                        //
                      </motion.span>
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>

            <div className="px-6 md:px-10 pb-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <motion.div 
                variants={itemVariants}
                className="flex gap-8 md:gap-12 text-[10px] uppercase tracking-[0.3em] md:tracking-[0.5em] text-[#555] opacity-40"
              >
                <span>ACCRA, GHANA</span>
                <span>SYSTEM_V4.2</span>
              </motion.div>
              
              <div className="flex gap-8">
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
                    whileHover={{ opacity: 1, y: -2 }}
                    className="text-white/60 text-[10px] uppercase tracking-[0.3em] font-mono hover:text-white transition-colors"
                  >
                    {social.label}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
