import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // define: {
  //   'import.meta.env.VITE_APP_MORALIS_API_KEY': JSON.stringify(
  //     process.env.VITE_APP_MORALIS_API_KEY
  //   ),
  //   'import.meta.env.VITE_APP_NFT_UP_KEY': JSON.stringify(process.env.VITE_APP_NFT_UP_KEY)
  // },
  base: '/sample-applications/spot-the-ball/'
})
