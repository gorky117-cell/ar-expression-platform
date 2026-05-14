import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 61100,
    strictPort: true,
    /** Opens the correct WearWave URL in the default browser (`npm run dev`). */
    open: '/',
  },
})
