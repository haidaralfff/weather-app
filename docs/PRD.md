# Product Requirements Document (PRD) — Weather App Kebumen

## 1. Ringkasan Produk
**Nama Proyek:** Cuaca Kebumen  
**Tujuan Utama:** Aplikasi web ringan dan cepat untuk melihat kondisi cuaca terkini serta menjawab pertanyaan utama warga Kebumen: **"Apakah hari ini dan hari-hari ke depan di Kota Kebumen hujan atau tidak, dan jika hujan pada jam berapa?"**  
**Sumber Data:** API Publik Data Terbuka BMKG (`https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=33.05.12.1024`).

---

## 2. Target Pengguna & Scope

### Target Pengguna
- Warga Kota Kebumen dan sekitarnya yang membutuhkan pengecekan cuaca harian secara instan tanpa navigasi rumit.

### In-Scope (MVP)
1. **Lokasi Terkunci ke Kota Kebumen**
   - Default otomatis ke Kelurahan Kebumen, Kecamatan Kebumen, Kabupaten Kebumen (`adm4 = 33.05.12.1024`).
   - Tidak ada form pencarian wilayah kompleks pada versi awal agar aplikasi langsung menampilkan informasi begitu dibuka.
2. **Status "Hujan atau Tidak" per Hari (3 Hari Ke Depan)**
   - Menampilkan ringkasan **Hari Ini**, **Besok**, dan **Lusa** (sesuai batas data resmi endpoint publik BMKG yaitu 3 hari ke depan per interval 3 jam).
   - Setiap hari memiliki status tegas: **Berpotensi Hujan** atau **Tidak Hujan**, beserta daftar jam perkiraan hujan (mis. `15:00`, `18:00 WIB`).
3. **Detail Prakiraan per 3 Jam**
   - Menampilkan daftar slot waktu per 3 jam (`00:00` – `21:00 WIB`) lengkap dengan ikon cuaca BMKG, suhu (`°C`), deskripsi kondisi, curah hujan (`mm`), kelembapan (`%`), serta arah & kecepatan angin (`km/jam`).
   - Untuk hari ini, slot jam yang sudah lewat ditandai/diredam secara visual agar pengguna fokus pada jam yang akan datang.
4. **Kepatuhan Atribusi & Transparansi Data**
   - Menampilkan atribusi resmi **BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)** dan waktu rilis analisis (`analysis_date`).

### Out-of-Scope (Sementara)
- Pencarian seluruh kota/kelurahan se-Indonesia atau deteksi GPS.
- Prakiraan 7–14 hari (tidak tersedia pada endpoint gratis ini).
- Real-time WebSocket / SSE (tidak diperlukan karena BMKG memperbarui data prakiraan 2 kali sehari).
- Sistem akun pengguna atau notifikasi push server.

---

## 3. Kebutuhan Fungsional

| ID | Fitur | Deskripsi |
| :--- | :--- | :--- |
| **FR-01** | Auto-fetch Cuaca Kebumen | Saat halaman dimuat, aplikasi otomatis mengambil data prakiraan BMKG untuk `adm4=33.05.12.1024` (menggunakan cache lokal jika masih segar). |
| **FR-02** | Ringkasan Hari Ini (Hero) | Menampilkan kondisi slot terdekat saat ini (suhu, ikon, deskripsi, kelembapan, angin) serta kesimpulan apakah sisa hari ini berpotensi hujan atau tidak. |
| **FR-03** | Kartu Harian 3 Hari Ke Depan | Menampilkan 3 kartu hari (Hari Ini, Besok, Lusa) dengan status **Berpotensi Hujan** / **Tidak Hujan**, rentang suhu min–maks, dan jam-jam hujan. |
| **FR-04** | Rincian Slot Per 3 Jam | Pengguna dapat memilih salah satu hari untuk melihat rincian cuaca per 3 jam beserta curah hujan (`tp` dalam mm). |
| **FR-05** | Muat Ulang Manual & Fallback Cache | Tombol muat ulang paksa (*refresh*) serta fallback otomatis ke cache tersimpan jika offline atau API BMKG gagal. |
| **FR-06** | Atribusi BMKG | Footer wajib mencantumkan BMKG sebagai sumber data beserta timestamp pembaruan terakhir. |

---

## 4. Aturan Bisnis & Logika Deteksi Hujan
Berdasarkan inspeksi langsung JSON aktual BMKG (`api.bmkg.go.id/publik/prakiraan-cuaca?adm4=33.05.12.1024`):
1. Field `tp` (curah hujan dalam mm) terkadang bernilai `0.1`–`0.9` pada kondisi `Cerah`, `Cerah Berawan`, atau `Berawan`. Karena itu, klasifikasi utama hujan harus mengacu pada kondisi cuaca resmi BMKG agar tidak menimbulkan *false positive*.
2. **Aturan Slot Hujan (`isRainSlot`)**:
   - `weather_desc` (lowercase) mengandung `"hujan"`, `"petir"`, atau `"gerimis"`, **atau**
   - `weather >= 60` (kode WMO untuk hujan/gerimis/badai petir pada API JSON BMKG).
   - Nilai `tp` (`mm`) tetap ditampilkan pada kartu/timeline agar pengguna tahu estimasi curah hujan di setiap slot.
3. **Aturan Status Hari**:
   - Jika terdapat `>= 1` slot hujan pada hari tersebut → **Berpotensi Hujan** (disertai jam-jam hujan, mis. `15:00 WIB`).
   - Jika `0` slot hujan → **Tidak Hujan** (disertai kondisi cuaca dominan pada hari tersebut).
4. **Penanganan Hari Berjalan (Hari Ini)**:
   - BMKG mengembalikan slot tersisa dari waktu rilis/berjalan (terkadang hanya 1–2 slot pada malam hari). UI harus menangani jumlah slot bervariasi per hari dengan rapi.

---

## 5. Arsitektur & Kebutuhan Non-Fungsional

1. **Anti-CORS & Rate Limit (Backend Express.js)**
   - Endpoint `api.bmkg.go.id` tidak mengirim header `Access-Control-Allow-Origin` untuk browser dan membatasi **60 permintaan/menit per IP**.
   - **Backend (`server/`)**: Server **Express.js** menyediakan endpoint `/api/weather` dan `/api/health` dengan **in-memory cache TTL 15 menit**, deduplikasi request paralel, timeout 8 detik, dan fallback stale cache.
   - **Development**: `npm run dev` menjalankan Express (`:3001`) dan Vite (`:5173`) bersamaan, dengan Vite mem-proxy `/api` ke Express.
   - **Production**: Express melayani API sekaligus file statis hasil build `dist/`.
2. **Client-Side Caching**
   - Simpan payload di `localStorage` dengan TTL **15 menit**. Jika fetch gagal, gunakan cache kedaluwarsa sebagai fallback dengan label penanda.
3. **Performa & Responsivitas**
   - Mobile-first, tetap rapi di desktop, aksesibel (kontras terjaga, keyboard navigable), dan memiliki state loading/error yang informatif.
