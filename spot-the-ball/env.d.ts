/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_MORALIS_API_KEY: string
  readonly VITE_APP_NFT_UP_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
