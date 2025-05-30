import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  base: '/codigo-7-app/',
  build: {             // <--- ESTA É A NOVA SEÇÃO ADICIONADA
    outDir: 'docs'     // <--- ESTA É A NOVA LINHA DENTRO DA SEÇÃO 'build'
  }
})
