import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Portal Digital PKK Nagari Suayan',
        short_name: 'PKK Suayan',
        description: 'Aplikasi Administrasi dan Informasi TP-PKK Nagari Suayan',
        theme_color: '#047857', // Warna hijau emerald khas instansi
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png', // Nanti siapkan logo PKK ukuran ini di folder public
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png', // Nanti siapkan logo PKK ukuran ini di folder public
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})