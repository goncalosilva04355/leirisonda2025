import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  root: ".",
  publicDir: "public",
  base: "/", // Corrigir para produção Netlify
  define: {
    global: "globalThis",
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || "1.0.0"),
  },
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 2000,
    sourcemap: "inline", // Inline sourcemap para melhor debug
    minify: "esbuild", // Usar esbuild para compatibilidade webkit
    target: "es2020", // Target mais específico
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
      // Evitar warnings e erros em produção
      onwarn(warning, warn) {
        // Ignorar warnings específicos que podem causar problemas webkit
        if (warning.code === "THIS_IS_UNDEFINED") return;
        if (warning.code === "EVAL") return;
        warn(warning);
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
});
