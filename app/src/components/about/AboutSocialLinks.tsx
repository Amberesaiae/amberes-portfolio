import { Instagram, Twitter, Github } from 'lucide-react';

export default function AboutSocialLinks() {
  return (
    <div className="flex items-center gap-8 pt-4">
      <a aria-label="Visit GitHub profile" href="https://github.com/Amberesaiae" target="_blank" rel="noopener noreferrer" className="text-[#555] hover:text-[#FFB000] transition-all"><Github size={28} /></a>
      <a aria-label="Visit Instagram profile" href="https://www.instagram.com/is_lamptey/" target="_blank" rel="noopener noreferrer" className="text-[#555] hover:text-[#FFB000] transition-all"><Instagram size={28} /></a>
      <a aria-label="Visit X profile" href="https://x.com/Esaiaemose" target="_blank" rel="noopener noreferrer" className="text-[#555] hover:text-[#FFB000] transition-all"><Twitter size={28} /></a>
    </div>
  );
}
