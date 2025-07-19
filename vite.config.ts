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
    chunkSizeWarningLimit: 1000,
    sourcemap: false, // Disable sourcemap in production to prevent webkit errors
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

          // Firebase - separate chunk for better caching
          if (id.includes("firebase") || id.includes("firestore")) {
            return "firebase-vendor";
          }

          // UI components
          if (id.includes("lucide-react") || id.includes("framer-motion")) {
            return "ui-vendor";
          }

          // PDF generation - lazy load
          if (id.includes("jspdf") || id.includes("html2canvas")) {
            return "pdf-vendor";
          }

          // Large utilities that can be lazy loaded
          if (id.includes("date-fns") || id.includes("xlsx")) {
            return "utils-vendor";
          }

          // Separar arquivos da aplicação dos vendor
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
      // Evitar warnings e erros em produção
      onwarn(warning, warn) {
        // Ignorar warnings espec��ficos que podem causar problemas webkit
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
      // Configurações específicas para reduzir refreshes no Builder.io
      overlay: false, // Desativar overlay de erros
      port: 5174, // Porta separada para HMR
      timeout: 60000, // Timeout maior para evitar reconexões frequentes
      clientPort: 5174, // Porta do cliente HMR
    },
    watch: {
      // Reduzir watch sensitivity drasticamente
      ignored: [
        "**/node_modules/**",
        "**/dist/**",
        "**/.git/**",
        "**/coverage/**",
        "**/temp/**",
        "**/*.md",
        "**/*.txt",
        "**/*.log",
      ],
      usePolling: false,
      interval: 1000, // Intervalo maior entre verificações
    },
  },
  css: {
    postcss: "./postcss.config.cjs",
  },
});
