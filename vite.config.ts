import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    host: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@app": path.resolve(__dirname, "src/app"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@contexts": path.resolve(__dirname, "src/contexts"),
      "@types": path.resolve(__dirname, "src/types"),
      "@lib": path.resolve(__dirname, "src/lib"),
      "@locales": path.resolve(__dirname, "src/locales"),
      "@data": path.resolve(__dirname, "src/data"),
      "@services": path.resolve(__dirname, "src/app/services"),
    },
  },
  css: {
    modules: {
      localsConvention: "camelCase",
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
