export function createRateLimiter({
  windowMs = 60 * 1000,
  maxRequests = 60,
} = {}) {
  const hits = new Map()

  return function rateLimiter(req, res, next) {
    const now = Date.now()
    const key = req.ip || req.socket?.remoteAddress || 'unknown'

    for (const [ip, entry] of hits.entries()) {
      if (now >= entry.resetAt) {
        hits.delete(ip)
      }
    }

    let record = hits.get(key)
    if (!record || now >= record.resetAt) {
      record = { count: 0, resetAt: now + windowMs }
      hits.set(key, record)
    }

    record.count += 1
    const remaining = Math.max(0, maxRequests - record.count)

    res.setHeader('X-RateLimit-Limit', String(maxRequests))
    res.setHeader('X-RateLimit-Remaining', String(remaining))

    if (record.count > maxRequests) {
      const retryAfterSec = Math.max(1, Math.ceil((record.resetAt - now) / 1000))
      res.setHeader('Retry-After', String(retryAfterSec))
      res.status(429).json({
        error: 'Terlalu banyak permintaan. Coba lagi sebentar.',
        retryAfterSeconds: retryAfterSec,
      })
      return
    }

    next()
  }
}
