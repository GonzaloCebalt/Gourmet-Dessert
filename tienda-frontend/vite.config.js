import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png', 'logo.svg'],
      manifest: {
        name: 'Gourmet Dessert',
        short_name: 'Gourmet',
        description: 'E-commerce oficial de repostería artesanal Gourmet Dessert IRESM',
        theme_color: '#3D2B1F',
        background_color: '#F9F5F0',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/demo/') || url.pathname.startsWith('/static/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'imagenes-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
              },
            },
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/productos/'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'productos-cache',
              networkTimeoutSeconds: 4,
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 24 * 60 * 60, // 1 día
              },
            },
          },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
