# PRD — MedRide: Ambulance Booking App

> **Versi:** 1.1 · **Tanggal:** 2026-06-09 · **Status:** Draft — Open Questions Resolved
> **Tipe proyek:** APP (auth + DB + API + real-time)

---

## ATURAN UNTUK AI (baca dulu)

- Semua isi PRD ini **dianggap sudah diputuskan (authoritative)**, KECUALI yang ditandai `[KONFIRMASI]`.
- `[KONFIRMASI] ...` = **belum pasti. Jangan dibangun/diasumsikan.** Tanyakan atau tunggu konfirmasi.
- Bila butuh sesuatu yang tidak ada di dokumen ini → **tambahkan ke Section 8 sebagai `[KONFIRMASI]`, jangan menebak.**
- Patuhi **Section 1.5 (out of scope)** dan **Section 7 (konvensi)** secara ketat.

---

## 1. Overview

### 1.1 Masalah

Di Indonesia, panggilan ambulans darurat sering terkendala oleh sulitnya menghubungi layanan, kurangnya transparansi waktu respons, dan tidak adanya informasi real-time tentang posisi ambulans. Pasien atau keluarga harus menelepon manggil, tidak tahu ambulans sudah berangkat atau belum, dan tidak bisa memilih jenis layanan sesuai kebutuhan medis. Ini menyebabkan keterlambatan penanganan yang bisa berujung fatal.

### 1.2 Tujuan

- **Tujuan utama:** Memungkinkan pengguna memesan ambulans (darurat maupun terencana) secara digital dengan tracking real-time dan konfirmasi status yang jelas.
- **Hasil yang diharapkan:**
  - Pengguna dapat memesan ambulans dan memantau keberadaannya tanpa telepon.
  - Waktu respons lebih transparan — pengguna tahu ETA sejak booking dikonfirmasi.

### 1.3 Pengguna

| Persona | Siapa mereka | Kebutuhan utama |
|---------|--------------|-----------------|
| Pasien / Keluarga | Individu yang membutuhkan ambulans, bisa dalam kondisi panik | Pesan cepat, tahu ambulans sudah jalan, bisa tracking |
| Operator Ambulans | *(Fase berikutnya — tidak ada panel di MVP; data driver dikelola via Supabase Studio)* | — |
| Admin | *(Fase berikutnya — tidak ada dashboard di MVP)* | — |

### 1.4 Success Criteria

- [ ] Pengguna dapat menyelesaikan booking (lokasi → tipe → konfirmasi) dalam < 60 detik
- [ ] Status ambulans diperbarui real-time (maks. lag 10 detik)
- [ ] Halaman utama (Home) load < 3s pada koneksi 4G
- [ ] Riwayat pesanan menampilkan semua order dengan status yang akurat
- Push notification: **tidak di MVP** (FCM masuk fase berikutnya; dikonfirmasi out of scope)

### 1.5 Scope

**Dikerjakan (MVP):**
- Autentikasi pengguna (login/register)
- Tombol darurat (one-tap emergency call)
- Booking ambulans multi-step (pilih lokasi → tipe → konfirmasi)
- Dua tipe layanan: Ambulans Reguler & Ambulans ICU
- Konfirmasi pesanan dengan nomor order & ETA
- Tracking ambulans real-time (tampilan peta + jarak + ETA)
- Pembayaran: pilih metode (kartu kredit, dompet digital, transfer bank)
- Riwayat pesanan (list + status)
- Profil pengguna (lihat & edit data)
- Pengaturan (notifikasi, lokasi, tema)
- Halaman bantuan & kontak darurat

**TIDAK dikerjakan (eksplisit di luar scope):**
- Aplikasi native (iOS/Android) — ini adalah web app mobile-optimized
- Panel admin / dashboard operator (fase berikutnya)
- Multi-bahasa (hanya Bahasa Indonesia)
- Rating/review driver
- Asuransi / integrasi BPJS
- Chat/messaging antara user dan driver
- Subscription / membership plan

**Fase berikutnya (jangan dibuat sekarang):**
- Panel admin & dispatcher
- Notifikasi push via FCM
- Integrasi peta navigasi untuk driver
- Laporan & analytics pesanan
- Multi-role (admin, driver, dispatcher)

---

## 2. Requirements (non-fungsional & constraints)

| Kategori | Requirement |
|----------|-------------|
| Performa | Halaman utama LCP < 3s pada 4G; bundle size seoptimal mungkin |
| Keamanan | Auth wajib untuk semua fitur kecuali halaman landing/login; data user (nama, telepon, alamat) disimpan terenkripsi |
| Platform | Mobile-first; tampilan web di desktop tetap fungsional namun bukan prioritas |
| Browser | Chrome & Safari mobile (iOS/Android) sebagai target utama |
| Skala | Estimasi volume trafik awal sangat kecil (proyek portofolio — tidak ada live traffic) |
| Aksesibilitas | Kontras teks memenuhi WCAG AA; label tombol darurat harus jelas dan besar |

**Constraints:**
- Prototype Figma sudah ada dan sudah di-export ke React — implementasi harus konsisten dengan UI yang ada.
- Stack frontend sudah terkunci: React + TypeScript + Tailwind CSS + shadcn/ui + Vite.
- `[KONFIRMASI]` Apakah ada deadline atau target rilis? → **Tidak ada deadline — proyek portofolio**
- `[KONFIRMASI]` Apakah ada budget constraint untuk layanan pihak ketiga (peta, payment gateway)? → **Budget nol — semua tools wajib free tier permanen**

**Asumsi:**
- Aplikasi diakses via browser mobile (bukan diinstall sebagai PWA, kecuali dikonfirmasi).
- Lokasi pengguna diambil via browser Geolocation API.
- Harga layanan: **Reguler = Rp 250.000 / ICU = Rp 500.000** (flat rate, bukan per km)

---

## 3. Core Features

### Fitur 1 — Autentikasi

- **Prioritas:** Must
- **Deskripsi:** Pengguna dapat mendaftar akun baru dan login.
- **Aktor:** Calon pengguna, pengguna terdaftar
- **Input:** Nama, nomor telepon, password (email: tidak digunakan untuk auth, hanya field profil opsional)
- **Output:** Sesi aktif; pengguna diarahkan ke Home
- **Aturan bisnis:**
  - Nomor telepon harus unik per akun
  - Verifikasi: **email + password via Supabase Auth** — tidak ada OTP SMS (semua SMS provider berbayar; tidak sesuai constraint free tier)
- **Acceptance criteria:**
  - [ ] Register dengan data valid → akun dibuat, langsung masuk ke Home
  - [ ] Register dengan nomor telepon yang sudah terdaftar → error "Nomor sudah terdaftar"
  - [ ] Login dengan kredensial salah → error "Nomor atau password salah", data tidak tersimpan
  - [ ] Sesi persisten — pengguna tidak perlu login ulang setelah menutup browser (kecuali logout)

---

### Fitur 2 — Tombol Darurat

- **Prioritas:** Must
- **Deskripsi:** Satu tombol besar di Home yang langsung membuat pesanan darurat tanpa melalui flow multi-step booking.
- **Aktor:** Pengguna yang sedang login
- **Input:** Lokasi pengguna saat ini (dari Geolocation API)
- **Output:** Pesanan darurat dibuat otomatis; pengguna diarahkan ke layar Emergency Call (Screen 2) dengan countdown ETA
- **Aturan bisnis:**
  - Tipe ambulans untuk tombol darurat: **otomatis ICU**
  - Lokasi diambil otomatis; jika Geolocation ditolak → tampilkan input manual
  - Tombol darurat **tidak terhubung ke operator manusia** — order dibuat otomatis ke sistem; driver di-assign via Supabase Studio untuk keperluan demo
- **Acceptance criteria:**
  - [ ] Tap tombol DARURAT → sistem membuat order dengan lokasi current user
  - [ ] Layar Emergency Call tampil dengan ETA dan nomor order
  - [ ] Jika lokasi tidak tersedia → form input lokasi manual muncul sebelum order dibuat

---

### Fitur 3 — Booking Ambulans (Multi-Step)

- **Prioritas:** Must
- **Deskripsi:** Flow 3 langkah untuk memesan ambulans non-darurat: pilih lokasi, pilih tipe, konfirmasi.
- **Aktor:** Pengguna yang sedang login
- **Input:**
  - Step 1: Alamat penjemputan, alamat tujuan (rumah sakit/klinik)
  - Step 2: Tipe layanan (Reguler / ICU)
  - Step 3: Review & konfirmasi
- **Output:** Pesanan tersimpan dengan nomor order unik; pengguna diarahkan ke layar Konfirmasi Pemesanan
- **Aturan bisnis:**
  - Kedua alamat (jemput & tujuan) wajib diisi
  - Input alamat: **free-text** — tidak pakai Maps autocomplete (butuh API key berbayar)
  - Estimasi biaya ditampilkan di Step 3 sebelum konfirmasi
  - Model harga: **flat rate per tipe** — Reguler Rp 250.000, ICU Rp 500.000
  - Pesanan tidak dapat dimodifikasi setelah dikonfirmasi
- **Acceptance criteria:**
  - [ ] Tidak bisa lanjut ke Step 2 jika lokasi belum diisi
  - [ ] Tipe layanan wajib dipilih sebelum ke Step 3
  - [ ] Step 3 menampilkan ringkasan: lokasi jemput, tujuan, tipe, estimasi biaya & waktu
  - [ ] Setelah konfirmasi → nomor order dibuat, diarahkan ke layar konfirmasi

---

### Fitur 4 — Konfirmasi & Notifikasi Pesanan

- **Prioritas:** Must
- **Deskripsi:** Setelah pesanan dikonfirmasi, pengguna melihat layar sukses dengan detail order dan info driver.
- **Aktor:** Pengguna
- **Input:** (otomatis dari Fitur 3)
- **Output:** Layar konfirmasi dengan: nomor order, ETA, nama driver, tombol tracking
- **Aturan bisnis:**
  - Nomor order format: `#AMB{YYYYMMDD}{sequence}` (mis. `#AMB20241018001`)
  - Info driver (nama, plat nomor) ditampilkan **setelah driver di-assign** — data driver di-seed via Supabase Studio untuk demo; foto driver tidak digunakan
- **Acceptance criteria:**
  - [ ] Layar konfirmasi menampilkan nomor order, ETA, nama driver
  - [ ] Tombol "Lacak Ambulans" mengarah ke layar tracking
  - [ ] Tombol "Kembali ke Beranda" tersedia

---

### Fitur 5 — Tracking Real-Time

- **Prioritas:** Must
- **Deskripsi:** Pengguna dapat memantau posisi ambulans secara real-time setelah pesanan dikonfirmasi.
- **Aktor:** Pengguna dengan pesanan aktif
- **Input:** (otomatis — order ID aktif)
- **Output:** Tampilan peta dengan posisi ambulans, jarak saat ini, ETA sisa, info driver
- **Aturan bisnis:**
  - Map provider: **Leaflet.js + OpenStreetMap** — gratis, tidak butuh API key
  - Posisi diperbarui setiap **5 detik** via Supabase Realtime (subscribe ke perubahan `current_lat/lng` di tabel Driver)
  - Untuk demo: posisi driver disimulasikan via script interval yang update koordinat di Supabase secara bertahap
  - Tombol telepon driver langsung memicu panggilan telepon via `tel:` link
- **Acceptance criteria:**
  - [ ] Peta menampilkan posisi ambulans yang bergerak
  - [ ] Jarak & ETA diperbarui secara real-time
  - [ ] Info driver (nama, tipe ambulans, plat nomor) ditampilkan
  - [ ] Tap tombol telepon → memulai panggilan ke driver

---

### Fitur 6 — Pembayaran

- **Prioritas:** Must
- **Deskripsi:** Pengguna memilih metode pembayaran **setelah perjalanan selesai** (post-payment).
- **Aktor:** Pengguna
- **Input:** Pilihan metode: kartu kredit, dompet digital, transfer bank
- **Output:** **Simulasi pembayaran** — tidak ada integrasi payment gateway nyata; tap "Bayar" langsung update status order ke "Lunas"
- **Aturan bisnis:**
  - Payment gateway: **tidak ada (mock UI)** — simulasi lokal cukup untuk portofolio
  - Pembayaran dilakukan **sesudah layanan** selesai
  - Total biaya ditampilkan sebelum konfirmasi pembayaran
- **Acceptance criteria:**
  - [ ] Tiga metode pembayaran ditampilkan dengan ikon yang jelas
  - [ ] Pengguna harus memilih salah satu sebelum lanjut
  - [ ] Total biaya final ditampilkan sebelum tombol "Bayar"
  - [ ] Setelah bayar → status order berubah menjadi "Lunas" dan pesanan masuk ke Riwayat dengan status "Selesai"

---

### Fitur 7 — Riwayat Pesanan

- **Prioritas:** Must
- **Deskripsi:** Pengguna dapat melihat semua pesanan yang pernah dibuat, lengkap dengan status dan detail.
- **Aktor:** Pengguna
- **Input:** (tidak ada — data diambil dari akun pengguna)
- **Output:** List pesanan dengan: nama tujuan, tanggal, biaya, status
- **Aturan bisnis:**
  - Status yang mungkin: Menunggu, Dikonfirmasi, Dalam Perjalanan, Selesai, Dibatalkan
  - Pengguna **bisa membatalkan pesanan** selama status masih `PENDING` atau `CONFIRMED`; status `ON_THE_WAY` ke atas tidak bisa dibatalkan
- **Acceptance criteria:**
  - [ ] Semua pesanan milik pengguna ditampilkan, diurutkan terbaru di atas
  - [ ] Status ditampilkan dengan badge warna berbeda (selesai = hijau, dibatalkan = abu)
  - [ ] Tap item riwayat → **menampilkan halaman detail pesanan** (nomor order, alamat, tipe, biaya, status)

---

### Fitur 8 — Profil Pengguna

- **Prioritas:** Must
- **Deskripsi:** Pengguna dapat melihat dan mengedit data profil mereka.
- **Aktor:** Pengguna yang sudah login
- **Input (edit):** Nama, nomor telepon, email, alamat
- **Output:** Data tersimpan; tampilan profil diperbarui
- **Aturan bisnis:**
  - Nomor telepon **tidak bisa diubah** setelah registrasi (digunakan sebagai identifier unik akun)
- **Acceptance criteria:**
  - [ ] Profil menampilkan: nama, telepon, email, alamat, total pesanan
  - [ ] Tombol Edit → form dengan data ter-prefill
  - [ ] Simpan dengan data valid → perubahan tersimpan dan tampil di profil
  - [ ] Simpan dengan email format salah → validasi inline muncul

---

### Fitur 9 — Pengaturan

- **Prioritas:** Should
- **Deskripsi:** Toggle pengaturan aplikasi untuk pengguna.
- **Aktor:** Pengguna
- **Input:** Toggle on/off
- **Output:** Preferensi disimpan ke profil pengguna
- **Aturan bisnis:**
  - Toggle: Push Notification, Location Tracking, Dark Mode
  - Logout menghapus sesi lokal dan redirect ke halaman login
- **Acceptance criteria:**
  - [ ] State toggle persisten setelah refresh
  - [ ] Logout → sesi dihapus, redirect ke login, tidak bisa back ke halaman protected
  - [ ] Dark mode toggle → mengubah tema aplikasi secara instan

---

### Fitur 10 — Bantuan & Support

- **Prioritas:** Could
- **Deskripsi:** Halaman berisi kontak darurat, FAQ, dan cara menghubungi support.
- **Aktor:** Pengguna
- **Input:** (tidak ada)
- **Output:** Informasi kontak (telepon, email, WhatsApp) yang bisa di-tap
- **Acceptance criteria:**
  - [ ] Nomor telepon bisa di-tap untuk langsung menelepon
  - [ ] WhatsApp link membuka WhatsApp (via `wa.me/` link)
  - [ ] Bagian FAQ menampilkan pertanyaan umum yang bisa di-expand

---

## 4. User Flow

### Flow utama: Booking Ambulans Non-Darurat

1. Pengguna membuka app → sudah login → tampil Home
2. Tap "Pesan Ambulans"
3. **Step 1:** Isi lokasi penjemputan & tujuan → tap Lanjut
4. **Step 2:** Pilih tipe (Reguler / ICU) → tap Lanjut
5. **Step 3:** Review ringkasan + estimasi biaya → tap Konfirmasi
6. Layar konfirmasi tampil: nomor order, ETA, nama driver
7. Pengguna tap "Lacak Ambulans" → layar tracking real-time
8. Ambulans tiba → status berubah "Selesai"
9. Layar pembayaran muncul → pilih metode → bayar
10. Pesanan masuk ke Riwayat dengan status "Selesai"

### Flow utama: Darurat

1. Pengguna di Home → tap tombol merah "TOMBOL DARURAT"
2. Sistem mengambil lokasi GPS secara otomatis
3. Order darurat dibuat → layar Emergency Call tampil
4. Countdown ETA ditampilkan + informasi "Ambulans sedang menuju lokasi Anda"
5. Pengguna bisa tap "Lacak Ambulans" untuk tracking detail

### Flow error / alternatif

- **Geolocation ditolak** → sistem tampilkan form input alamat manual, booking tidak bisa dilanjut tanpa alamat penjemputan
- **Tidak ada ambulans tersedia** → tampilkan toast error: "Tidak ada ambulans tersedia saat ini, coba beberapa saat lagi"
- **Pembayaran gagal** → tidak relevan (mock payment — tidak ada payment failure)
- **Sesi expired** → redirect ke login dengan pesan "Sesi Anda telah berakhir, silakan login kembali"

---

## 5. Data / Content Model

### Entitas: `User`

| Field | Tipe | Wajib? | Catatan |
|-------|------|--------|---------|
| `id` | `uuid` | ya | Primary key |
| `name` | `string` | ya | Nama lengkap |
| `phone` | `string` | ya | Unik; format +62 |
| `email` | `string` | ya | Unik; digunakan untuk Supabase Auth login |
| `address` | `string` | tidak | Alamat default |
| `created_at` | `timestamp` | ya | Auto |

### Entitas: `Order`

| Field | Tipe | Wajib? | Catatan |
|-------|------|--------|---------|
| `id` | `uuid` | ya | Primary key |
| `order_number` | `string` | ya | Format `AMB{YYYYMMDD}{seq}` |
| `user_id` | `uuid` | ya | FK → User |
| `pickup_address` | `string` | ya | |
| `pickup_lat` | `float` | tidak | Diisi jika Geolocation tersedia |
| `pickup_lng` | `float` | tidak | Diisi jika Geolocation tersedia |
| `destination_address` | `string` | ya | |
| `service_type` | `enum` | ya | `REGULER` / `ICU` |
| `status` | `enum` | ya | `PENDING` / `CONFIRMED` / `ON_THE_WAY` / `ARRIVED` / `COMPLETED` / `CANCELLED` |
| `driver_id` | `uuid` | tidak | FK → Driver; nullable sampai driver assigned |
| `estimated_cost` | `integer` | ya | Dalam rupiah |
| `final_cost` | `integer` | tidak | Diisi setelah selesai |
| `payment_method` | `enum` | tidak | `CREDIT_CARD` / `DIGITAL_WALLET` / `BANK_TRANSFER` |
| `payment_status` | `enum` | tidak | `UNPAID` / `PAID` |
| `eta_minutes` | `integer` | tidak | ETA dalam menit saat order dibuat |
| `created_at` | `timestamp` | ya | Auto |

### Entitas: `Driver`

> Data driver di-seed manual via Supabase Studio untuk keperluan demo. Tidak ada panel driver di MVP. `current_lat/lng` diupdate via script simulasi untuk demo real-time tracking.

| Field | Tipe | Wajib? | Catatan |
|-------|------|--------|---------|
| `id` | `uuid` | ya | |
| `name` | `string` | ya | |
| `phone` | `string` | ya | |
| `license_plate` | `string` | ya | |
| `ambulance_type` | `enum` | ya | `REGULER` / `ICU` |
| `current_lat` | `float` | tidak | Untuk real-time tracking |
| `current_lng` | `float` | tidak | Untuk real-time tracking |

**Relasi:**
- `Order.user_id` → FK ke `User.id`
- `Order.driver_id` → FK ke `Driver.id` (nullable)

---

## 6. Architecture & Tech

**Tech stack yang sudah terkunci:**

| Layer | Teknologi |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Routing | React Router 7 |
| State | React useState + useContext (tidak perlu state manager eksternal) |
| Backend | Supabase (BaaS — PostgreSQL + Auth + Realtime + REST API) |
| Database | PostgreSQL via Supabase |
| Auth | Supabase Auth (email + password) |
| Real-time | Supabase Realtime (subscribe ke perubahan tabel Driver) |
| Maps | Leaflet.js + OpenStreetMap (gratis, tanpa API key) |
| Payment | Mock UI — simulasi lokal, tidak ada integrasi gateway |
| Hosting | Vercel (frontend) + Supabase free tier (backend) |

**Integrasi pihak ketiga:**
- Maps: **Leaflet.js + OpenStreetMap** — tidak butuh API key
- Payment: **tidak ada** — mock UI simulasi lokal
- SMS/OTP: **tidak digunakan** — auth via email + password (Supabase Auth)
- Push notification: **tidak di MVP** — FCM masuk fase berikutnya

---

## 7. Design & Technical Constraints

**Konvensi kode / teknis:**
- Library wajib: React 18, TypeScript, Tailwind CSS 4, shadcn/ui, Vite, React Router 7, Lucide React
- Library yang dilarang: Jangan tambah component library lain (sudah ada MUI + shadcn/ui, cukup shadcn/ui saja untuk komponen baru)
- Pola yang harus diikuti: Ikuti struktur komponen yang ada di `src/app/components/`; UI components di `src/app/components/ui/`
- Penamaan file: PascalCase untuk komponen React; camelCase untuk utilities
- Bahasa UI: Bahasa Indonesia (semua label, pesan error, teks)

**Design:**
- Typography: sistem default Tailwind (sans-serif)
- Color palette:
  - Primary: Blue (blue-600, blue-700)
  - Danger / Darurat: Red (red-600, red-700)
  - Success: Green (green-600, green-700)
  - Info / Warning: Yellow (yellow-50 bg, yellow-800 text)
  - Neutral: Gray scale
- Viewport app: mobile-first, max-width `28rem` (448px) untuk tampilan aplikasi
- Prinsip: Tombol darurat HARUS selalu menonjol (merah, besar, kontras tinggi)
- Referensi visual: Prototype Figma yang sudah di-export (`src/app/App.tsx`)

**Error & edge case handling:**

| Kondisi | Respons sistem | Pesan ke user |
|---------|----------------|---------------|
| Input form kosong | Validasi inline, form tidak submit | "Field ini wajib diisi" |
| Format telepon salah | Validasi inline | "Format nomor tidak valid" |
| Geolocation ditolak | Tampilkan form input manual | "Izinkan akses lokasi atau isi alamat secara manual" |
| Sesi expired | Redirect ke login | "Sesi Anda telah berakhir, silakan login kembali" |
| Network error | Toast error | "Koneksi bermasalah, coba lagi" |
| Tidak ada ambulans tersedia | Tampilkan modal / toast error, order tidak dibuat | "Tidak ada ambulans tersedia saat ini, coba beberapa saat lagi" |

---

## 8. Open Questions / Keputusan

> Semua item di bawah telah dikonfirmasi per versi 1.1. Tidak ada `[KONFIRMASI]` yang tersisa.
> Konteks keputusan: proyek portofolio showcase — constraint utama adalah **zero cost (free tier permanen)**.

| No | Pertanyaan | Keputusan | Reasoning |
|----|-----------|-----------|-----------|
| 1 | Backend technology | **Supabase (BaaS)** | Free tier: 500MB DB, 50K MAU. Auth + Realtime + REST API sudah bundled. Zero-maintenance untuk portofolio. |
| 2 | Database | **PostgreSQL via Supabase** | Sepaket dengan no.1. PostgreSQL lebih solid untuk showcase dibanding NoSQL karena relasi data terdefinisi jelas. |
| 3 | Auth | **Supabase Auth — email + password** | Built-in, JWT otomatis dihandle, gratis. Tidak perlu implementasi manual. |
| 4 | Verifikasi nomor telepon / OTP | **Tidak pakai OTP SMS** | Semua SMS provider (Twilio, Vonage, Zenziva) berbayar. Auth via email + password. Nomor telepon tetap ada sebagai field profil. |
| 5 | Real-time tracking | **Supabase Realtime** | Bundled dengan Supabase. Subscribe ke perubahan `current_lat/lng` di tabel Driver. Free. |
| 6 | Maps provider | **Leaflet.js + OpenStreetMap** | 100% gratis, tidak butuh API key, tidak ada billing risk. Cukup untuk menampilkan peta + marker posisi ambulans. |
| 7 | Payment gateway | **Mock UI — simulasi lokal** | Proyek portofolio. Reviewer melihat UI dan flow, bukan transaksi nyata. Tap "Bayar" langsung update status order. |
| 8 | Pembayaran sebelum atau sesudah layanan | **Sesudah layanan (post-payment)** | Pre-payment tidak masuk akal untuk konteks darurat. Flow: order selesai → layar pembayaran → pilih metode → status "Lunas". |
| 9 | Panel operator/driver di MVP | **Tidak ada** | Data driver di-seed dan dikelola manual via Supabase Studio. Posisi driver untuk demo disimulasikan via script interval. |
| 10 | Tipe ambulans untuk tombol DARURAT | **Otomatis ICU** | Default paling defensif untuk konteks darurat. |
| 11 | Input alamat booking | **Free-text** | Maps autocomplete butuh API key berbayar. Free-text dengan validasi wajib diisi cukup untuk demo flow booking. |
| 12 | Model harga | **Flat rate per tipe: Reguler Rp 250.000 / ICU Rp 500.000** | Sederhana, tidak butuh kalkulasi jarak, mudah diimplementasi. |
| 13 | Pembatalan pesanan | **Bisa dibatalkan saat status PENDING atau CONFIRMED** | Status ON_THE_WAY ke atas tidak bisa dibatalkan. Logis secara operasional, mudah diimplementasi. |
| 14 | Hosting | **Vercel (frontend) + Supabase free tier (backend)** | Keduanya free tier permanen. React + Vite ke Vercel adalah zero-config deploy. |
| 15 | PWA | **Tidak** | Menambah kompleksitas tanpa nilai portofolio yang signifikan. Web app mobile-optimized sudah cukup. |

---

*Living document. Update saat ada keputusan signifikan. Detail fungsional hanya di Section 3 — jangan duplikasi.*
