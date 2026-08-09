import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.glb'],
  build: {
    minify: 'oxc',
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    target: 'es2020',
    sourcemap: false,
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
})
