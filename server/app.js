import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { createWeatherRouter } from './routes/weather.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distDir = path.resolve(__dirname, '..', 'dist')

export function createApp({ weatherRouterOptions } = {}) {
  const app = express()

  app.set('trust proxy', 1)
  app.disable('x-powered-by')
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
    next()
  })

  app.use('/api', createWeatherRouter(weatherRouterOptions))

  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'Endpoint API tidak ditemukan' })
  })

  if (!process.env.VERCEL && fs.existsSync(path.join(distDir, 'index.html'))) {
    app.use(express.static(distDir))
    app.get('/{*splat}', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'))
    })
  }

  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    const isTimeout = err instanceof Error && err.name === 'TimeoutError'
    const status = isTimeout ? 504 : err?.statusCode || 502

    res.status(status).json({
      error: isTimeout
        ? 'Koneksi ke server BMKG timeout'
        : 'Gagal terhubung ke layanan BMKG',
      detail: err instanceof Error ? err.message : 'Unknown error',
    })
  })

  return app
}
