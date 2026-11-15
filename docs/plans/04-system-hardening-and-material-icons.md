# Plan 04: Penguatan Backend, Material Icons, Unit Test, & Kesiapan Deploy

**Referensi PRD:** [PRD.md](../PRD.md)  
**Plan Sebelumnya:** [03-express-backend-proxy.md](./03-express-backend-proxy.md)

---

## 1. Tujuan
Menutup celah teknis utama pada MVP setelah audit sistem:
1. Mencegah penyalahgunaan `?refresh=true` dan spam request di backend Express.
2. Mengganti ikon eksternal BMKG dengan Material Icons berbasis SVG agar ringan, konsisten dengan rencana desain, dan tetap tampil saat offline.
3. Menambahkan unit test dan integration test otomatis menggunakan `node:test`.
4. Menyiapkan konfigurasi environment dan container untuk deployment production.

---

## 2. Daftar Perubahan
1. **Backend Express (`server/`)**
   - Tambah cooldown 60 detik pada `forceRefresh` di `server/services/bmkgProxy.js` (`cacheStatus: 'COOLDOWN'`).
   - Tambah rate limiter per IP (maksimum 60 request/menit) di `server/middleware/rateLimit.js` untuk route `/api/weather`.
2. **Frontend Material Icons (`src/components/`)**
   - Perbarui `src/components/WeatherIcon.jsx` agar memetakan kode/deskripsi cuaca BMKG ke ikon bergaya Material Symbols Rounded secara inline SVG (tanpa ketergantungan gambar eksternal).
   - Gunakan ikon Material inline pada `CurrentHero.jsx`, `DailyForecastGrid.jsx`, dan `App.jsx` (lokasi, status hujan/cerah, metrik kelembapan, angin, curah hujan, tutupan awan).
3. **Automated Tests (`tests/`)**
   - `tests/bmkgWeather.test.js` untuk menguji `isRainSlot` (termasuk kasus non-hujan dengan `tp > 0`) dan `normalizeBmkgPayload`.
   - `tests/server.test.js` untuk menguji endpoint Express (`/api/health`, `/api/weather`, cooldown, dan rate limiter).
   - Tambah skrip `"test"` di `package.json` dan konfigurasi Node globals di `eslint.config.js`.
4. **Kesiapan Deploy (Vercel)**
   - Tambah `api/index.js` (mengekspor instance Express `createApp()`) dan `vercel.json` (rewrite `/api/*` ke Express serta fallback SPA ke `index.html`).
   - Tambah `.env.example` untuk konfigurasi lokal `PORT`.
