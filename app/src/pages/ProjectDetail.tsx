import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projects } from '../data/projects';
import Footer from '../components/Footer';
import PageWrapper from '../components/PageWrapper';
import ProjectHero from '../components/project/ProjectHero';
import ProjectContent from '../components/project/ProjectContent';
import ProjectNext from '../components/project/ProjectNext';

export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const projectIndex = projects.findIndex((p) => p.id === projectId);
  const project = projects[projectIndex];
  const nextProject = projects[(projectIndex + 1) % projects.length];

  useEffect(() => {
    if (!project) {
      navigate('/portfolio');
      return;
    }
    window.scrollTo(0, 0);
  }, [projectId, project, navigate]);

  if (!project) return null;

  return (
    <PageWrapper>
      <main className="bg-[#111] min-h-screen">
        <ProjectHero project={project} />
        <ProjectContent project={project} />
        <ProjectNext nextProject={nextProject} />
        <Footer showFull={false} />
      </main>
    </PageWrapper>
  );
}
