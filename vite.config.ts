import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import pxtovw from "postcss-px-to-viewport";

const loder_pxtovw = pxtovw({
  //这里是设计稿宽度 自己修改
  viewportWidth: 375,
  viewportUnit: "vw",
});

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
      plugins: [loder_pxtovw],
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
