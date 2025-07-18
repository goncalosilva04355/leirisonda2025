import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  root: ".",
  publicDir: "public",
  base: "/",
  build: {
    rollupOptions: {
      input: {
        main: "./src/main-production.tsx",
      },
    },
  },
  define: {
    global: "globalThis",
    __APP_VERSION__: JSON.stringify("1.0.0"),
    __PRODUCTION_MODE__: true,
    __FIREBASE_REST_API__: true,
  },
  build: {
    outDir: "dist-production",
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    minify: "esbuild",
    target: "es2020",
    cssCodeSplit: true,
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

          // Firebase REST API (não usar SDK)
          if (id.includes("firebase") || id.includes("firestore")) {
            return "firebase-vendor";
          }

          // Radix UI components
          if (id.includes("@radix-ui")) {
            return "radix-vendor";
          }

          // Separar arquivos da aplicação dos vendor
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
        // Configurações de asset naming para produção
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split(".");
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
      },
    },
  },
  server: {
    port: 5173,
    host: true,
    hmr: {
      overlay: false,
    },
    watch: {
      ignored: ["**/node_modules/**", "**/dist/**", "**/dist-production/**"],
      usePolling: false,
    },
  },
  css: {
    postcss: "./postcss.config.cjs",
    devSourcemap: false, // Desativar sourcemap CSS em produção
  },
  optimizeDeps: {
    include: ["react", "react-dom", "lucide-react"],
    exclude: ["firebase/app", "firebase/firestore"], // Usar REST API
  },
  esbuild: {
    drop: ["console", "debugger"], // Remover console.log em produção
  },
});
