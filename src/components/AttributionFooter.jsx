import { formatAnalysisDate } from '../services/bmkgWeather'

export function AttributionFooter({ analysisDate, source, fetchedAt }) {
  const sourceLabel =
    source === 'stale-cache'
      ? 'Data tersimpan (offline)'
      : 'Diperbarui'

  const dotClass =
    source === 'network'
      ? 'is-live'
      : source === 'stale-cache'
        ? 'is-stale'
        : 'is-cache'

  const fetchedTimeLabel = fetchedAt
    ? new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(fetchedAt))
    : '-'

  return (
    <footer className="app-footer">
      <p className="attribution-main">
        Sumber data resmi:{' '}
        <a
          href="https://data.bmkg.go.id/prakiraan-cuaca/"
          target="_blank"
          rel="noreferrer"
        >
          BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)
        </a>
      </p>
      <p className="attribution-meta tabular">
        <span className={`status-dot ${dotClass}`} aria-hidden="true" />
        <span>
          {sourceLabel} pukul {fetchedTimeLabel} WIB · Rilis BMKG{' '}
          {formatAnalysisDate(analysisDate)} WIB
        </span>
      </p>
    </footer>
  )
}
