import { useEffect, useRef } from 'react'
import { BrandLogo } from './BrandLogo'

const NAV_ITEMS = [
  { id: 'ringkasan', icon: 'today', label: 'Hari ini' },
  { id: 'prakiraan-harian', icon: 'calendar_view_day', label: '3 hari ke depan' },
  { id: 'timeline-3-jam', icon: 'schedule', label: 'Rincian 3 jam' },
]

export function SidebarNav({
  activeSection,
  onNavigate,
  rainOnly,
  onToggleRainOnly,
  theme,
  onToggleTheme,
  onRefresh,
  refreshing,
  cooldownSeconds,
  mobileOpen,
  onCloseMobile,
  returnFocusRef,
}) {
  const drawerRef = useRef(null)
  const closeBtnRef = useRef(null)
  const wasOpenRef = useRef(false)

  useEffect(() => {
    if (mobileOpen) {
      wasOpenRef.current = true
      const frame = requestAnimationFrame(() => {
        closeBtnRef.current?.focus()
      })
      const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
          onCloseMobile()
          return
        }
        if (event.key === 'Tab' && drawerRef.current) {
          const focusables = drawerRef.current.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
          )
          if (!focusables.length) return
          const first = focusables[0]
          const last = focusables[focusables.length - 1]
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last.focus()
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first.focus()
          }
        }
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => {
        cancelAnimationFrame(frame)
        window.removeEventListener('keydown', handleKeyDown)
      }
    }

    if (wasOpenRef.current) {
      wasOpenRef.current = false
      returnFocusRef?.current?.focus()
    }
    return undefined
  }, [mobileOpen, onCloseMobile, returnFocusRef])

  const isDark = theme === 'dark'
  const isDisabled = refreshing || cooldownSeconds > 0
  const refreshLabel = refreshing
    ? 'Memperbarui...'
    : cooldownSeconds > 0
      ? `Tunggu ${cooldownSeconds}d`
      : 'Perbarui data'

  const handleNavClick = (sectionId) => {
    onNavigate(sectionId)
    onCloseMobile()
  }

  return (
    <>
      <aside className="sidebar-rail" aria-label="Menu navigasi samping">
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <span className="sidebar-brand-mark">
              <BrandLogo size={36} />
            </span>
            <div className="sidebar-brand-text">
              <span className="sidebar-brand-title">Cuaca Kebumen</span>
              <span className="sidebar-brand-code">Kebumen, Jawa Tengah</span>
            </div>
          </div>

          <div className="sidebar-divider" role="separator" />

          <nav className="sidebar-group" aria-label="Bagian halaman">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`sidebar-item ${isActive ? 'is-active' : ''}`}
                  onClick={() => onNavigate(item.id)}
                  title={item.label}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <span className="material-symbols-rounded sidebar-ms-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="sidebar-label">{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-divider" role="separator" />

          <div className="sidebar-group">
            <button
              type="button"
              role="switch"
              aria-checked={rainOnly}
              className={`sidebar-item sidebar-toggle-row ${rainOnly ? 'is-rain-active' : ''}`}
              onClick={onToggleRainOnly}
              title="Hanya tampilkan jam hujan"
            >
              <span className="material-symbols-rounded sidebar-ms-icon" aria-hidden="true">
                water_drop
              </span>
              <span className="sidebar-label">Hanya jam hujan</span>
              <span className={`tactile-switch ${rainOnly ? 'is-on' : ''}`} aria-hidden="true">
                <span className="tactile-switch-knob" />
              </span>
            </button>

            <button
              type="button"
              className="sidebar-item"
              onClick={onToggleTheme}
              title={isDark ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'}
            >
              <span className="material-symbols-rounded sidebar-ms-icon" aria-hidden="true">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
              <span className="sidebar-label">
                {isDark ? 'Tema terang' : 'Tema gelap'}
              </span>
            </button>

            <button
              type="button"
              className="sidebar-item"
              onClick={onRefresh}
              disabled={isDisabled}
              title={refreshLabel}
            >
              <span
                className={`material-symbols-rounded sidebar-ms-icon ${refreshing ? 'spin' : ''}`}
                aria-hidden="true"
              >
                {cooldownSeconds > 0 && !refreshing ? 'schedule' : 'refresh'}
              </span>
              <span className={`sidebar-label ${cooldownSeconds > 0 ? 'tabular' : ''}`}>
                {refreshLabel}
              </span>
            </button>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="mobile-drawer-backdrop"
          onClick={onCloseMobile}
          role="presentation"
        >
          <div
            ref={drawerRef}
            className="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Menu navigasi"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-drawer-head">
              <div className="mobile-drawer-brand">
                <span className="sidebar-brand-mark">
                  <BrandLogo size={36} />
                </span>
                <div>
                  <div className="sidebar-brand-title">Cuaca Kebumen</div>
                  <div className="sidebar-brand-code">Kebumen, Jawa Tengah</div>
                </div>
              </div>
              <button
                ref={closeBtnRef}
                type="button"
                className="icon-btn"
                onClick={onCloseMobile}
                aria-label="Tutup menu"
              >
                <span className="material-symbols-rounded" aria-hidden="true">
                  close
                </span>
              </button>
            </div>

            <div className="sidebar-divider" role="separator" />

            <nav className="mobile-drawer-list" aria-label="Navigasi cepat">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`mobile-drawer-row ${isActive ? 'is-active' : ''}`}
                    onClick={() => handleNavClick(item.id)}
                  >
                    <span className="material-symbols-rounded" aria-hidden="true">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </nav>

            <div className="sidebar-divider" role="separator" />

            <div className="mobile-drawer-list">
              <button
                type="button"
                role="switch"
                aria-checked={rainOnly}
                className={`mobile-drawer-row mobile-drawer-switch ${rainOnly ? 'is-rain-active' : ''}`}
                onClick={onToggleRainOnly}
              >
                <span className="mobile-drawer-row-left">
                  <span className="material-symbols-rounded" aria-hidden="true">
                    water_drop
                  </span>
                  <span>Hanya jam hujan</span>
                </span>
                <span className={`tactile-switch ${rainOnly ? 'is-on' : ''}`} aria-hidden="true">
                  <span className="tactile-switch-knob" />
                </span>
              </button>

              <button
                type="button"
                className="mobile-drawer-row"
                onClick={onToggleTheme}
              >
                <span className="material-symbols-rounded" aria-hidden="true">
                  {isDark ? 'light_mode' : 'dark_mode'}
                </span>
                <span>{isDark ? 'Tema terang' : 'Tema gelap'}</span>
              </button>

              <button
                type="button"
                className="mobile-drawer-row"
                onClick={() => {
                  onRefresh()
                  onCloseMobile()
                }}
                disabled={isDisabled}
              >
                <span
                  className={`material-symbols-rounded ${refreshing ? 'spin' : ''}`}
                  aria-hidden="true"
                >
                  {cooldownSeconds > 0 && !refreshing ? 'schedule' : 'refresh'}
                </span>
                <span className={cooldownSeconds > 0 ? 'tabular' : undefined}>
                  {refreshLabel}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
