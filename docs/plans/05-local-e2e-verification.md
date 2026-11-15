# Plan 05: Pengujian Lokal Terstruktur

**Referensi PRD:** [PRD.md](../PRD.md)  
**Plan Sebelumnya:** [04-system-hardening-and-material-icons.md](./04-system-hardening-and-material-icons.md)

---

## Daftar Task Verifikasi Lokal

- [x] **Task 1 — Linting, Unit Test, & Build Produksi**
  - `npm run lint`: lolos (0 error).
  - `npm test`: 5/5 test lolos (`isRainSlot`, `normalizeBmkgPayload`, `getKebumenForecast`, Express routes + rate limit).
  - `npm run build`: lolos (`dist/` terbangun).
- [x] **Task 2 — Uji Integrasi Dev Server (`Vite` + `Express Proxy`)**
  - `GET http://127.0.0.1:5173/` memuat HTML frontend.
  - `GET http://127.0.0.1:5173/api/health` lolos (`ok: true`, `adm4: 33.05.12.1024`).
  - `GET http://127.0.0.1:5173/api/weather` memverifikasi urutan cache `MISS` → `HIT` → `COOLDOWN` (`?refresh=true`).
- [x] **Task 3 — Uji Render UI & Interaksi Browser Lokal**
  - Heading tampil: `Kebumen, Kec. Kebumen`.
  - Verdict hari ini tampil: `Tidak Ada Hujan Hari Ini`.
  - 3 kartu hari tampil (`Hari Ini: Tidak Hujan`, `Besok: Berpotensi Hujan`, `Lusa: Berpotensi Hujan`).
  - Klik tab `Besok` memperbarui daftar menjadi `Rincian Per 3 Jam — Besok (Senin, 16 Nov)` (8 slot).
  - Klik tombol `Perbarui` sukses tanpa error; atribusi resmi BMKG dan timestamp `analysis_date` tampil.
  - Console / runtime error di browser: `0`.
- [x] **Task 4 — Pembersihan Proses & Laporan Hasil**
  - Seluruh proses sementara (`node`, `vite`, headless Chrome) ditutup rapi setelah pengujian selesai.
