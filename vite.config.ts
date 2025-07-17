import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  root: ".",
  publicDir: "public",
  base: "/", // Correct base path for Netlify SPA deployment
  define: {
    global: "globalThis",
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || "1.0.0"),
  },
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "ui-vendor": ["lucide-react", "framer-motion"],
          "pdf-vendor": ["jspdf", "html2canvas"],
          "firebase-vendor": [
            "firebase/app",
            "firebase/firestore",
            "firebase/auth",
          ],
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
    hmr: {
      // Reduzir freqüência de HMR para evitar refreshes no Builder.io
      overlay: false, // Desativar overlay de erros
    },
    watch: {
      // Reduzir watch sensitivity
      ignored: ["**/node_modules/**", "**/dist/**"],
      usePolling: false,
    },
  },
  css: {
    postcss: "./postcss.config.cjs",
  },
  optimizeDeps: {
    include: ["firebase/app", "firebase/firestore", "firebase/auth"],
    exclude: ["@firebase/firestore"],
  },
});
