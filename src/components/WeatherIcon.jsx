function getMaterialWeatherIcon({
  weatherDesc = '',
  weatherCode = 0,
  isRain = false,
  timeLabel = '',
}) {
  const desc = weatherDesc.toLowerCase()
  const hour = Number.parseInt(timeLabel.slice(0, 2), 10)
  const isNight = Number.isFinite(hour) && (hour >= 18 || hour < 6)

  if (desc.includes('petir') || weatherCode >= 95) {
    return { name: 'thunderstorm', tone: 'rain' }
  }
  if (isRain || desc.includes('hujan') || desc.includes('gerimis') || weatherCode >= 60) {
    return { name: 'rainy', tone: 'rain' }
  }
  if (desc.includes('kabut') || desc.includes('asap') || desc.includes('kabur') || weatherCode === 45 || weatherCode === 5 || weatherCode === 10) {
    return { name: 'foggy', tone: 'neutral' }
  }
  if (desc.includes('cerah berawan') || weatherCode === 2) {
    return { name: isNight ? 'nights_stay' : 'partly_cloudy_day', tone: 'clear' }
  }
  if (desc.includes('cerah') || weatherCode === 0 || weatherCode === 1) {
    return { name: isNight ? 'bedtime' : 'sunny', tone: 'clear' }
  }
  return { name: 'cloud', tone: 'neutral' }
}

export function WeatherIcon({
  weatherDesc = '',
  weatherCode = 0,
  isRain = false,
  timeLabel = '',
  size = 40,
  className = '',
}) {
  const { name, tone } = getMaterialWeatherIcon({
    weatherDesc,
    weatherCode,
    isRain,
    timeLabel,
  })

  return (
    <span
      className={`material-symbols-rounded weather-ms-icon tone-${tone} ${className}`.trim()}
      style={{ fontSize: `${size}px` }}
      role="img"
      aria-label={weatherDesc || 'Ikon cuaca'}
    >
      {name}
    </span>
  )
}
