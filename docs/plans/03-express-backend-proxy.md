# Plan 03: Migrasi Backend ke Express.js

**Referensi PRD:** [PRD.md](../PRD.md)  
**Plan Terkait:** [01-mvp-kebumen-weather.md](./01-mvp-kebumen-weather.md)

---

## 1. Tujuan
Mengganti handler serverless native (`api/weather.js`) dengan backend **Express.js** yang lebih terstruktur, mudah dijalankan di mana saja (lokal, VPS, Docker, Railway/Render), serta memiliki **in-memory cache** di sisi server.

---

## 2. Arsitektur Backend Express
```text
Development:
  Browser ──▶ Vite Dev Server (:5173) ──(/api/*)──▶ Express Server (:3001) ──▶ api.bmkg.go.id

Production:
  Browser ──▶ Express Server (:3001 / PORT)
                ├── /api/weather  (In-memory cache 15 menit + timeout 8s -> BMKG)
                ├── /api/health   (Health check server)
                └── /*            (Serve static build dari dist/)
```

---

## 3. Struktur File Baru
- `server/app.js` — Inisialisasi aplikasi Express, middleware keamanan dasar (`X-Content-Type-Options`, disable `x-powered-by`), routing API, error handler, dan static serving `dist/` untuk production.
- `server/index.js` — Entry point untuk menyalakan HTTP server Express (`PORT` default `3001`).
- `server/routes/weather.js` — Endpoint `GET /api/weather` khusus `adm4=33.05.12.1024` (Kota Kebumen) + `GET /api/health`.
- `server/services/bmkgProxy.js` — Fetch ke BMKG dengan timeout 8 detik, in-memory cache TTL 15 menit, deduplikasi request paralel, dan fallback stale cache jika upstream error.
- Hapus `api/weather.js` agar tidak ada duplikasi backend.

---

## 4. Perubahan Konfigurasi
1. `package.json`:
   - Tambah `express` (dependencies) & `concurrently` (devDependencies).
   - Skrip:
     - `dev`: Menjalankan Express + Vite secara bersamaan.
     - `dev:client`: Hanya Vite.
     - `dev:server`: Hanya Express (`node --watch server/index.js`).
     - `start`: Menjalankan Express production (`NODE_ENV=production node server/index.js`).
2. `vite.config.js`:
   - Arahkan proxy `/api` ke `http://localhost:3001` (server Express), bukan langsung ke `api.bmkg.go.id`.
3. `eslint.config.js`:
   - Tambah rule environment `globals.node` untuk `server/**/*.js`.
4. `docs/PRD.md`:
   - Perbarui bagian arsitektur backend dari serverless function ke Express.js.
