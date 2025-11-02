import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [], // Ensure no unintended externals
    },
  },
  base: process.env.VITE_BASE_PATH || '/restaurant-management-system/frontend',
  optimizeDeps: {
    include: ['jwt-decode'], // Keep this for jwt-decode
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
      ],
    },
  },
});