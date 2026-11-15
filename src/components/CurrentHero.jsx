import { formatWindDirection } from '../services/bmkgWeather'
import { WeatherIcon } from './WeatherIcon'

export function CurrentHero({ currentSlot, todaySummary }) {
  if (!currentSlot) return null

  const hasTodayData = Boolean(todaySummary)
  const rainWindows = todaySummary?.upcomingRainSlots || []
  const willRainToday = rainWindows.length > 0

  const verdictLabel = willRainToday
    ? 'Berpotensi hujan hari ini'
    : 'Tidak ada hujan hari ini'

  const verdictDetail = willRainToday
    ? `Hujan diprediksi sekitar pukul ${rainWindows.map((s) => `${s.timeLabel} WIB`).join(', ')}.`
    : hasTodayData
      ? 'Sisa hari ini diprakirakan cerah hingga berawan.'
      : 'Menampilkan prakiraan terdekat untuk wilayah Kebumen.'

  return (
    <section
      id="ringkasan"
      className="hero-card"
      aria-label="Ringkasan cuaca Kebumen saat ini"
    >
      <div className="hero-top">
        <div className="verdict-block">
          <span
            className={`verdict-pill ${willRainToday ? 'pill-rain' : 'pill-clear'}`}
          >
            <span className="material-symbols-rounded pill-ms-icon" aria-hidden="true">
              {willRainToday ? 'rainy' : 'check_circle'}
            </span>
            {verdictLabel}
          </span>
          <p className="verdict-detail">{verdictDetail}</p>
        </div>

        <div className="hero-temp-wrap">
          <WeatherIcon
            weatherDesc={currentSlot.weatherDesc}
            weatherCode={currentSlot.weatherCode}
            isRain={currentSlot.isRain}
            timeLabel={currentSlot.timeLabel}
            size={44}
          />
          <div className="hero-temp-text">
            <div className="hero-temp tabular">
              {Number.isFinite(currentSlot.tempC) ? `${currentSlot.tempC}°C` : '-'}
            </div>
            <div className="hero-condition">{currentSlot.weatherDesc}</div>
            <div className="hero-slot-time tabular">
              Pukul {currentSlot.timeLabel} WIB
            </div>
          </div>
        </div>
      </div>

      <dl className="hero-metrics">
        <div className="metric-item">
          <dt>
            <span className="material-symbols-rounded metric-ms-icon" aria-hidden="true">
              water_drop
            </span>
            Kelembapan
          </dt>
          <dd className="tabular">{currentSlot.humidity}%</dd>
        </div>
        <div className="metric-item metric-item-wind">
          <dt>
            <span className="material-symbols-rounded metric-ms-icon" aria-hidden="true">
              air
            </span>
            Angin
          </dt>
          <dd className="tabular">
            {currentSlot.windSpeedKmh} km/j ·{' '}
            <span className="wind-dir-full">
              {formatWindDirection(currentSlot.windDir)}
            </span>
            <span className="wind-dir-compact">
              {formatWindDirection(currentSlot.windDir, { compact: true })}
            </span>
          </dd>
        </div>
        <div className="metric-item">
          <dt>
            <span className="material-symbols-rounded metric-ms-icon" aria-hidden="true">
              rainy
            </span>
            Curah hujan
          </dt>
          <dd className="tabular">{Number(currentSlot.tp || 0).toFixed(1)} mm</dd>
        </div>
        <div className="metric-item">
          <dt>
            <span className="material-symbols-rounded metric-ms-icon" aria-hidden="true">
              cloud
            </span>
            Tutupan awan
          </dt>
          <dd className="tabular">{currentSlot.cloudCover}%</dd>
        </div>
      </dl>
    </section>
  )
}
