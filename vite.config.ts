import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  root: ".",
  publicDir: "public",
  define: {
    // Add global ReadableStream check
    global: "globalThis",
  },
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "ui-vendor": ["lucide-react", "framer-motion"],
          "pdf-vendor": ["jspdf", "html2canvas"],
        },
      },
      external: ["firebase/firestore", "@firebase/firestore"],
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  css: {
    postcss: "./postcss.config.cjs",
  },
  optimizeDeps: {
    include: ["react", "react-dom", "lucide-react"],
    exclude: [
      "@firebase/firestore",
      "firebase/firestore",
      "@firebase/firestore-compat",
      "firebase/app",
      "firebase/auth",
      "firebase/database",
    ],
  },
});
