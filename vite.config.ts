import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "#": path.resolve(__dirname, "src/types"),
    },
  },

  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        additionalData: `@import "${path.resolve(
          __dirname,
          "src/assets/style/index.less",
        )}";@import "${path.resolve(
          __dirname,
          "src/assets/style/index.less",
        )}";`,
      },
    },
  },

  server: {
    port: 8080,
    proxy: {
      "/api": {
        target: "http://test.cuysy.com/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
