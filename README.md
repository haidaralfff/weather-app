# Cuaca Kebumen — Prakiraan Hujan BMKG

Aplikasi web sederhana untuk melihat kondisi cuaca Kota Kebumen (`adm4: 33.05.12.1024`) serta status **"Hujan atau Tidak"** untuk 3 hari ke depan berdasarkan Data Terbuka BMKG, dilengkapi backend **Express.js** sebagai proxy dan cache.

## Dokumentasi & Perencanaan
- [Product Requirements Document (PRD)](./docs/PRD.md)
- [Plan 01: Implementasi MVP](./docs/plans/01-mvp-kebumen-weather.md)
- [Plan 02: Integrasi Desain Figcraft](./docs/plans/02-figcraft-design-integration.md)
- [Plan 03: Migrasi Backend ke Express.js](./docs/plans/03-express-backend-proxy.md)
- [Plan 04: Penguatan Sistem, Material Icons, & Testing](./docs/plans/04-system-hardening-and-material-icons.md)

## Menjalankan Secara Lokal
```bash
npm install
npm run dev
```

Perintah `npm run dev` menjalankan backend Express (`http://localhost:3001`) dan frontend Vite (`http://localhost:5173`) secara bersamaan.

## Pengujian & Linting
```bash
npm run lint
npm test
```

## Deploy ke Vercel
Proyek ini sudah dikonfigurasi untuk **Vercel** melalui `vercel.json` dan `api/index.js` (mengekspor aplikasi Express ke runtime Vercel tanpa `Dockerfile`).

## Sumber Data
Data prakiraan cuaca berasal dari **BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)**.
