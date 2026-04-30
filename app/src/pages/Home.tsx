import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroSection from '../sections/HeroSection';
import ManifestoSection from '../sections/ManifestoSection';
import VideoScrollSection from '../sections/VideoScrollSection';
import ServicesSection from '../sections/ServicesSection';
import HowIWorkSection from '../sections/HowIWorkSection';
import ProcessSection from '../sections/ProcessSection';
import Footer from '../components/Footer';
import Meta from '../components/Meta';
import WhyAmber from '../components/WhyAmber';
import SystemStatus from '../components/SystemStatus';

import PageWrapper from '../components/PageWrapper';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <PageWrapper>
      <main className="bg-transparent">
        <Meta />
        <HeroSection />
        <ManifestoSection />
        <WhyAmber />
        
        {/* Cinematic Vertical Video Montage (Ibrahem Style) */}
        <VideoScrollSection />

        {/* Structured Services & Projects Accordion */}
        <ServicesSection />

        <HowIWorkSection />
        <ProcessSection />
        <SystemStatus />
        <Footer />
      </main>
    </PageWrapper>
  );
}
