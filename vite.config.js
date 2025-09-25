import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024, // 8 MiB
      },
      manifest: {
        name: "Библия за 111 дней",
        short_name: "Библия 111",
        theme_color: "#667eea",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  build: {
    chunkSizeWarningLimit: 2000, // подавить предупреждение до 2 МБ
    rollupOptions: {
      output: {
        manualChunks: {
          // Вынесем Библию в отдельный чанк
          bible: ["src/data/rst.json"],
        },
      },
    },
  },
});
