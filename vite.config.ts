import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import pxToRem from "postcss-pxtorem";

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
    postcss: {
      plugins: [
        pxToRem({
          rootValue: 37.5,
          unitPrecision: 3,
          propList: ['*'],
        }),
      ],
    },
  },

  server: {
    port: 8080,
    proxy: {
      "/apis": {
        target: "https://api.dinero.zone",
        changeOrigin: true,
      },
    },
  },
});
