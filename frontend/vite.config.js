import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/catalog': { target: 'http://localhost:8001', changeOrigin: true },
      '/api/cart':    { target: 'http://localhost:8002', changeOrigin: true },
      '/api/orders':  { target: 'http://localhost:8002', changeOrigin: true },
      '/api/pickup-points': { target: 'http://localhost:8002', changeOrigin: true },
      '/static':      { target: 'http://localhost:8001', changeOrigin: true },
    },
  },
})
