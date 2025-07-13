import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  root: ".",
  publicDir: "public",
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
  },
  css: {
    postcss: "./postcss.config.cjs",
  },
  optimizeDeps: {
    include: ["firebase/app", "firebase/firestore", "firebase/auth"],
    exclude: ["@firebase/firestore"],
  },
});
