import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html',
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion', 'gsap'],
          'vendor-ui': ['@heroui/react', 'lucide-react'],
          'vendor-webgl': ['ogl', 'three'], // Optimization for heavy animation engine
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  },
});

