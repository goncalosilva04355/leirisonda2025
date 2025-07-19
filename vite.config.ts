import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  root: ".",
  publicDir: "public",
  base: "/",
  define: {
    global: "globalThis",
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || "1.0.0"),
  },
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 2000,
    sourcemap: false,
    minify: "esbuild",
  },
  server: {
    port: 5173,
    host: true,
  },
});
