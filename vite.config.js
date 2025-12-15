import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  root: '.',
  server: {
    port: 5173
  },
  build: {
    minify: false, // desativa minificação em producao
  }
})
