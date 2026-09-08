import { useRef } from 'react';
import { useScroll } from 'framer-motion';
import Meta from '../components/Meta';
import PageWrapper from '../components/PageWrapper';
import WhyAmber from '../components/WhyAmber';
import AboutHeroSection from '../components/about/AboutHeroSection';
import AboutIdentityBioSection from '../components/about/AboutIdentityBioSection';
import AboutDisciplinesSection from '../components/about/AboutDisciplinesSection';
import AboutFormationSection from '../components/about/AboutFormationSection';
import AboutEnvironmentClosingSection from '../components/about/AboutEnvironmentClosingSection';

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);

  useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  return (
    <PageWrapper>
      <main ref={containerRef} className="min-h-screen">
        <Meta
          title="Identity // Marine Engineer & Builder"
          description="Learn about the disciplines, education, and experience of Lamptey Odartei Isaiah."
        />

        <AboutHeroSection />
        <AboutIdentityBioSection />
        <WhyAmber />
        <AboutDisciplinesSection />
        <AboutFormationSection />
        <AboutEnvironmentClosingSection />
      </main>
    </PageWrapper>
  );
}
