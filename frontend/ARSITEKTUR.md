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
├── .env.example
├── package.json
├── next.config.mjs
├── tailwind.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── ARSITEKTUR.md
└── src/
    ├── middleware.ts                          # Guard auth + RBAC per rute
    ├── app/
    │   ├── layout.tsx                         # Root layout (<html>/<body>)
    │   ├── page.tsx                           # "/" -> redirect login/dashboard
    │   ├── not-found.tsx
    │   ├── globals.css                        # Tailwind + design tokens
    │   ├── (auth)/                             # Grup publik, tanpa navbar
    │   │   ├── layout.tsx                     # Shell terpusat (card)
    │   │   ├── login/page.tsx                 # /login
    │   │   └── register/page.tsx              # /register
    │   └── (protected)/                        # Grup ter-autentikasi
    │       ├── layout.tsx                     # Cek sesi + render AppShell
    │       ├── dashboard/page.tsx             # /dashboard
    │       ├── logbook/                       # khusus role "user"
    │       │   ├── page.tsx                   # /logbook
    │       │   ├── new/page.tsx               # /logbook/new
    │       │   └── [id]/
    │       │       ├── page.tsx               # /logbook/:id
    │       │       └── edit/page.tsx          # /logbook/:id/edit
    │       ├── mentorship/page.tsx            # /mentorship (khusus "user")
    │       ├── mentor/                        # khusus role "mentor"
    │       │   ├── team/page.tsx              # /mentor/team
    │       │   ├── requests/page.tsx          # /mentor/requests
    │       │   └── entries/
    │       │       ├── page.tsx               # /mentor/entries
    │       │       └── [id]/page.tsx          # /mentor/entries/:id
    │       ├── notifications/page.tsx         # /notifications (shared)
    │       ├── profile/page.tsx               # /profile (shared)
    │       └── reports/page.tsx               # /reports (shared)
    ├── components/
    │   ├── layout/
    │   │   ├── AppShell.tsx                   # Navbar + Sidebar + content
    │   │   ├── Navbar.tsx
    │   │   └── Sidebar.tsx                    # Menu berbeda per role
    │   └── ui/                                # (kosong) tempat komponen UI reusable nanti
    ├── lib/
    │   ├── auth/session.ts                    # Verifikasi JWT dari cookie
    │   └── constants/
    │       ├── roles.ts                       # ROLES.USER / ROLES.MENTOR
    │       ├── logbook-status.ts              # draft/submitted/approved/rejected
    │       └── routes.ts                      # Peta path <-> role <-> endpoint API
    └── types/
        └── index.ts                           # Tipe User, LogbookEntry, dll (cermin tabel BSD 4.1)
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

## 6. Yang Sengaja Belum Dikerjakan (di luar scope permintaan ini)

- Form & validasi (login, register, entri logbook, review).
- Pemanggilan API / data fetching / state management.
- Komponen UI reusable (Button, Input, Modal, Table, dsb) — folder
  `src/components/ui/` sudah disiapkan tapi masih kosong.
- Logic upload lampiran, export PDF, dan captcha aritmatika.

Struktur di atas dirancang supaya semua pekerjaan tersebut tinggal "diisi"
ke slot yang sudah ada, tanpa perlu mengubah routing atau layout dasar.
