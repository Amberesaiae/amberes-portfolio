import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroSection from '../sections/HeroSection';
import ManifestoSection from '../sections/ManifestoSection';
import VideoScrollSection from '../sections/VideoScrollSection';
import ServicesSection from '../sections/ServicesSection';
import HowIWorkSection from '../sections/HowIWorkSection';
import StackStripSection from '../sections/StackStripSection';
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
        <VideoScrollSection />
        <ServicesSection />
        <WhyAmber />
        <HowIWorkSection />
        <StackStripSection />
        <SystemStatus />
        <Footer />
      </main>
    </PageWrapper>
  );
}
