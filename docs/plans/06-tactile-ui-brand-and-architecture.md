# Plan 06: Tactile UI, Tipografi & Hierarki, Brand Logo, dan Arsitektur Tanpa DB/Login

**Referensi PRD:** [PRD.md](../PRD.md)  
**Plan Sebelumnya:** [05-local-e2e-verification.md](./05-local-e2e-verification.md)  
**Prompt Desain:** [figcraft-design-prompt.md](../prompts/figcraft-design-prompt.md)

---

## 1. Tujuan
Menyelaraskan tampilan live React, prompt desain, dan canvas FigCraft dengan standar **Tactile Design**, memperkuat identitas visual lewat logo brand khusus **Cuaca Kebumen**, serta mengunci keputusan arsitektur agar aplikasi tetap cepat, ringan, dan siap deploy.

---

## 2. Perubahan UI, Tipografi, & Brand Identity (Selesai)

### A. Tactile Layout & Hover Sidebar
- **Dark-Mode First + Light Toggle:** Tema default `dark` (`#0B1117` ground, `#131C26` surface, `#192430` sunken well) dengan fallback pre-paint di `index.html` dan toggle tema tersimpan di `localStorage` (`cuaca_kebumen_theme`).
- **Full-Height Docked Sidebar (`SidebarNav.jsx`):**
  - Desktop (`>= 768px`): rail `64px` menempel penuh kiri layar dan melebar mulus menjadi `236px` saat hover/focus (`margin-left` workspace menyesuaikan pada `>= 1180px`).
  - Mobile (`< 768px`): drawer sheet via tombol menu (`44×44px` touch target).
- **Asymmetric 2-Column Bento Grid:** Kolom kiri `430px` (Hero Verdict + 3 Kartu Hari), kolom kanan `1fr` (Timeline 3 Jam tanpa scroll berlebih di `1440×900`), plus bar progres curah hujan khusus pada jam hujan.

### B. Tipografi, Hierarki Visual, & Bahasa Non-Teknis
- **Font Pairing (`index.html`, `src/index.css`):**
  - Display: `Outfit` (SemiBold, tracking rapat `-0.025em` s/d `-0.035em`) untuk suhu hero `44px`, judul halaman `26px`, dan header section `18px`.
  - Body & Data: `Onest` dengan `font-variant-numeric: tabular-nums` (`.tabular`) untuk jam, suhu, dan curah hujan agar sejajar tanpa font coding/monospace.
- **Penghapusan Istilah Teknis:** Menghapus font monospace serta istilah developer/API (`adm4 33.05.12.1024`, `Slot terdekat`, `slot`, `Kode wilayah`, `Rilis analisis`, `Data langsung`) menjadi bahasa Indonesia natural (`Kebumen, Jawa Tengah`, `jadwal`, `Pukul XX:00 WIB`, `Terbaru` / `Tersimpan` / `Mode offline`).

### C. Brand Logo Khusus (`BrandLogo.jsx` & `favicon.svg`)
- **Identitas Visual:** Emblem squircle `40×40` (`rx=10`, `#16222F` dengan border `#2D3F52`) yang memadukan tiga warna semantik aplikasi:
  - Matahari amber (`#E29A3B`) -> kondisi cerah.
  - Awan geometris (`#EAF1F8`) -> berawan.
  - Dua kapsul hujan miring biru (`#3BA4D1`) -> potensi hujan.
- **Integrasi Menyeluruh:** Dipasang pada [BrandLogo.jsx](../../src/components/BrandLogo.jsx), [SidebarNav.jsx](../../src/components/SidebarNav.jsx), header mobile [App.jsx](../../src/App.jsx), [favicon.svg](../../public/favicon.svg), [figcraft-design-prompt.md](../prompts/figcraft-design-prompt.md), dan canvas **FigCraft Desktop**.

---

## 3. Keputusan Arsitektur (Tanpa Database & Tanpa Login)

| Aspek | Keputusan Saat Ini | Alasan Teknis & UX | Kapan Perlu Ditambahkan |
| :--- | :--- | :--- | :--- |
| **Database** | **Tidak perlu** | Data berasal real-time dari API publik BMKG (3 hari). Server Express cukup memakai cache in-memory + cooldown 60s + fallback `localStorage` client. | Jika kelak butuh arsip histori cuaca jangka panjang (mingguan/bulanan) atau jadwal alert tersimpan di server. |
| **Login / Auth** | **Tidak perlu** | Target aplikasi adalah jawaban instan < 3 detik. Tanpa data pribadi atau multi-user state, login hanya menambah friksi. | Jika kelak ada sinkronisasi multi-wilayah per akun atau langganan notifikasi personal (WhatsApp/Email/Push). |

---

## 4. Rencana Tahap Berikutnya (Next Roadmap)

### Fase 1 — Deployment & Smoke Test Produksi
- [ ] Deploy ke **Vercel** memakai konfigurasi [vercel.json](../../vercel.json) dan [api/index.js](../../api/index.js).
- [ ] Verifikasi endpoint produksi `/api/health` dan `/api/weather` dari domain publik serta cek header cache & rate limit.
- [ ] Uji akses melalui perangkat mobile nyata (Android/iOS) untuk memastikan layout, font, dan touch target aman.

### Fase 2 — Peningkatan Pengalaman Lokal (Opsional, Tanpa DB/Login)
- [ ] **Auto-refresh periodik di tab aktif:** Polling ringan atau re-fetch otomatis saat tab kembali fokus (`visibilitychange`) jika cache `> 15 menit`.
- [ ] **Dukungan PWA ringan:** Tambah `manifest.webmanifest` + ikon PNG (`192×192`, `512×512`) dari `BrandLogo` agar warga Kebumen bisa pin ke Home Screen HP.
- [ ] **Custom kecamatan/kelurahan sekitar Kebumen (opsional):** Hanya jika dibutuhkan, simpan pilihan terakhir di `localStorage` tanpa perlu akun.

### Fase 3 — Ekspansi (Hanya Jika Scope Bertambah)
- [ ] Tambah database (mis. PostgreSQL/SQLite) dan auth ringan apabila produk berkembang ke **arsip cuaca** atau **notifikasi hujan terjadwal**.

---

## 5. Checklist Verifikasi Terakhir

- [x] `npm test` — 5/5 unit & API integration test lulus.
- [x] `npm run lint` — 0 error ESLint.
- [x] `npm run build` — bundle produksi (`dist/`) sukses terbangun.
- [x] Headless Chrome (`1440×900` & `390×844`) — sidebar hover (`64px` <-> `236px`), mobile drawer, dark default, `overflowX: false`, 0 console/page error.
- [x] FigCraft Desktop — frame Desktop Dark, Mobile Dark, UI States, dan Desktop Light tersinkron dengan tipografi & BrandLogo terbaru.
