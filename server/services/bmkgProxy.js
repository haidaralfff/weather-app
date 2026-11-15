export const KEBUMEN_ADM4 = '33.05.12.1024'
const BMKG_ENDPOINT = 'https://api.bmkg.go.id/publik/prakiraan-cuaca'
const CACHE_TTL_MS = 15 * 60 * 1000
const REFRESH_COOLDOWN_MS = 60 * 1000
const UPSTREAM_TIMEOUT_MS = 8000

let cachedEntry = null
let inFlightPromise = null

export async function getKebumenForecast({
  force = false,
  fetcher = fetch,
  now = Date.now(),
} = {}) {
  if (cachedEntry) {
    const ageMs = now - cachedEntry.fetchedAt
    if (!force && ageMs < CACHE_TTL_MS) {
      return {
        payload: cachedEntry.payload,
        cacheStatus: 'HIT',
        fetchedAt: cachedEntry.fetchedAt,
      }
    }
    if (force && ageMs < REFRESH_COOLDOWN_MS) {
      return {
        payload: cachedEntry.payload,
        cacheStatus: 'COOLDOWN',
        fetchedAt: cachedEntry.fetchedAt,
      }
    }
  }

  if (!inFlightPromise) {
    inFlightPromise = (async () => {
      const upstreamUrl = `${BMKG_ENDPOINT}?adm4=${encodeURIComponent(KEBUMEN_ADM4)}`
      const response = await fetcher(upstreamUrl, {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'cuaca-kebumen-express/1.0',
        },
        signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      })

      if (!response.ok) {
        const err = new Error(`BMKG upstream error (${response.status})`)
        err.statusCode = response.status
        throw err
      }

      const payload = await response.json()
      const fetchedAt = Date.now()
      cachedEntry = { payload, fetchedAt }
      return {
        payload,
        cacheStatus: 'MISS',
        fetchedAt,
      }
    })().finally(() => {
      inFlightPromise = null
    })
  }

  try {
    return await inFlightPromise
  } catch (error) {
    if (cachedEntry) {
      return {
        payload: cachedEntry.payload,
        cacheStatus: 'STALE',
        fetchedAt: cachedEntry.fetchedAt,
      }
    }
    throw error
  }
}

export function clearForecastCache() {
  cachedEntry = null
}
