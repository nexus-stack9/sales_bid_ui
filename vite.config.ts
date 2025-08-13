import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    https: true,
    strictPort: true,
  },
  preview: {
    port: 8080,
    https: true,
    strictPort: true,
  },
  plugins: [
    react(),
    basicSsl()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
