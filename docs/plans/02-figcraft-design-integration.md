# Plan 02: Integrasi Desain UI via Figcraft MCP

**Referensi PRD:** [PRD.md](../PRD.md)  
**Plan Sebelumnya:** [01-mvp-kebumen-weather.md](./01-mvp-kebumen-weather.md)

---

## 1. Tujuan
Menyelaraskan tampilan antarmuka **Cuaca Kebumen** dengan desain dari Figma/Figcraft menggunakan **Figcraft MCP**, tanpa mengubah logika bisnis BMKG dan aturan deteksi hujan yang sudah berjalan.

---

## 2. Prasyarat Sebelum Eksekusi
1. Server **Figcraft MCP** sudah terhubung dan aktif di sesi kerja (saat ini hanya `t3-code` MCP yang terdaftar).
2. Referensi desain target tersedia (URL file/frame Figma atau nama frame yang ingin diimplementasikan untuk tampilan desktop & mobile).

---

## 3. Langkah Eksekusi (Setelah Figcraft MCP Terhubung)
1. **Inspeksi Desain via Figcraft MCP**
   - Ambil struktur frame, layer, hierarki komponen, dan aset visual (ikon/ilustrasi jika ada) dari Figcraft MCP.
   - Pastikan seluruh kebutuhan PRD tetap tercakup: verdict hujan hari ini, status hujan 3 hari ke depan, rincian per 3 jam, tombol muat ulang, state loading/error, serta atribusi resmi **BMKG**.
2. **Ekstraksi & Sinkronisasi Design Tokens (`src/index.css`)**
   - Perbarui variabel CSS untuk palet warna (termasuk state **Hujan** vs **Tidak Hujan**), tipografi, radius, shadow, dan skala spasi sesuai spesifikasi Figcraft.
3. **Refaktor Styling & Struktur Komponen UI**
   - Sesuaikan layout dan komponen di `src/App.jsx`, `src/App.css`, serta `src/components/`:
     - `CurrentHero.jsx`
     - `DailyForecastGrid.jsx`
     - `HourlyTimeline.jsx`
     - `WeatherIcon.jsx`
     - `StatusBanner.jsx`
     - `AttributionFooter.jsx`
   - Pastikan logika data di `src/services/bmkgWeather.js` dan `src/hooks/useKebumenWeather.js` tetap terpisah rapi dari lapisan UI.
4. **Verifikasi Visual & Teknis**
   - Uji responsivitas tampilan desktop dan mobile.
   - Jalankan `npm run lint` dan `npm run build` untuk memastikan bebas error.

---

## 4. Status Implementasi di FigCraft MCP
- Terhubung ke FigCraft Desktop via `figcraft-cli.exe mcp --attach 47800` pada dokumen `Untitled` (`Page 1`).
- Tiga artboard telah dibuat sesuai [figcraft-design-prompt.md](../prompts/figcraft-design-prompt.md):
  1. `Desktop — Cuaca Kebumen (1440px)` (container terpusat `820px`)
  2. `Mobile — Cuaca Kebumen (390px)` (layout responsif 2x2 metrik & daftar 3-jam)
  3. `UI States — Offline Cache, Error & Past Slot` (`390px`)
- Seluruh ikon menggunakan vektor gaya Material Icons dengan tipografi `Inter` dan `Cascadia Mono` (tabular numerals).

