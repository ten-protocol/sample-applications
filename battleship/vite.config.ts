import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    // base: "/battleship/",
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

// import { defineConfig } from "vite";
// import vue from "@vitejs/plugin-vue";
// import { resolve } from "path";

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [vue()],
//   base: "/battleships/",
//   resolve: {
//     alias: [{ find: "@", replacement: resolve(__dirname, "./src") }],
//   },
// });
