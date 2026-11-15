# Cuaca Kebumen — Prakiraan Hujan BMKG

Aplikasi web untuk memantau kondisi cuaca terkini di **Kota Kebumen** (`adm4: 33.05.12.1024`) serta menjawab cepat **"apakah hari ini dan 3 hari ke depan hujan atau tidak, dan pukul berapa"** berdasarkan Data Terbuka resmi BMKG.

## Fitur Utama

- **Ringkasan & Verdict Harian:** Menampilkan kondisi terdekat saat ini (suhu, kelembapan, arah & kecepatan angin, curah hujan, tutupan awan) beserta kesimpulan apakah sisa hari ini berpotensi hujan.
- **Prakiraan 3 Hari Ke Depan:** Kartu pemilih untuk **Hari Ini**, **Besok**, dan **Lusa** lengkap dengan status hujan, rentang suhu min–maks, dan daftar jam berpotensi hujan (`WIB`), dapat dinavigasi dengan klik maupun keyboard (`tablist`/`tab`).
- **Timeline Per 3 Jam & Filter Hujan:** Rincian cuaca per 3 jam (`00:00`–`21:00 WIB`) dengan bar visual intensitas curah hujan (`mm`) dan toggle **Hanya jam hujan**.
- **Tema Gelap & Terang:** Default *dark-mode first* dengan toggle *light mode* yang tersimpan di `localStorage` dan sinkron ke `<meta name="theme-color">`.
- **Proxy, Cache, & Fallback Offline:** Backend **Express.js** menyediakan cache in-memory 15 menit, cooldown *force refresh* 60 detik, rate limiting, serta fallback ke cache `localStorage` saat offline/upstream bermasalah.

## Teknologi

- **Frontend:** React 19, Vite 8, CSS custom tokens (`Outfit` + `Onest`, `Material Symbols Rounded`)
- **Backend:** Express 5 (`server/app.js`) + adapter serverless Vercel (`api/index.js`)
- **Pengujian & Kualitas:** ESLint 10, `node:test`

## Struktur Proyek

```text
weather-app/
├── api/index.js          # Entry point serverless Vercel
├── server/               # Backend Express (routes, rate limiter, proxy cache BMKG)
├── src/                  # Frontend React (components, hooks, services/bmkgWeather.js)
├── public/favicon.svg    # Ikon brand Cuaca Kebumen
├── tests/                # Unit & route tests (node --test)
├── docs/                 # PRD, rencana implementasi (01–06), & prompt desain
├── .env.example          # Contoh variabel environment (PORT=YOUR_PORT)
└── vercel.json           # Routing SPA & /api/* untuk Vercel
```

## Menjalankan Secara Lokal

### Prasyarat
- Node.js `>= 20` dan `npm`

### Langkah Instalasi

```bash
git clone https://github.com/haidaralfff/weather-app.git
cd weather-app
npm install
npm run dev
```

Perintah `npm run dev` menjalankan backend Express (`http://localhost:3001`) dan frontend Vite (`http://localhost:5173`) secara bersamaan.

### Konfigurasi Environment (Opsional)

Aplikasi tidak memerlukan API key atau database (data BMKG bersifat publik). Jika ingin mengubah port backend lokal:

```bash
cp .env.example .env
# lalu ubah PORT=3001 (default fallback: 3001)
```

## Perintah Tersedia

| Perintah | Fungsi |
| :--- | :--- |
| `npm run dev` | Menjalankan backend Express + frontend Vite secara bersamaan |
| `npm run build` | Membangun bundle produksi ke folder `dist/` |
| `npm start` | Menjalankan server Express produksi (melayani `dist/` jika tersedia) |
| `npm run lint` | Menjalankan pemeriksaan ESLint |
| `npm test` | Menjalankan seluruh unit & API test (`tests/*.test.js`) |

## Endpoint Backend

- `GET /api/health` — Cek status layanan dan kode wilayah (`adm4: 33.05.12.1024`).
- `GET /api/weather` — Mengambil data prakiraan BMKG dengan header `X-Cache` (`MISS`, `HIT`, `COOLDOWN`, atau `STALE`). Tambahkan `?refresh=true` untuk muat ulang paksa (dibatasi cooldown 60 detik).

## Deploy ke Vercel

Proyek ini siap di-deploy ke **Vercel** tanpa konfigurasi tambahan:
1. Import repository `haidaralfff/weather-app` di dashboard Vercel.
2. Gunakan preset **Vite** (build command: `npm run build`, output directory: `dist`).
3. Routing `/api/*` otomatis diarahkan ke `api/index.js` sesuai `vercel.json`.

## Dokumentasi & Perencanaan

- [Product Requirements Document (PRD)](./docs/PRD.md)
- [Plan 01: Implementasi MVP](./docs/plans/01-mvp-kebumen-weather.md)
- [Plan 02: Integrasi Desain Figcraft](./docs/plans/02-figcraft-design-integration.md)
- [Plan 03: Migrasi Backend ke Express.js](./docs/plans/03-express-backend-proxy.md)
- [Plan 04: Penguatan Sistem, Material Icons, & Testing](./docs/plans/04-system-hardening-and-material-icons.md)
- [Plan 05: Pengujian Lokal Terstruktur](./docs/plans/05-local-e2e-verification.md)
- [Plan 06: Tactile UI, Brand Logo, & Arsitektur](./docs/plans/06-tactile-ui-brand-and-architecture.md)
- [Prompt Desain FigCraft](./docs/prompts/figcraft-design-prompt.md)

## Sumber Data

Seluruh data prakiraan cuaca berasal dari **BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)** melalui layanan Data Terbuka BMKG.
