import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' keeps asset paths relative so the build works under any
// GitHub Pages sub-path (e.g. /tracing/). Routing uses the URL hash.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: { port: 5173 },
});
