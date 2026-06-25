import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.widget.tsx"),
      name: "CaasWidget",
      formats: ["iife"],
      fileName: () => "category_widget.js",
    },
    rollupOptions: {
      external: [],
    },
    minify: true,
  },
  define: {
    // Replace process.env with empty object
    "process.env": {},
  },
});

