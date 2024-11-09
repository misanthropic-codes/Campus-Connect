// vite.config.js
import path from "path"
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'process.env': {}
  },
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist'
  }
});