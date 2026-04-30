import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navigation from './components/Navigation';
import SmoothScroll from './components/SmoothScroll';
import CustomCursor from './components/CustomCursor';
import LoadingScreen from './components/LoadingScreen';
import PageTransition from './components/ui/PageTransition';

const Home = lazy(() => import('./pages/Home'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Cookies = lazy(() => import('./pages/Cookies'));
const NotFound = lazy(() => import('./pages/NotFound'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const location = useLocation();
  
  return (
    <SmoothScroll>
      <LoadingScreen />
      <CustomCursor />
      <ScrollToTop />
      <Navigation />
      <AnimatePresence mode="wait">
        <PageTransition key={location.pathname}>
          <Suspense fallback={null}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/portfolio/:projectId" element={<ProjectDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </PageTransition>
      </AnimatePresence>
    </SmoothScroll>
  );
}
