import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { createApp } from '../server/app.js'
import { clearForecastCache, getKebumenForecast } from '../server/services/bmkgProxy.js'

describe('getKebumenForecast', () => {
  it('menggunakan cache HIT dan cooldown 60 detik untuk force refresh', async () => {
    clearForecastCache()
    let calls = 0
    const fakeFetcher = async () => {
      calls += 1
      return {
        ok: true,
        status: 200,
        async json() {
          return { lokasi: { adm4: '33.05.12.1024' }, data: [{ cuaca: [] }] }
        },
      }
    }

    const first = await getKebumenForecast({ fetcher: fakeFetcher, now: 1_000_000 })
    assert.equal(first.cacheStatus, 'MISS')
    assert.equal(calls, 1)

    const second = await getKebumenForecast({ fetcher: fakeFetcher, now: Date.now() })
    assert.equal(second.cacheStatus, 'HIT')
    assert.equal(calls, 1)

    const cooled = await getKebumenForecast({
      force: true,
      fetcher: fakeFetcher,
      now: Date.now(),
    })
    assert.equal(cooled.cacheStatus, 'COOLDOWN')
    assert.equal(calls, 1)
  })
})

describe('Express API routes', () => {
  it('melayani /api/health, /api/weather, dan membatasi rate limit', async () => {
    const app = createApp({
      weatherRouterOptions: {
        forecastProvider: async () => ({
          payload: { lokasi: { adm4: '33.05.12.1024' }, data: [{ cuaca: [] }] },
          cacheStatus: 'HIT',
          fetchedAt: Date.now(),
        }),
        rateLimitOptions: { windowMs: 60_000, maxRequests: 2 },
      },
    })

    const server = app.listen(0)
    const { port } = server.address()
    const base = `http://127.0.0.1:${port}`

    try {
      const health = await fetch(`${base}/api/health`)
      assert.equal(health.status, 200)
      const healthBody = await health.json()
      assert.equal(healthBody.ok, true)

      const ok1 = await fetch(`${base}/api/weather`)
      assert.equal(ok1.status, 200)
      assert.equal(ok1.headers.get('x-cache'), 'HIT')

      const ok2 = await fetch(`${base}/api/weather`)
      assert.equal(ok2.status, 200)

      const limited = await fetch(`${base}/api/weather`)
      assert.equal(limited.status, 429)
    } finally {
      server.close()
    }
  })
})
