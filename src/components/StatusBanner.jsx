export function LoadingSkeleton() {
  return (
    <div className="skeleton-wrap" aria-busy="true" aria-label="Memuat data cuaca Kebumen">
      <div className="skeleton-card skeleton-hero" />
      <div className="skeleton-grid">
        <div className="skeleton-card skeleton-day" />
        <div className="skeleton-card skeleton-day" />
        <div className="skeleton-card skeleton-day" />
      </div>
      <div className="skeleton-card skeleton-list" />
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="error-box" role="alert">
      <span className="material-symbols-rounded error-ms-icon" aria-hidden="true">
        cloud_off
      </span>
      <h2>Gagal memuat prakiraan cuaca</h2>
      <p>{message}</p>
      <button type="button" className="btn-secondary" onClick={onRetry}>
        Coba lagi
      </button>
    </div>
  )
}

export function StaleWarningBanner({ warning, onRetry, refreshing, cooldownSeconds }) {
  if (!warning) return null

  return (
    <div className="warning-banner" role="status">
      <span>
        Menampilkan cache terakhir karena server BMKG sedang tidak terjangkau ({warning}).
      </span>
      <button
        type="button"
        className="btn-link"
        onClick={onRetry}
        disabled={refreshing || cooldownSeconds > 0}
      >
        {refreshing
          ? 'Memuat...'
          : cooldownSeconds > 0
            ? `Tunggu ${cooldownSeconds}d`
            : 'Coba muat ulang'}
      </button>
    </div>
  )
}
