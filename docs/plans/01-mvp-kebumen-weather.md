# Plan 01: Implementasi MVP Weather App Kebumen

**Referensi PRD:** [PRD.md](../PRD.md)  
**Target Kode Wilayah:** `33.05.12.1024` (Kelurahan Kebumen, Kec. Kebumen, Kab. Kebumen, Jawa Tengah)

---

## 1. Tujuan Implementasi
Membangun MVP aplikasi web React + Vite yang langsung menampilkan cuaca Kota Kebumen dan status **"Hujan atau Tidak"** untuk 3 hari ke depan berdasarkan API resmi BMKG, lengkap dengan proxy anti-CORS, caching lokal, dan persiapan deployment production.

---

## 2. Struktur Folder Target
```text
weather-app/
├── api/
│   └── weather.js                 # Serverless proxy production (Vercel-compatible) + cache header
├── docs/
│   ├── PRD.md                     # Dokumen kebutuhan produk
│   └── plans/
│       └── 01-mvp-kebumen-weather.md
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── AttributionFooter.jsx  # Atribusi wajib BMKG + analysis_date
│   │   ├── CurrentHero.jsx        # Ringkasan cuaca Kebumen saat ini & verdict hari ini
│   │   ├── DailyForecastGrid.jsx  # 3 kartu hari: Hujan / Tidak Hujan + jam hujan
│   │   ├── HourlyTimeline.jsx     # Rincian slot per 3 jam & bar curah hujan
│   │   └── StatusBanner.jsx       # State loading, error, & info fallback cache
│   ├── hooks/
│   │   └── useKebumenWeather.js   # Hook orkestrasi fetch, cache TTL, & refresh
│   ├── services/
│   │   └── bmkgWeather.js         # Fetcher API, normalisasi JSON, & logika deteksi hujan
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html                     # lang="id", judul "Cuaca Kebumen — Prakiraan Hujan BMKG", font
├── package.json
└── vite.config.js                 # Konfigurasi proxy dev (/api/weather -> api.bmkg.go.id)
```

---

## 3. Langkah Eksekusi
1. **Konfigurasi Proxy & Metadata**
   - Tambah `server.proxy` pada `vite.config.js` agar request `/api/weather` diteruskan ke `https://api.bmkg.go.id/publik/prakiraan-cuaca`.
   - Tambah `api/weather.js` sebagai handler serverless untuk production agar tidak terblokir CORS.
   - Perbarui `index.html` (`lang="id"`, judul, dan font `Plus Jakarta Sans` + `JetBrains Mono`).
2. **Service & Logika Deteksi Hujan (`src/services/bmkgWeather.js`)**
   - Fetch dengan fallback cache `localStorage` (TTL 15 menit).
   - Normalisasi struktur `data[0].cuaca` (array 2D per hari → per 3 jam).
   - Implementasi deteksi slot hujan (`weather_desc`, kode `weather >= 60`, atau `tp >= 0.5`), agregasi status harian (*Berpotensi Hujan* vs *Tidak Hujan*), suhu min/maks, serta penandaan slot hari ini yang sudah lewat (`isPast`).
3. **Hook & Komponen UI**
   - Buat `useKebumenWeather` untuk menangani status `loading`, `error`, `isStaleFallback`, `lastFetchedAt`, dan `refresh()`.
   - Bangun UI bergaya instrumen cuaca yang fokus pada jawaban "Hujan atau Tidak" di `CurrentHero`, `DailyForecastGrid`, `HourlyTimeline`, dan `AttributionFooter`.
   - Bersihkan file boilerplate yang tidak dipakai (`src/assets/hero.png`, `react.svg`, `vite.svg`, `public/icons.svg`).
4. **Verifikasi**
   - Jalankan `npm run lint` dan `npm run build` untuk memastikan nol error.
   - Uji fungsi parser & proxy dengan skrip verifikasi atau endpoint live BMKG.
