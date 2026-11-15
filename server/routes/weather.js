import { Router } from 'express'
import { createRateLimiter } from '../middleware/rateLimit.js'
import { getKebumenForecast, KEBUMEN_ADM4 } from '../services/bmkgProxy.js'

export function createWeatherRouter({
  forecastProvider = getKebumenForecast,
  rateLimitOptions,
} = {}) {
  const router = Router()
  const weatherLimiter = createRateLimiter(rateLimitOptions)

  router.get('/health', (_req, res) => {
    res.json({
      ok: true,
      service: 'cuaca-kebumen-backend',
      adm4: KEBUMEN_ADM4,
      timestamp: new Date().toISOString(),
    })
  })

  router.get('/weather', weatherLimiter, async (req, res, next) => {
    try {
      const force = req.query.refresh === 'true'
      const result = await forecastProvider({ force })

      res.setHeader('X-Cache', result.cacheStatus)
      res.setHeader(
        'Cache-Control',
        'public, max-age=300, s-maxage=900, stale-while-revalidate=1800',
      )
      res.json(result.payload)
    } catch (error) {
      next(error)
    }
  })

  return router
}

export default createWeatherRouter()
