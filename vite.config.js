import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // تم التعديل هنا: قمنا بتحديث اسم الأيقونة لتصبح favicon.png ومسحنا القديم
      includeAssets: ['favicon.png', 'pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        name: 'فلتر إيجيبت',
        short_name: 'فلتر إيجيبت',
        description: 'أكبر منصة لبيع وشراء فلاتر المياه وقطع الغيار في مصر',
        theme_color: '#111827',
        background_color: '#050505',
        display: 'standalone',
        dir: 'rtl',
        lang: 'ar',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
