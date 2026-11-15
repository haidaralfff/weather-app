import { useCallback, useEffect, useState } from 'react'
import { fetchKebumenWeather } from '../services/bmkgWeather'

const REFRESH_COOLDOWN_SECONDS = 60

export function useKebumenWeather() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [warning, setWarning] = useState(null)
  const [source, setSource] = useState(null)
  const [fetchedAt, setFetchedAt] = useState(null)
  const [cooldownSeconds, setCooldownSeconds] = useState(0)

  useEffect(() => {
    let cancelled = false

    fetchKebumenWeather({ forceRefresh: false })
      .then((result) => {
        if (cancelled) return
        setWeather(result.weather)
        setSource(result.source)
        setFetchedAt(result.fetchedAt)
        setWarning(result.warning)
        setError(null)
      })
      .catch((err) => {
        if (cancelled) return
        setError(
          err instanceof Error
            ? err.message
            : 'Tidak dapat memuat prakiraan cuaca Kebumen saat ini.',
        )
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (cooldownSeconds <= 0) return undefined
    const timer = window.setInterval(() => {
      setCooldownSeconds((prev) => (prev > 1 ? prev - 1 : 0))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [cooldownSeconds])

  const refresh = useCallback(async () => {
    if (refreshing || cooldownSeconds > 0) return

    setRefreshing(true)
    setError(null)

    try {
      const result = await fetchKebumenWeather({ forceRefresh: true })
      setWeather(result.weather)
      setSource(result.source)
      setFetchedAt(result.fetchedAt)
      setWarning(result.warning)
      setCooldownSeconds(REFRESH_COOLDOWN_SECONDS)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Tidak dapat memuat prakiraan cuaca Kebumen saat ini.',
      )
    } finally {
      setRefreshing(false)
    }
  }, [refreshing, cooldownSeconds])

  return {
    weather,
    loading,
    refreshing,
    error,
    warning,
    source,
    fetchedAt,
    cooldownSeconds,
    refresh,
  }
}
