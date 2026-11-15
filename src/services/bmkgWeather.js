export const KEBUMEN_ADM4 = '33.05.12.1024'
const CACHE_KEY = 'cuaca_kebumen_bmkg_v1'
const CACHE_TTL_MS = 15 * 60 * 1000

const WIND_DIRECTION_ID = {
  N: 'Utara',
  NE: 'Timur Laut',
  E: 'Timur',
  SE: 'Tenggara',
  S: 'Selatan',
  SW: 'Barat Daya',
  W: 'Barat',
  NW: 'Barat Laut',
  VARIABLE: 'Berubah-ubah',
}

const WIND_DIRECTION_COMPACT = {
  N: 'U',
  NE: 'TL',
  E: 'T',
  SE: 'TG',
  S: 'S',
  SW: 'BD',
  W: 'B',
  NW: 'BL',
  VARIABLE: 'Var',
}

function getWibDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)

  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]))
  return `${map.year}-${map.month}-${map.day}`
}

function parseWibTimestamp(localDatetime) {
  if (!localDatetime) return 0
  return Date.parse(`${localDatetime.replace(' ', 'T')}+07:00`)
}

function formatDayLabel(dateKey, todayKey) {
  const dateMs = Date.parse(`${dateKey}T00:00:00+07:00`)
  const todayMs = Date.parse(`${todayKey}T00:00:00+07:00`)
  const diffDays = Math.round((dateMs - todayMs) / (24 * 60 * 60 * 1000))

  const fullDate = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  }).format(new Date(dateMs))

  const shortDate = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    day: 'numeric',
    month: 'short',
  }).format(new Date(dateMs))

  if (diffDays === 0) {
    return { title: 'Hari Ini', subtitle: fullDate, shortDate, offsetDays: 0 }
  }
  if (diffDays === 1) {
    return { title: 'Besok', subtitle: fullDate, shortDate, offsetDays: 1 }
  }
  if (diffDays === 2) {
    return { title: 'Lusa', subtitle: fullDate, shortDate, offsetDays: 2 }
  }

  const weekday = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    weekday: 'long',
  }).format(new Date(dateMs))

  return { title: weekday, subtitle: fullDate, shortDate, offsetDays: diffDays }
}

export function isRainSlot(slot) {
  const desc = (slot.weather_desc || '').toLowerCase()
  const code = Number(slot.weather)
  return (
    desc.includes('hujan') ||
    desc.includes('petir') ||
    desc.includes('gerimis') ||
    (Number.isFinite(code) && code >= 60)
  )
}

function getRainSeverity(slot) {
  const desc = (slot.weather_desc || '').toLowerCase()
  const code = Number(slot.weather)
  if (desc.includes('petir') || code >= 95) return 4
  if (desc.includes('lebat') || code === 65) return 3
  if (desc.includes('sedang') || code === 63) return 2
  if (isRainSlot(slot)) return 1
  return 0
}

function getDominantDescription(slots) {
  if (!slots.length) return '-'
  const rainSlots = slots.filter((s) => s.isRain)
  if (rainSlots.length > 0) {
    const strongest = [...rainSlots].sort(
      (a, b) => b.rainSeverity - a.rainSeverity || b.tp - a.tp,
    )[0]
    return strongest.weatherDesc
  }

  const counts = new Map()
  for (const slot of slots) {
    counts.set(slot.weatherDesc, (counts.get(slot.weatherDesc) || 0) + 1)
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0]
}

export function formatWindDirection(wd, { compact = false } = {}) {
  if (!wd) return '-'
  if (compact) return WIND_DIRECTION_COMPACT[wd] || wd
  return WIND_DIRECTION_ID[wd] || wd
}

export function formatAnalysisDate(isoLike) {
  if (!isoLike) return '-'
  const normalized = isoLike.endsWith('Z') ? isoLike : `${isoLike}Z`
  const date = new Date(normalized)
  if (Number.isNaN(date.getTime())) return isoLike

  return new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function normalizeBmkgPayload(payload, now = new Date()) {
  const lokasi = payload?.lokasi || {}
  const rawCuaca = payload?.data?.[0]?.cuaca

  if (!Array.isArray(rawCuaca) || rawCuaca.length === 0) {
    throw new Error('Format data cuaca BMKG tidak valid atau kosong.')
  }

  const nowMs = now.getTime()
  const todayKey = getWibDateKey(now)

  const groupedByDate = new Map()
  const flatRawSlots = rawCuaca.flat().filter(Boolean)

  for (const raw of flatRawSlots) {
    const localDatetime = raw.local_datetime || ''
    const dateKey = localDatetime.slice(0, 10)
    if (!dateKey) continue

    const timestampMs = parseWibTimestamp(localDatetime)
    const timeLabel = localDatetime.slice(11, 16) || '--:--'
    const rain = isRainSlot(raw)
    const rainSeverity = getRainSeverity(raw)

    const normalizedSlot = {
      id: localDatetime,
      dateKey,
      timeLabel,
      localDatetime,
      timestampMs,
      isPast: timestampMs < nowMs - 90 * 60 * 1000,
      isRain: rain,
      rainSeverity,
      weatherCode: Number(raw.weather) || 0,
      weatherDesc: raw.weather_desc || 'Tidak diketahui',
      weatherDescEn: raw.weather_desc_en || '',
      tempC: Number(raw.t),
      humidity: Number(raw.hu),
      windSpeedKmh: Number(raw.ws) || 0,
      windDir: raw.wd || '',
      cloudCover: Number(raw.tcc) || 0,
      tp: Number(raw.tp) || 0,
      iconUrl: raw.image ? encodeURI(raw.image) : '',
      analysisDate: raw.analysis_date || '',
    }

    if (!groupedByDate.has(dateKey)) {
      groupedByDate.set(dateKey, [])
    }
    groupedByDate.get(dateKey).push(normalizedSlot)
  }

  const days = [...groupedByDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(0, 3)
    .map(([dateKey, daySlots]) => {
      const slots = [...daySlots].sort((a, b) => a.timestampMs - b.timestampMs)
      const label = formatDayLabel(dateKey, todayKey)
      const rainSlots = slots.filter((s) => s.isRain)
      const upcomingRainSlots =
        label.offsetDays === 0
          ? rainSlots.filter((s) => !s.isPast)
          : rainSlots

      const temps = slots
        .map((s) => s.tempC)
        .filter((t) => Number.isFinite(t))
      const tempMin = temps.length ? Math.min(...temps) : null
      const tempMax = temps.length ? Math.max(...temps) : null
      const totalTp = Number(
        slots.reduce((sum, s) => sum + s.tp, 0).toFixed(1),
      )
      const maxTp = Number(
        Math.max(0, ...slots.map((s) => s.tp)).toFixed(1),
      )

      const dominantIconSlot =
        rainSlots[0] ||
        slots.find((s) => s.timeLabel === '12:00') ||
        slots[Math.floor(slots.length / 2)] ||
        slots[0]

      return {
        dateKey,
        ...label,
        slots,
        rainSlots,
        upcomingRainSlots,
        willRain: rainSlots.length > 0,
        willRainUpcoming: upcomingRainSlots.length > 0,
        dominantCondition: getDominantDescription(slots),
        iconUrl: dominantIconSlot?.iconUrl || '',
        tempMin,
        tempMax,
        totalTp,
        maxTp,
      }
    })

  const allSlots = days.flatMap((d) => d.slots)
  const currentSlot =
    allSlots.reduce((closest, slot) => {
      if (!closest) return slot
      const currentDiff = Math.abs(slot.timestampMs - nowMs)
      const bestDiff = Math.abs(closest.timestampMs - nowMs)
      return currentDiff < bestDiff ? slot : closest
    }, null) || allSlots[0]

  const latestAnalysisDate =
    allSlots.find((s) => s.analysisDate)?.analysisDate || ''

  return {
    location: {
      adm4: lokasi.adm4 || KEBUMEN_ADM4,
      desa: lokasi.desa || 'Kebumen',
      kecamatan: lokasi.kecamatan || 'Kebumen',
      kotkab: lokasi.kotkab || 'Kebumen',
      provinsi: lokasi.provinsi || 'Jawa Tengah',
      lat: lokasi.lat ?? -7.6717,
      lon: lokasi.lon ?? 109.6619,
    },
    analysisDate: latestAnalysisDate,
    currentSlot,
    days,
  }
}

function readCache() {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.payload || !parsed?.fetchedAt) return null
    return parsed
  } catch {
    return null
  }
}

function writeCache(payload) {
  try {
    window.localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        fetchedAt: Date.now(),
        payload,
      }),
    )
  } catch {
    // Ignore storage quota errors
  }
}

export async function fetchKebumenWeather({ forceRefresh = false } = {}) {
  const cached = readCache()
  const now = Date.now()

  if (!forceRefresh && cached && now - cached.fetchedAt < CACHE_TTL_MS) {
    return {
      weather: normalizeBmkgPayload(cached.payload),
      source: 'cache',
      fetchedAt: cached.fetchedAt,
      warning: null,
    }
  }

  try {
    const query = new URLSearchParams({ adm4: KEBUMEN_ADM4 })
    if (forceRefresh) {
      query.set('refresh', 'true')
    }

    const response = await fetch(`/api/weather?${query.toString()}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      throw new Error(`Layanan BMKG merespons status ${response.status}.`)
    }

    const payload = await response.json()
    const weather = normalizeBmkgPayload(payload)
    writeCache(payload)

    return {
      weather,
      source: 'network',
      fetchedAt: Date.now(),
      warning: null,
    }
  } catch (error) {
    if (cached) {
      return {
        weather: normalizeBmkgPayload(cached.payload),
        source: 'stale-cache',
        fetchedAt: cached.fetchedAt,
        warning:
          error instanceof Error
            ? error.message
            : 'Gagal mengambil pembaruan terbaru dari BMKG.',
      }
    }
    throw error
  }
}
