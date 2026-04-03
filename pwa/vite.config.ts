import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg', 'icon-512.png'],
      manifest: {
        name: 'Matriarch: Your Choice, Your Kingdom',
        short_name: 'Matriarch',
        description: 'A high-tech, women-first selection platform for premium dating.',
        theme_color: '#4B0082',
        background_color: '#1C1C1C',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'icon-512.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': '/src',
    }
  }
});
