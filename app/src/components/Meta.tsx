import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface MetaProps {
  title?: string;
  description?: string;
}

const DEFAULT_TITLE = "amber // Industrial Intelligence & Marine Engineering";
const DEFAULT_DESC = "Official portfolio of Lamptey Odartei Isaiah. Marine Engineer, Systems Architect, and Industrial Builder based in Accra, Ghana.";

export default function Meta({ title, description }: MetaProps) {
  const location = useLocation();

  useEffect(() => {
    // Update Title
    const fullTitle = title ? `${title} | amber` : DEFAULT_TITLE;
    document.title = fullTitle;

    // Update Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description || DEFAULT_DESC);
    } else {
      const newMeta = document.createElement('meta');
      newMeta.name = "description";
      newMeta.content = description || DEFAULT_DESC;
      document.head.appendChild(newMeta);
    }

    // Update OG Title/Description for social sharing
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', fullTitle);
    
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description || DEFAULT_DESC);

  }, [title, description, location]);

  return null;
}
