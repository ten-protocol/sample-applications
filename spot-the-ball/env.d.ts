/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MORALIS_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
