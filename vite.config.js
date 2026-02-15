import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// For GitHub Pages: set base to your repo name, e.g. '/led-grid-builder/'
// Vite exposes env vars prefixed with VITE_; we use VITE_BASE_PATH in CI
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
})
