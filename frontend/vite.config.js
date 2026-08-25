import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
  server: {
    port: 3000,
    strictPort: true,
    open: true,
    proxy: {
      // Only paths *under* /app go to the app server. Bare /app is the
      // website's own under-construction page, so it must fall through to
      // the SPA -- mirroring the rewrites in vercel.json.
      '^/app/.+': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/app/, '') || '/',
      },
    },
  },
})
