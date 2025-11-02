import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Ensure jwt-decode is not externalized (bundled instead)
      external: [], // Empty array to avoid externalizing dependencies unless needed
    },
  },
  optimizeDeps: {
    include: ['jwt-decode'], // Pre-optimize jwt-decode to avoid runtime resolution issues
  },
});