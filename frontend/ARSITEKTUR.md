# Arsitektur Frontend NOTEZ (Next.js)

Dokumen ini menjelaskan **arsitektur folder, routing, dan global CSS** untuk
frontend NOTEZ, diturunkan dari BRD v1.1 dan BSD v1.1. Scope tahap ini
**hanya** struktur & skeleton — belum ada integrasi API, state management,
atau UI final.

## 1. Pilihan Teknis

| Aspek | Pilihan | Alasan |
|---|---|---|
| Framework | Next.js 16^ (App Router) | Sesuai BSD 3.3; mendukung layout bersarang & Server Components untuk cek sesi di server |
| Styling | Tailwind CSS + CSS variables | Sesuai BSD 3.3; token warna dipisah dari utility agar mudah ganti tema |
| Auth di FE | JWT di HTTP-only cookie, diverifikasi di `middleware.ts` via `jose` | Sesuai BSD 7.2 (HTTP-only cookie, expiry 3 jam) — middleware Next.js jalan di Edge Runtime, `jose` kompatibel |
| Routing | Route Groups `(auth)` & `(protected)` | Memisahkan layout publik vs ter-autentikasi tanpa mengubah URL |

## 2. Struktur Folder

```
notez-frontend/
├── .env.local.example
├── .eslintrc.json
├── .gitignore
├── README.md
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
│
└── src/
    ├── middleware.ts                          # Guard route berbasis token + role
    │
    ├── app/
    │   ├── layout.tsx                         # Root layout (font, ToastContainer)
    │   ├── page.tsx                            # Redirect "/" → "/login"
    │   ├── globals.css
    │   │
    │   ├── (auth)/                             # Route group — tanpa sidebar
    │   │   ├── layout.tsx                      # Card login/register terpusat
    │   │   ├── login/
    │   │   │   └── page.tsx
    │   │   └── register/
    │   │       └── page.tsx
    │   │
    │   ├── (user)/                             # Route group — layout sidebar role "user"
    │   │   ├── layout.tsx                      # Sidebar + Navbar untuk user
    │   │   ├── dashboard/
    │   │   │   └── page.tsx
    │   │   ├── logbook/
    │   │   │   ├── page.tsx                    # List entri + filter
    │   │   │   ├── new/
    │   │   │   │   └── page.tsx                # Form entri baru
    │   │   │   └── [id]/
    │   │   │       ├── page.tsx                # Detail entri + submit/hapus/lampiran
    │   │   │       └── edit/
    │   │   │           └── page.tsx
    │   │   ├── mentorship/
    │   │   │   └── page.tsx                    # Katalog mentor + riwayat request
    │   │   └── profile/
    │   │       └── page.tsx
    │   │
    │   └── mentor/                             # Prefix URL literal /mentor/* (bukan route group)
    │       ├── layout.tsx                      # Sidebar + Navbar untuk mentor
    │       ├── dashboard/
    │       │   └── page.tsx
    │       ├── review/
    │       │   ├── page.tsx                    # Antrean review (status=submitted)
    │       │   └── [id]/
    │       │       └── page.tsx                # Detail + approve/reject + viewer lampiran
    │       ├── students/
    │       │   └── page.tsx                    # Daftar mahasiswa bimbingan
    │       ├── mentorship/
    │       │   └── page.tsx                    # Permintaan bimbingan masuk
    │       └── profile/
    │           └── page.tsx
    │
    ├── components/
    │   ├── ui/                                 # Primitives generik
    │   │   ├── button.tsx
    │   │   ├── input.tsx
    │   │   ├── textarea.tsx
    │   │   ├── dropdown.tsx
    │   │   ├── card.tsx
    │   │   ├── badge.tsx                       # StatusBadge (draft/submitted/approved/rejected)
    │   │   ├── modal.tsx
    │   │   ├── spinner.tsx
    │   │   └── toast.tsx
    │   │
    │   ├── layout/
    │   │   ├── navbar.tsx
    │   │   ├── sidebar.tsx                     # Role-aware (menu beda utk user/mentor)
    │   │   └── notification-bell.tsx
    │   │
    │   ├── auth/
    │   │   ├── login-form.tsx
    │   │   ├── register-form.tsx
    │   │   └── captcha.tsx                     # Captcha aritmatika sederhana
    │   │
    │   ├── logbook/
    │   │   ├── entry-form.tsx                  # Form create/edit
    │   │   ├── entry-card.tsx
    │   │   ├── entry-list.tsx
    │   │   ├── entry-filter.tsx                # Filter tanggal + status
    │   │   └── attachment-upload.tsx           # Drag & drop + validasi tipe/ukuran
    │   │
    │   ├── mentorship/
    │   │   ├── mentor-card.tsx
    │   │   ├── request-list.tsx
    │   │   └── request-action.tsx              # Tombol accept/reject mentor
    │   │
    │   ├── dashboard/
    │   │   ├── stat-card.tsx
    │   │   └── activity-chart.tsx              # Chart batang ringan (tanpa lib eksternal)
    │   │
    │   └── review/
    │       ├── review-form.tsx                 # Approve/reject + catatan wajib saat reject
    │       └── pdf-viewer.tsx                  # Viewer lampiran via blob (auth header)
    │
    ├── lib/
    │   ├── api/
    │   │   ├── client.ts                       # Axios instance + interceptor Bearer Token
    │   │   ├── auth.ts
    │   │   ├── entries.ts
    │   │   ├── mentorship.ts
    │   │   ├── notifications.ts
    │   │   └── reports.ts                      # Export PDF (blob download)
    │   ├── validators/
    │   │   ├── auth.schema.ts                  # Zod: login, register
    │   │   ├── entry.schema.ts                 # Zod: entri + review
    │   │   └── mentorship.schema.ts
    │   ├── constants.ts                        # Peta API_ENDPOINTS 1:1 dgn BSD bag. 5
    │   └── utils.ts                             # cn(), formatDate(), isFutureDate()
    │
    ├── store/                                  # Zustand
    │   ├── auth-store.ts
    │   ├── notification-store.ts
    │   └── ui-store.ts                         # Toast global
    │
    ├── hooks/
    │   ├── use-auth.ts
    │   ├── use-entries.ts
    │   ├── use-mentorship.ts
    │   └── use-notifications.ts
    │
    └── types/                                  # Cermin skema tabel BSD 4.1
        ├── user.ts
        ├── entry.ts
        ├── mentorship.ts
        ├── notification.ts
        └── api.ts
```

## 3. Tabel Routing

Route Group `(auth)` dan `(protected)` **tidak muncul di URL** — hanya
untuk mengelompokkan layout.

| Path | Akses | Halaman BSD terkait | Endpoint API terkait |
|---|---|---|---|
| `/login` | Publik | #1 Autentikasi | `POST /auth/login` |
| `/register` | Publik | #1 Autentikasi | `POST /auth/register` |
| `/dashboard` | Login (semua role) | Dashboard (5.4) | `GET /dashboard` |
| `/logbook` | Role `user` | #3 Logbook | `GET /entries` |
| `/logbook/new` | Role `user` | #3 Logbook | `POST /entries` |
| `/logbook/:id` | Role `user` | #3 Logbook | `GET /entries/:id` |
| `/logbook/:id/edit` | Role `user` | #3 Logbook | `PUT /entries/:id` |
| `/mentorship` | Role `user` | #2 Mentorship | `GET /mentor`, `POST /mentorship/request/:id` |
| `/mentor/team` | Role `mentor` | #4 Menti | `GET /mentor/team` |
| `/mentor/requests` | Role `mentor` | #2 Mentorship (sisi mentor) | `GET /mentorship`, `POST /mentorship/:id/accept` |
| `/mentor/entries` | Role `mentor` | #4 Menti | `GET /mentor/entries` |
| `/mentor/entries/:id` | Role `mentor` | #4 Menti | `GET /mentor/entries/:id`, `POST .../approve`, `POST .../reject` |
| `/notifications` | Login (shared) | #5 Notifikasi | `GET /notifications`, `PUT /notifications/:id/read` |
| `/profile` | Login (shared) | Auth & Akun | `GET/PUT /profile` |
| `/reports` | Login (shared) | #5 Laporan | `GET /reports/export/pdf` |

Sumber kebenaran (single source of truth) untuk tabel ini ada di
`src/lib/constants/routes.ts` — semua `<Link>` dan pengecekan role di
komponen/middleware sebaiknya merujuk ke konstanta ini, bukan string path
manual, supaya tidak ada path yang "nyasar" saat refactor.

## 4. Strategi Auth Guard & RBAC (2 lapis)

1. **`src/middleware.ts`** (Edge, jalan sebelum render halaman)
   - Baca cookie `notez_session`, verifikasi JWT dengan `jose`.
   - Belum login + buka rute terproteksi → redirect ke `/login?next=...`.
   - Sudah login + buka `/login` atau `/register` → redirect ke `/dashboard`.
   - Sudah login tapi role tidak cocok dengan prefix rute (mis. role `user`
     membuka `/mentor/*`) → redirect ke `/dashboard`.
2. **`src/app/(protected)/layout.tsx`** (Server Component, defense-in-depth)
   - Cek ulang sesi di server sebelum merender `AppShell`.

> Penting: dua lapis ini **hanya untuk UX routing di frontend**. Sesuai
> BSD 7.1, validasi otorisasi yang sesungguhnya (mis. mentor hanya boleh
> akses entri menti bimbingannya) tetap **wajib** ditegakkan di backend.

## 5. Global CSS & Design Token (`src/app/globals.css`)

- Palet netral dingin (slate) sebagai "kertas", warna `primary` ink-blue
  untuk kesan institusional/resmi — bukan tema landing page.
- Empat warna status (`--status-draft/submitted/approved/rejected`)
  dipetakan langsung ke enum `logbook_entries.status` di BSD 4.1, dipakai
  lewat utility class `.badge-status--draft`, `.badge-status--approved`, dst.
- Font mono (`--font-mono`) khusus dipakai untuk tanggal/ID/label status —
  memberi nuansa "buku catatan" pada elemen data, terpisah dari font UI utama.
- Mendukung dark mode via class `.dark` dan menghormati
  `prefers-reduced-motion`.
- Semua token diekspos ulang sebagai warna Tailwind di `tailwind.config.ts`
  (`bg-primary`, `text-status-approved`, dll) supaya dipakai konsisten di
  komponen tanpa menulis HSL manual.
