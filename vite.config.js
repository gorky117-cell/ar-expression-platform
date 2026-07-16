import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 61100,
    strictPort: true,
    host: true,
    allowedHosts: true,
    /** Browser is opened by `scripts/dev-open-61100.mjs` (runs on npm run dev). */
  },
})
