import express from 'express'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Load environment variables from .env if present
const envPath = path.join(__dirname, '.env')
if (fs.existsSync(envPath)) {
  try {
    const envContent = fs.readFileSync(envPath, 'utf8')
    envContent.split('\n').forEach((line) => {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const index = trimmed.indexOf('=')
        if (index !== -1) {
          const key = trimmed.substring(0, index).trim()
          const val = trimmed.substring(index + 1).trim()
          process.env[key] = val
        }
      }
    })
  } catch (err) {
    console.error('Error loading .env file:', err)
  }
}

const app = express()
const PORT = process.env.PORT || 61100

// Serve static files from the Vite build directory
app.use(express.static(path.join(__dirname, 'dist')))

// Expose Supabase credentials for the static HTML page (ar.html)
app.get('/api/config', (req, res) => {
  res.json({
    supabaseUrl: process.env.VITE_SUPABASE_URL || 'https://pbfhgpitghiwkelhzssz.supabase.co',
    supabaseKey: process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_9UC-fIvJNypRa6oIpZBXlw_dHpB9OUm',
  })
})

// Clean route aliases without .html extension
app.get('/scanner', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'ar-camera.html'))
})
app.get('/ar-camera', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'ar-camera.html'))
})
app.get('/ar-mind', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'ar-mind.html'))
})
app.get('/ar-tree', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'ar-tree.html'))
})

// Handle SPA routing: serve index.html for all non-file routes
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`)
})
