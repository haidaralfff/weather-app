import { useEffect, useRef, useState } from 'react'
import { AttributionFooter } from './components/AttributionFooter'
import { BrandLogo } from './components/BrandLogo'
import { CurrentHero } from './components/CurrentHero'
import { DailyForecastGrid } from './components/DailyForecastGrid'
import { HourlyTimeline } from './components/HourlyTimeline'
import { SidebarNav } from './components/SidebarNav'
import {
  ErrorState,
  LoadingSkeleton,
  StaleWarningBanner,
} from './components/StatusBanner'
import { useKebumenWeather } from './hooks/useKebumenWeather'
import './App.css'

const THEME_STORAGE_KEY = 'cuaca_kebumen_theme'

function getInitialTheme() {
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (saved === 'dark' || saved === 'light') return saved
  } catch {
    // Ignore storage access errors
  }
  return 'dark'
}

function App() {
  const {
    weather,
    loading,
    refreshing,
    error,
    warning,
    source,
    fetchedAt,
    cooldownSeconds,
    refresh,
  } = useKebumenWeather()

  const [selectedDateKey, setSelectedDateKey] = useState(null)
  const [rainOnly, setRainOnly] = useState(false)
  const [theme, setTheme] = useState(getInitialTheme)
  const [activeSection, setActiveSection] = useState('ringkasan')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const mobileMenuBtnRef = useRef(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    const metaTheme = document.querySelector('meta[name="theme-color"]')
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#0b1117' : '#eef3f7')
    }
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // Ignore storage access errors
    }
  }, [theme])

  const activeDateKey =
    selectedDateKey &&
    weather?.days.some((day) => day.dateKey === selectedDateKey)
      ? selectedDateKey
      : weather?.days[0]?.dateKey || null

  const activeDay =
    weather?.days.find((day) => day.dateKey === activeDateKey) || null

  const todaySummary =
    weather?.days.find((day) => day.offsetDays === 0) || weather?.days[0] || null

  const handleNavigate = (sectionId) => {
    setActiveSection(sectionId)
    const target = document.getElementById(sectionId)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const isRefreshDisabled = loading || refreshing || cooldownSeconds > 0
  const refreshLabel = refreshing
    ? 'Memperbarui...'
    : cooldownSeconds > 0
      ? `Tunggu ${cooldownSeconds}d`
      : 'Perbarui'

  const statusPillText =
    source === 'network'
      ? 'Terbaru'
      : source === 'cache'
        ? 'Tersimpan'
        : source === 'stale-cache'
          ? 'Mode offline'
          : null

  const dotClass =
    source === 'network'
      ? 'is-live'
      : source === 'stale-cache'
        ? 'is-stale'
        : 'is-cache'

  return (
    <div className="app-layout">
      <SidebarNav
        activeSection={activeSection}
        onNavigate={handleNavigate}
        rainOnly={rainOnly}
        onToggleRainOnly={() => setRainOnly((prev) => !prev)}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        onRefresh={refresh}
        refreshing={refreshing}
        cooldownSeconds={cooldownSeconds}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        returnFocusRef={mobileMenuBtnRef}
      />

      <div className="workspace-shell">
        <div className="page-shell">
          <header className="top-bar">
            <div className="location-block">
              <div className="title-brand-row">
                <span className="mobile-brand-mark">
                  <BrandLogo size={34} />
                </span>
                <h1>Cuaca Kebumen</h1>
              </div>
              <p className="location-sub">
                <span
                  className="material-symbols-rounded location-ms-icon"
                  aria-hidden="true"
                >
                  location_on
                </span>
                <span>
                  {weather
                    ? `Kelurahan ${weather.location.desa}, Kec. ${weather.location.kecamatan}`
                    : 'Kelurahan Kebumen, Kec. Kebumen'}
                  , Jawa Tengah
                </span>
              </p>
            </div>

            <div className="header-actions">
              {statusPillText && (
                <div className="header-status-pill" aria-label={`Status data: ${statusPillText}`}>
                  <span className={`status-dot ${dotClass}`} aria-hidden="true" />
                  <span>{statusPillText}</span>
                </div>
              )}

              <button
                type="button"
                className="refresh-btn"
                onClick={refresh}
                disabled={isRefreshDisabled}
                aria-label="Muat ulang data cuaca dari BMKG"
              >
                <span
                  className={`material-symbols-rounded btn-ms-icon ${refreshing ? 'spin' : ''}`}
                  aria-hidden="true"
                >
                  {cooldownSeconds > 0 && !refreshing ? 'schedule' : 'refresh'}
                </span>
                <span className={cooldownSeconds > 0 ? 'tabular' : undefined}>
                  {refreshLabel}
                </span>
              </button>

              <button
                ref={mobileMenuBtnRef}
                type="button"
                className="mobile-menu-btn"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Buka menu navigasi"
                aria-expanded={mobileMenuOpen}
              >
                <span className="material-symbols-rounded" aria-hidden="true">
                  menu
                </span>
              </button>
            </div>
          </header>

          <main className="main-content">
            <StaleWarningBanner
              warning={warning}
              onRetry={refresh}
              refreshing={refreshing}
              cooldownSeconds={cooldownSeconds}
            />

            {loading && !weather && <LoadingSkeleton />}

            {error && !weather && <ErrorState message={error} onRetry={refresh} />}

            {weather && (
              <>
                <div className="dashboard-grid">
                  <div className="dashboard-left">
                    <CurrentHero
                      currentSlot={weather.currentSlot}
                      todaySummary={todaySummary}
                    />

                    <DailyForecastGrid
                      days={weather.days}
                      selectedDateKey={activeDateKey}
                      onSelectDay={setSelectedDateKey}
                    />
                  </div>

                  <div className="dashboard-right">
                    <HourlyTimeline
                      day={activeDay}
                      rainOnly={rainOnly}
                      onClearRainOnly={() => setRainOnly(false)}
                    />
                  </div>
                </div>

                <AttributionFooter
                  analysisDate={weather.analysisDate}
                  source={source}
                  fetchedAt={fetchedAt}
                />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default App
