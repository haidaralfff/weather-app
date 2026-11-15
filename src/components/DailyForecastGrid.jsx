import { useRef } from 'react'
import { WeatherIcon } from './WeatherIcon'

export function DailyForecastGrid({ days, selectedDateKey, onSelectDay }) {
  const tabRefs = useRef([])
  if (!days?.length) return null

  const handleKeyDown = (event, index) => {
    let nextIndex = null
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (index + 1) % days.length
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (index - 1 + days.length) % days.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = days.length - 1
    }

    if (nextIndex === null) return
    event.preventDefault()
    const targetDay = days[nextIndex]
    onSelectDay(targetDay.dateKey)
    tabRefs.current[nextIndex]?.focus()
  }

  return (
    <section
      id="prakiraan-harian"
      className="section-block"
      aria-labelledby="daily-heading"
    >
      <div className="section-header">
        <h2 id="daily-heading">Prakiraan 3 hari ke depan</h2>
        <span className="section-hint">Pilih hari</span>
      </div>

      <div className="daily-grid" role="tablist" aria-label="Pilih hari prakiraan">
        {days.map((day, index) => {
          const isSelected = day.dateKey === selectedDateKey
          const activeRainSlots =
            day.offsetDays === 0 ? day.upcomingRainSlots : day.rainSlots
          const isRainDay = activeRainSlots.length > 0
          const dominantSlot =
            activeRainSlots[0] ||
            day.slots.find((s) => s.timeLabel === '12:00') ||
            day.slots[0]

          return (
            <button
              key={day.dateKey}
              ref={(el) => {
                tabRefs.current[index] = el
              }}
              id={`day-tab-${day.dateKey}`}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls="timeline-panel"
              tabIndex={isSelected ? 0 : -1}
              className={`day-card ${isSelected ? 'is-selected' : ''} ${
                isRainDay ? 'day-rain' : 'day-clear'
              }`}
              onClick={() => onSelectDay(day.dateKey)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              <div className="day-card-main">
                <div className="day-card-head">
                  <div>
                    <div className="day-title">{day.title}</div>
                    <div className="day-date">{day.shortDate}</div>
                  </div>
                </div>

                <div className="day-card-mid">
                  <span
                    className={`day-rain-badge ${
                      isRainDay ? 'badge-rain' : 'badge-clear'
                    }`}
                  >
                    {isRainDay ? 'Berpotensi hujan' : 'Tidak hujan'}
                  </span>
                  <p className="day-rain-hours">
                    {isRainDay
                      ? `Jam ${activeRainSlots
                          .map((s) => s.timeLabel)
                          .join(', ')} WIB`
                      : day.dominantCondition}
                  </p>
                </div>
              </div>

              <div className="day-card-aside">
                <WeatherIcon
                  weatherDesc={day.dominantCondition}
                  weatherCode={dominantSlot?.weatherCode || 0}
                  isRain={isRainDay}
                  timeLabel={dominantSlot?.timeLabel || '12:00'}
                  size={24}
                />
                <div className="day-card-nums">
                  <span className="day-temps tabular">
                    {day.tempMin ?? '-'}° / {day.tempMax ?? '-'}°C
                  </span>
                  <span className="day-slots-count tabular">
                    {day.slots.length} jadwal
                  </span>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
