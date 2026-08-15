import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: fileURLToPath(new URL('../../tools/fuel-calculator', import.meta.url)),
    emptyOutDir: true,
    sourcemap: false,
    target: 'es2020'
  }
})
