/**
 * Start Vite and open http://localhost:61100 once the server is ready.
 * Helps when the IDE or another project keeps browsers on default port 5173.
 */
import { spawn } from 'node:child_process'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const viteCli = path.join(root, 'node_modules', 'vite', 'bin', 'vite.js')
const OPEN_URL = 'http://localhost:61100/'

let opened = false

function openBrowser() {
  if (opened) return
  opened = true
  console.log('\n\x1b[33mWearWave:\x1b[0m opening browser at \x1b[36m%s\x1b[0m (not 5173)\n', OPEN_URL)
  const url = OPEN_URL
  if (process.platform === 'win32') {
    spawn('cmd', ['/c', 'start', '', url], { cwd: root, detached: true, stdio: 'ignore' }).unref()
  } else if (process.platform === 'darwin') {
    spawn('open', [url], { cwd: root, detached: true, stdio: 'ignore' }).unref()
  } else {
    spawn('xdg-open', [url], { cwd: root, detached: true, stdio: 'ignore' }).unref()
  }
}

function tryOpen(chunk) {
  const s = String(chunk)
  if (/ready\s+in\s+/i.test(s) || /\b61100\b/.test(s) || /\bLocal:/i.test(s)) {
    openBrowser()
  }
}

const vite = spawn(process.execPath, [viteCli], {
  cwd: root,
  stdio: ['inherit', 'pipe', 'pipe'],
  env: process.env,
})

vite.stdout.on('data', (d) => {
  process.stdout.write(d)
  tryOpen(d)
})
vite.stderr.on('data', (d) => {
  process.stderr.write(d)
  tryOpen(d)
})
vite.on('close', (code) => process.exit(code ?? 0))
