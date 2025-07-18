import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  root: ".",
  publicDir: "public",
  base: "/",
  define: {
    global: "globalThis",
    __APP_VERSION__: JSON.stringify("2.0.0"),
  },
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 2000,
    sourcemap: false,
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React e dependências principais
          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/react-dom")
          ) {
            return "react-vendor";
          }

          // UI components
          if (id.includes("lucide-react") || id.includes("framer-motion")) {
            return "ui-vendor";
          }
          // PDF generation
          if (id.includes("jspdf") || id.includes("html2canvas")) {
            return "pdf-vendor";
          }
          // Separar arquivos da aplicação dos vendor
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
  server: {
    port: 5174,
    host: true,
    hmr: {
      overlay: false,
    },
    watch: {
      ignored: ["**/node_modules/**", "**/dist/**"],
      usePolling: false,
    },
  },
  css: {
    postcss: "./postcss.config.cjs",
  },
});
