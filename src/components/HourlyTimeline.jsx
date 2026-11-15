import { formatWindDirection } from '../services/bmkgWeather'
import { WeatherIcon } from './WeatherIcon'

export function HourlyTimeline({ day, rainOnly = false, onClearRainOnly }) {
  if (!day) return null

  const maxTpInDay = Math.max(2, ...day.slots.map((s) => s.tp))
  const visibleSlots = rainOnly ? day.slots.filter((s) => s.isRain) : day.slots

  return (
    <section
      id="timeline-3-jam"
      className="section-block"
      aria-labelledby="hourly-heading"
    >
      <div className="section-header">
        <div className="section-title-group">
          <h2 id="hourly-heading">
            Prakiraan per 3 jam · {day.title}, {day.shortDate}
          </h2>
          {rainOnly && (
            <button
              type="button"
              className="filter-chip"
              onClick={onClearRainOnly}
              aria-label="Hapus filter hanya jam hujan"
            >
              <span className="material-symbols-rounded filter-chip-icon" aria-hidden="true">
                water_drop
              </span>
              Hanya jam hujan ({visibleSlots.length})
              <span className="material-symbols-rounded filter-chip-close" aria-hidden="true">
                close
              </span>
            </button>
          )}
        </div>
        <span className="section-hint tabular">
          Total hujan {Number(day.totalTp || 0).toFixed(1)} mm
        </span>
      </div>

      <div
        id="timeline-panel"
        className="timeline-list"
        role="tabpanel"
        aria-labelledby={`day-tab-${day.dateKey}`}
      >
        {visibleSlots.length === 0 ? (
          <div className="timeline-empty">
            <span className="material-symbols-rounded timeline-empty-icon" aria-hidden="true">
              check_circle
            </span>
            <p>Tidak ada jadwal hujan pada {day.title.toLowerCase()}.</p>
            <button
              type="button"
              className="btn-secondary"
              onClick={onClearRainOnly}
            >
              Tampilkan semua jam
            </button>
          </div>
        ) : (
          visibleSlots.map((slot) => {
            const rainBarPercent =
              slot.isRain && slot.tp > 0
                ? Math.max(10, Math.min(100, (slot.tp / maxTpInDay) * 100))
                : 0

            return (
              <article
                key={slot.id}
                className={`slot-row ${slot.isRain ? 'slot-rain' : 'slot-dry'} ${
                  slot.isPast ? 'slot-past' : ''
                }`}
              >
                <div className="slot-time-col">
                  <span className="slot-time tabular">{slot.timeLabel}</span>
                </div>

                <div className="slot-cond-col">
                  <WeatherIcon
                    weatherDesc={slot.weatherDesc}
                    weatherCode={slot.weatherCode}
                    isRain={slot.isRain}
                    timeLabel={slot.timeLabel}
                    size={24}
                  />
                  <div className="slot-cond-body">
                    <div className="slot-desc-row">
                      <span className="slot-desc">{slot.weatherDesc}</span>
                      {slot.isRain && <span className="slot-tag-rain">Hujan</span>}
                      {slot.isPast && <span className="slot-tag-past">Lewat</span>}
                    </div>
                    <div className="slot-submeta tabular">
                      Kelembapan {slot.humidity}% · Angin {slot.windSpeedKmh} km/j (
                      {formatWindDirection(slot.windDir)})
                    </div>
                  </div>
                </div>

                <div className="slot-rain-col">
                  {slot.isRain && (
                    <div className="rain-bar-track" aria-hidden="true">
                      <div
                        className="rain-bar-fill is-rain-fill"
                        style={{ width: `${rainBarPercent}%` }}
                      />
                    </div>
                  )}
                  <span
                    className={`slot-tp tabular ${slot.isRain ? 'is-rain-tp' : ''}`}
                  >
                    {Number(slot.tp || 0).toFixed(1)} mm
                  </span>
                </div>

                <div className="slot-temp-col tabular">{slot.tempC}°C</div>
              </article>
            )
          })
        )}
      </div>
    </section>
  )
}
