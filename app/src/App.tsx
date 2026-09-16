import { Route, Routes } from 'react-router-dom';
import Desktop from '@/desktop/Desktop';
import { DesktopProvider } from '@/desktop/providers/DesktopProvider';
import Studio from './pages/Studio';

/**
 * There is one screen. Routes exist only so links and the back button still
 * address a particular window; every path renders the same desktop.
 *
 * Providers that nothing currently needs (Tooltip, Toaster) are deliberately
 * absent — their components are in components/ui, ready to be mounted here the
 * moment something uses them, and until then they cost no bytes.
 */
export default function App() {
  return (
    <DesktopProvider>
      <Routes>
        {/* Studio lives outside the desktop: its own gate, its own chrome. */}
        <Route path="/studio" element={<Studio />} />
        <Route path="*" element={<Desktop />} />
      </Routes>
    </DesktopProvider>
  );
}
