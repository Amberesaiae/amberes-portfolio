import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { pathUrlTarget } from '@/desktop/config/routes';
import './index.css';
import App from './App';

// /work is not a hash route. Fold it into #/work before the router reads the
// URL, so the first paint is already the window. Hosts that 307 here never
// reach this; hosts that serve the shell at the path (Vite, Vercel) do.
const fromPath = pathUrlTarget(window.location.pathname, window.location.search);
if (fromPath && !window.location.hash.startsWith('#/')) {
  window.history.replaceState(null, '', fromPath);
}

createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <App />
  </HashRouter>,
);
