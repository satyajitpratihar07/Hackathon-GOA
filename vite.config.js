import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.glb'],
  build: {
    // Use Rollup's code splitting for smaller initial bundle
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libs into separate chunk (better caching)
          'vendor-react': ['react', 'react-dom'],
        },
      },
    },
    // Minify with esbuild (faster than terser, similar results)
    minify: 'esbuild',
    // Enable CSS code splitting for better parallel loading
    cssCodeSplit: true,
    // Inline assets smaller than 4kb
    assetsInlineLimit: 4096,
    // Target modern browsers for smaller output
    target: 'es2020',
    // Enable source maps only in dev
    sourcemap: false,
  },
  // Optimize dev server
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
})
