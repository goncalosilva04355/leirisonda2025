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
      input: {
        main: "index.html",
      },
      output: {
        manualChunks: (id) => {
          // Handle dynamic imports properly
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom")) {
              return "react-vendor";
            }
            if (id.includes("lucide-react") || id.includes("framer-motion")) {
              return "ui-vendor";
            }
            if (id.includes("jspdf") || id.includes("html2canvas")) {
              return "pdf-vendor";
            }
            if (id.includes("firebase")) {
              return "firebase-vendor";
            }
          }

          // Group dynamically imported services together
          if (
            id.includes("/services/autoSyncService") ||
            id.includes("/services/robustLoginService") ||
            id.includes("/services/userRestoreService") ||
            id.includes("/utils/syncManager")
          ) {
            return "dynamic-services";
          }

          // Firebase configs and utilities
          if (id.includes("/firebase/") || id.includes("firebaseConfig")) {
            return "firebase-config";
          }
        },
      },
      external: (id) => {
        // Don't externalize our own modules
        return false;
      },
    },
  },
  server: {
    port: 5173,
    host: true,
    fs: {
      // Only allow serving files from the project root and node_modules
      allow: [".."],
    },
  },
  css: {
    postcss: "./postcss.config.cjs",
  },
  optimizeDeps: {
    include: [
      "firebase/app",
      "firebase/firestore",
      "firebase/auth",
      "@firebase/firestore",
      // Pre-optimize dynamically imported services
      "src/services/autoSyncService",
      "src/services/robustLoginService",
      "src/services/userRestoreService",
      "src/utils/syncManager",
    ],
  },
});
