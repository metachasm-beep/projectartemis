import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import viteCompression from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa';

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
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: 'Matriarch: Elite Selection Protocol',
        short_name: 'Matriarch',
        description: 'Premium verification-based dating for professionals in India.',
        theme_color: '#0A0A0B',
        background_color: '#0A0A0B',
        display: 'standalone',
        icons: [
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    }),
    // 🚀 Performance: Inline CSS into HTML to eliminate render-blocking network requests
    {
      name: 'inline-css',
      transformIndexHtml(html, ctx) {
        if (!ctx.bundle) return html;
        let css = '';
        for (const [fileName, asset] of Object.entries(ctx.bundle)) {
          if (fileName.endsWith('.css') && 'source' in asset) {
            css += asset.source;
          }
        }
        if (!css) return html;
        // Optimization: Remove standard CSS link and inject inlined style
        return html
          .replace(/<link rel="stylesheet".*?>/g, '')
          .replace('</head>', `<style>${css}</style></head>`);
      }
    }
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
          'vendor-webgl': ['ogl', 'three'], 
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: false, // Force single CSS file for easier inlining
  },
});


