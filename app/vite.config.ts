import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  plugins: [react()],
  server: { port: 3000 },
  preview: { port: 3000 },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        /*
          React stays in its own chunk. framer-motion is named so the windows
          and the studio page share one copy, but it must not swallow
          jsx-runtime — that was pulling the animation chunk into the first
          paint even when the home screen did not import it.
        */
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (
            id.includes('/react-dom/') ||
            id.includes('/react/') ||
            id.includes('/react-router/') ||
            id.includes('/react-router-dom/') ||
            id.includes('/scheduler/')
          ) {
            return 'react-vendor';
          }
          if (id.includes('/framer-motion/')) return 'animation-vendor';
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: { drop_console: true, drop_debugger: true },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
  },
});
