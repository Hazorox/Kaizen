import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { copyFileSync } from "fs";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "copy-pdf-worker",
      buildStart() {
        copyFileSync(
          "node_modules/pdfjs-dist/build/pdf.worker.min.mjs",
          "public/pdf.worker.min.mjs",
        );
      },
    },
  ],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: {
    proxy: {
      "/api": process.env.BACKEND_URL ??"http://localhost:9898",
    },
  },
});
