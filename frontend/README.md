# NOTEZ Logbook — Frontend

Platform pencatatan logbook dan bimbingan (mentorship) untuk mahasiswa PKL.
Dibangun dengan **Next.js 16 App Router**, **Tailwind CSS v4**, dan **TypeScript**.

---

## Daftar Isi

1. [Gambaran Proyek](#gambaran-proyek)
2. [Tech Stack Aktual](#tech-stack-aktual)
3. [Prasyarat](#prasyarat)
4. [Instalasi & Menjalankan Lokal](#instalasi--menjalankan-lokal)
5. [Konfigurasi Environment Variables](#konfigurasi-environment-variables)
6. [Struktur Folder Aktual](#struktur-folder-aktual)
7. [Perintah yang Tersedia](#perintah-yang-tersedia)
8. [Arsitektur Singkat](#arsitektur-singkat)
9. [Dokumen Referensi](#dokumen-referensi)

---

## Gambaran Proyek

NOTEZ adalah sistem logbook digital untuk mahasiswa PKL. Mahasiswa (role `user`)
mencatat aktivitas harian mereka, mengajukan ke mentor, dan mentor (role `mentor`)
mereview serta menyetujui atau menolak entri tersebut.

**Fitur utama yang sudah ada:**

| Fitur | Role | Status |
|---|---|---|
| Login & Register | Semua | ✅ Selesai |
| Dashboard statistik | Semua | ✅ Selesai |
| Buat/Edit/Hapus Logbook | `user` | ✅ Selesai |
| Submit Logbook ke Mentor | `user` | ✅ Selesai |
| Upload Lampiran (file) | `user` | ✅ Selesai |
| Katalog & Request Mentor | `user` | ✅ Selesai |
| Review Antrean Logbook | `mentor` | ✅ Selesai |
| Approve / Reject Logbook | `mentor` | ✅ Selesai |
| Daftar Mahasiswa Aktif | `mentor` | ✅ Selesai |
| Notifikasi | Semua | 🚧 Struktur ada, belum implementasi |
| Export PDF | Semua | 🚧 Endpoint ada, belum implementasi |
| Profile Edit | Semua | 🚧 Halaman ada, belum implementasi |

---

## Tech Stack Aktual

> ⚠️ Semua versi ini **aktual** sesuai `package.json`. Jangan upgrade sembarangan.

| Kategori | Library | Versi |
|---|---|---|
| Framework | `next` | 16.2.10 |
| Runtime | `react` / `react-dom` | 19.2.4 |
| Bahasa | `typescript` | ^5 |
| Styling | `tailwindcss` | ^4 |
| Form | `react-hook-form` + `@hookform/resolvers` | ^7 / ^5 |
| Validasi | `zod` | ^4.4.3 |
| HTTP Client | `axios` | ^1.18.1 |
| State Global | `zustand` | ^5.0.14 |
| Auth (Edge) | `jose` | ^6.2.4 |
| Cookie (Client) | `js-cookie` | ^3.0.8 |
| Icons | `@phosphor-icons/react` + `lucide-react` | ^2 / ^1 |
| Animasi | `framer-motion` | ^12 |
| Tanggal | `date-fns` | ^4 |
| Class utils | `clsx` + `tailwind-merge` | ^2 / ^3 |
| Testing | `jest` + `@testing-library/react` | ^30 / ^16 |

---

## Prasyarat

- **Node.js** v18 atau lebih baru
- **npm** v9+ (atau `yarn` / `pnpm`)
- Backend NOTEZ API **sudah berjalan** di URL tertentu (lihat bagian env di bawah)

---

## Instalasi & Menjalankan Lokal

```bash
# 1. Clone atau masuk ke folder
cd frontend

# 2. Install semua dependensi
npm install

# 3. Salin file env dan isi nilainya
cp .env.example .env

# 4. Jalankan dev server
npm run dev
```

Dev server berjalan di **`http://localhost:4000`** (bukan 3000 — sudah dikonfigurasi di `package.json`).

> **Catatan Docker:** Jika menggunakan Docker Compose, jalankan `docker compose up --build` dari root folder. Frontend akan terekspos di port 4000.

---

## Konfigurasi Environment Variables

Salin `.env.example` menjadi `.env` lalu isi semua nilainya:

```env
# Secret JWT — harus sama persis dengan yang dipakai backend
# Dipakai oleh: src/proxy.ts dan src/lib/auth-guard.ts (server-side JWT verify)
JWT_SECRET=isi_dengan_secret_yang_sama_seperti_backend

# Base URL backend API — dipakai oleh apiClient (Axios) di browser
# Format: http://host:port/api  (tanpa trailing slash)
NEXT_PUBLIC_API_URL=http://localhost:3333/api

# Base URL alternatif (biasanya sama, bisa berbeda untuk internal Docker network)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3333
```

> ⚠️ **Penting:** `JWT_SECRET` adalah variabel **server-only** (tanpa prefix `NEXT_PUBLIC_`).
> Variabel ini hanya dibaca di Edge Runtime (`proxy.ts`) dan Server Components (`auth-guard.ts`).
> Jangan pernah expose ke client.

---

## Struktur Folder Aktual

```text
frontend/
├── .env / .env.example
├── .gitignore / .dockerignore
├── Dockerfile / docker-compose.yml
├── next.config.ts         # output: standalone, allowedDevOrigins
├── jest.config.ts         # Konfigurasi Jest + ts-jest
├── jest.setup.ts
├── tsconfig.json
├── package.json
├── postcss.config.mjs
│
├── AGENTS.md              # Panduan untuk semua AI Agents
├── ARSITEKTUR.md          # Arsitektur detail, routing, design system
├── CLAUDE.md              # Panduan vibe coding khusus AI assistant
│
└── src/
    ├── proxy.ts           # ⭐ Middleware guard JWT (Edge Runtime via jose)
    │
    ├── app/               # Next.js App Router
    │   ├── layout.tsx     # Root layout (font global, body)
    │   ├── page.tsx       # Redirect "/" → "/login"
    │   ├── globals.css    # Design token Tailwind v4 + custom CSS
    │   ├── not-found.tsx  # Halaman 404 kustom
    │   │
    │   ├── api/           # Route Handler Next.js (API internal)
    │   │
    │   ├── (auth)/        # Route group — layout publik tanpa sidebar
    │   │   ├── layout.tsx
    │   │   ├── login/page.tsx
    │   │   └── register/page.tsx
    │   │
    │   ├── (user)/        # Route group — terproteksi, role "user"
    │   │   ├── layout.tsx      # → requireAuth("user") + AppShell
    │   │   ├── dashboard/page.tsx
    │   │   ├── logbook/
    │   │   │   ├── page.tsx        # List semua entri + filter
    │   │   │   ├── new/page.tsx    # Form buat entri baru
    │   │   │   └── [id]/
    │   │   │       ├── page.tsx    # Detail entri + submit/hapus
    │   │   │       └── edit/page.tsx
    │   │   ├── mentorship/page.tsx # Katalog mentor + riwayat request
    │   │   └── profile/page.tsx
    │   │
    │   └── mentor/        # Route literal /mentor/* — role "mentor"
    │       ├── layout.tsx      # → requireAuth("mentor") + AppShell
    │       ├── dashboard/page.tsx
    │       ├── review/
    │       │   ├── page.tsx        # Antrean entri berstatus "submitted"
    │       │   └── [id]/page.tsx   # Detail entri + form approve/reject
    │       ├── students/page.tsx   # Daftar mahasiswa bimbingan aktif
    │       └── profile/page.tsx
    │
    ├── components/
    │   ├── ui/            # ⭐ Komponen primitif generik — SELALU gunakan ini dulu
    │   │   ├── badge.tsx          # StatusBadge (draft/submitted/approved/rejected)
    │   │   ├── button.tsx
    │   │   ├── card.tsx
    │   │   ├── confirm-dialog.tsx # Modal konfirmasi dengan callback
    │   │   ├── dropdown.tsx
    │   │   ├── input.tsx
    │   │   ├── modal.tsx
    │   │   ├── select.tsx
    │   │   ├── skeleton.tsx       # Loading skeleton placeholder
    │   │   ├── spinner.tsx
    │   │   ├── textarea.tsx
    │   │   ├── toast.tsx          # Tampilan toast notifikasi
    │   │   └── warning-icon.tsx
    │   │
    │   ├── layout/        # Shell aplikasi dan navigasi
    │   │   ├── app-shell.tsx      # Wrapper Sidebar + Navbar + main content
    │   │   ├── navbar.tsx
    │   │   ├── sidebar.tsx        # Role-aware (menu berbeda user/mentor)
    │   │   ├── notification-bell.tsx
    │   │   └── footer.tsx
    │   │
    │   ├── auth/
    │   │   ├── auth-wrapper.tsx   # Wrapper styling halaman auth
    │   │   ├── login-form.tsx
    │   │   ├── register-form.tsx
    │   │   └── captcha.tsx        # Captcha aritmatika sederhana
    │   │
    │   ├── logbook/
    │   │   ├── entry-form.tsx     # Form create & edit (React Hook Form + Zod)
    │   │   ├── entry-list.tsx     # List card entri logbook
    │   │   ├── entry-filter.tsx   # Filter berdasarkan status & tanggal
    │   │   ├── attachment-upload.tsx # Drag & drop + validasi tipe/ukuran
    │   │   └── __tests__/         # Unit test komponen logbook
    │   │
    │   ├── mentorship/
    │   │   ├── mentor-list.tsx          # Katalog mentor (role: user)
    │   │   ├── request-list.tsx         # Riwayat request bimbingan (role: user)
    │   │   ├── request-action.tsx       # Tombol accept/reject (role: mentor)
    │   │   ├── mentor-request-list.tsx  # Antrean request masuk (role: mentor)
    │   │   ├── active-student-list.tsx  # Tabel mahasiswa aktif (role: mentor)
    │   │   ├── student-detail-modal.tsx # Modal detail statistik seorang mahasiswa
    │   │   └── __tests__/
    │   │
    │   └── review/
    │       ├── review-form.tsx    # Form approve/reject dengan Zod discriminated union
    │       └── pdf-viewer.tsx     # Viewer lampiran via blob URL
    │
    ├── config/
    │   └── messages.ts    # Konstanta pesan error & sukses (MESSAGES.ERROR.xxx)
    │
    ├── hooks/             # Custom hooks — logika bisnis di sisi klien
    │   ├── use-auth.ts          # login(), register(), logout()
    │   ├── use-entries.ts       # fetchEntries(), deleteEntry()
    │   ├── use-mentorship.ts    # useMentorship(), useActiveStudents()
    │   ├── use-mentor-request.ts
    │   ├── use-mentor-review.ts # fetchQueue(), evaluate()
    │   ├── use-notifications.ts # (struktur ada, belum implementasi)
    │   └── __tests__/
    │
    ├── lib/
    │   ├── auth-guard.ts  # ⭐ requireAuth() — Server Component, verifikasi JWT
    │   ├── auth-session.ts # getStoredUser() — baca user dari localStorage
    │   ├── constants.ts   # API_ENDPOINTS (sumber kebenaran semua URL endpoint)
    │   ├── utils.ts       # cn() — helper clsx + tailwind-merge
    │   │
    │   ├── api/           # Layer Axios per domain fitur
    │   │   ├── client.ts         # Axios instance + interceptor attach Bearer token
    │   │   ├── auth.ts           # authApi.login(), authApi.register()
    │   │   ├── entries.ts        # entriesApi.getAll/getById/create/update/delete/submit
    │   │   ├── mentorship.ts     # mentorshipApi.getMentors/requestMentorship/accept/reject
    │   │   ├── mentor-review.ts  # mentorReviewApi.getQueue/getById/evaluate
    │   │   ├── notifications.ts  # (stub, belum implementasi)
    │   │   └── reports.ts        # (stub, belum implementasi)
    │   │
    │   └── validators/    # Skema Zod per domain
    │       ├── auth.schema.ts        # loginSchema, registerSchema
    │       ├── entry.schema.ts       # entrySchema
    │       ├── mentorship.schema.ts  # mentorshipRequestSchema
    │       ├── review.schema.ts      # reviewActionSchema (discriminated union)
    │       └── __tests__/
    │
    ├── store/             # Zustand global state
    │   ├── auth-store.ts         # useAuthStore — user, isAuthenticated, setUser, logout
    │   ├── ui-store.ts           # useUIStore — showToast(), hideToast()
    │   └── notification-store.ts # (stub, belum implementasi)
    │
    └── types/             # TypeScript interfaces — cermin skema database
        ├── user.ts        # User { id, name, email, role }
        ├── entry.ts       # LogbookEntry, Attachment, LogbookStatus
        ├── mentorship.ts  # Mentor, MentorshipHistory, ActiveStudent
        ├── api.ts         # ApiResponse<T>, AuthResponse, ApiError
        └── notification.ts # (stub)
```

---

## Perintah yang Tersedia

```bash
npm run dev           # Dev server di http://localhost:4000
npm run build         # Build produksi (output: standalone)
npm run start         # Jalankan build produksi
npm run lint          # ESLint check
npm run test          # Jalankan semua unit test (Jest)
npm run test:watch    # Jest dalam mode watch
npm run test:coverage # Jest dengan laporan coverage
```

---

## Arsitektur Singkat

**Alur autentikasi:**
```
User buka halaman terproteksi
  → src/proxy.ts (Edge Runtime) baca cookie "token"
  → jose.jwtVerify() dengan JWT_SECRET
  → Gagal: redirect /login | Berhasil: lanjut render
  → Layout.tsx (Server Component) panggil requireAuth()
  → Double-check sesi sebelum render AppShell
```

**Alur data fetching (client-side):**
```
page.tsx (Server Component)
  → render komponen UI (Client Component dengan "use client")
  → useEffect() panggil custom hook (use-entries, use-mentorship, dll)
  → hook panggil fungsi di lib/api/*.ts (Axios apiClient)
  → apiClient interceptor otomatis attach Bearer token dari cookie
  → Response di-set ke useState → UI re-render
```

---

## Dokumen Referensi

| File | Isi |
|---|---|
| [`ARSITEKTUR.md`](./ARSITEKTUR.md) | Detail routing, auth guard, design system, API endpoints |
| [`AGENTS.md`](./AGENTS.md) | Aturan wajib untuk semua AI coding agents |
| [`CLAUDE.md`](./CLAUDE.md) | Panduan vibe, mental model, dan decision-making untuk AI assistant |
