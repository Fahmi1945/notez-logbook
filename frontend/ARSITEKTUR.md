# Arsitektur Frontend NOTEZ

> **Ini adalah dokumen teknis utama (Source of Truth) proyek ini.**
> Setiap keputusan tentang routing, struktur folder, design system, dan
> pola API harus mengacu ke dokumen ini. Jika kode di file lain bertentangan
> dengan dokumen ini, **dokumen inilah yang benar**.

---

## Daftar Isi

1. [Pilihan Teknis & Alasan](#1-pilihan-teknis--alasan)
2. [Auth System — Dua Lapis Guard](#2-auth-system--dua-lapis-guard)
3. [Tabel Routing Lengkap](#3-tabel-routing-lengkap)
4. [Layer Arsitektur](#4-layer-arsitektur)
5. [Design System & Token CSS](#5-design-system--token-css)
6. [API Layer & Endpoint Map](#6-api-layer--endpoint-map)
7. [State Management](#7-state-management)
8. [Data Types (TypeScript)](#8-data-types-typescript)
9. [Validasi (Zod Schemas)](#9-validasi-zod-schemas)
10. [Testing](#10-testing)
11. [Pola Komponen — Do & Don't](#11-pola-komponen--do--dont)
12. [Fitur yang Belum Selesai](#12-fitur-yang-belum-selesai)

---

## 1. Pilihan Teknis & Alasan

| Aspek | Keputusan | Alasan |
|---|---|---|
| Framework | **Next.js 16.2** (App Router) | Server Components untuk cek sesi server-side; nested layouts untuk pisahkan shell `user` vs `mentor` |
| Runtime | **React 19** | Versi aktif, kompatibel dengan Next.js 16 |
| Styling | **Tailwind CSS v4** (dengan `@theme`) | Konfigurasi lewat CSS langsung (bukan `tailwind.config.js`); design token sebagai CSS custom property |
| State | **Zustand v5** | Ringan, tidak butuh Provider, persist ke localStorage otomatis |
| Form | **React Hook Form v7 + Zod v4** | Performa unsubscribed re-render; validasi type-safe end-to-end |
| HTTP | **Axios v1** | Interceptor untuk auto-attach Bearer token dari cookie |
| Auth Guard (Edge) | **`src/proxy.ts` via `jose`** | `jose` kompatibel dengan Edge Runtime Next.js; verifikasi JWT tanpa `jsonwebtoken` |
| Auth Guard (Server) | **`src/lib/auth-guard.ts`** | Defense-in-depth — Server Component cek ulang sesi sebelum render layout |
| Icons | **Phosphor Icons + Lucide React** | Phosphor sebagai ikon utama; Lucide sebagai fallback/tambahan |
| Animasi | **Framer Motion v12** | Animasi halaman & komponen yang smooth |
| Tanggal | **date-fns v4** | Ringan, tree-shakeable, format tanggal Indonesia |
| Testing | **Jest v30 + Testing Library v16** | Unit test komponen dan hook |
| Build | **Output standalone** | Memudahkan deploy Docker tanpa perlu `node_modules` lengkap |

---

## 2. Auth System — Dua Lapis Guard

Otorisasi frontend berjalan dalam **dua lapis** untuk keamanan berlapis (defense-in-depth):

### Lapis 1 — Edge Middleware (`src/proxy.ts`)

Berjalan di **Edge Runtime** sebelum halaman apa pun dirender.

```
Request masuk ke rute terproteksi
  ↓
Baca cookie "token"
  ↓
jwtVerify(token, JWT_SECRET) via jose
  ↓
Token tidak ada / invalid → redirect /login + hapus cookie
Token valid, buka /login atau /register → redirect /dashboard
Token valid, role tidak cocok dengan prefix rute → redirect /dashboard
Token valid, rute cocok → NextResponse.next() → lanjut ke render
```

**Rute yang diproteksi middleware:**

```ts
// src/proxy.ts — config.matcher
['/login', '/register', '/dashboard/:path*', '/logbook/:path*', '/mentor/:path*', '/profile/:path*']
```

**Logika RBAC di middleware:**

| Kondisi | Aksi |
|---|---|
| Route `/mentor/*`, role bukan `mentor` | Redirect `/dashboard` |
| Route `/logbook/*`, role bukan `user` | Redirect `/dashboard` |
| Route terproteksi lain, sesi valid, role cocok | Lanjut |

### Lapis 2 — Server Component (`src/lib/auth-guard.ts`)

Dipanggil di layout Server Component setiap route group.

```ts
// Cara pakai di layout.tsx:
await requireAuth("user");   // untuk (user)/layout.tsx
await requireAuth("mentor"); // untuk mentor/layout.tsx
```

Fungsi ini membaca cookie server-side dengan `next/headers`, memverifikasi JWT dengan `jose`, lalu:
- Sesi tidak ada → `redirect("/login")`
- Role tidak cocok → `redirect("/dashboard")`

> ⚠️ **Penting:** Dua lapis guard ini hanya untuk **UX routing di frontend**.
> Validasi otorisasi yang sesungguhnya (misalnya mentor hanya boleh akses
> entri mahasiswa bimbingannya sendiri) **wajib** ditegakkan di backend.

### Alur Login & Token Storage

```
useAuth.login()
  → authApi.login(data)                  # POST /auth/login
  → Response: { token, user, message }
  → localStorage.setItem("token", token) # Akses cepat dari JS
  → document.cookie = "token=..."        # Dipakai middleware & auth-guard
  → useAuthStore.setUser(user)           # Persist ke localStorage via Zustand
  → redirect ke /dashboard atau /mentor/dashboard berdasarkan role
```

**Cookie token:**

```
token=<JWT>; path=/; max-age=86400; SameSite=Strict
```

> Cookie tidak di-set sebagai `HttpOnly` dari sisi frontend karena `js-cookie` butuh
> akses JavaScript untuk membacanya di Axios interceptor. Keamanan dijaga lewat
> `SameSite=Strict` dan `max-age` yang terbatas.

---

## 3. Tabel Routing Lengkap

Route group `(auth)` dan `(user)` **tidak muncul di URL** — hanya untuk mengelompokkan layout.

| URL Path | Role | Layout | Komponen Utama | Endpoint API |
|---|---|---|---|---|
| `/login` | Publik | `(auth)/layout.tsx` | `LoginForm` | `POST /auth/login` |
| `/register` | Publik | `(auth)/layout.tsx` | `RegisterForm` | `POST /auth/register` |
| `/dashboard` | `user` | `(user)/layout.tsx` → AppShell | `StatCard`, `ActivityChart` | `GET /logbook` (agregasi) |
| `/logbook` | `user` | `(user)/layout.tsx` → AppShell | `EntryList`, `EntryFilter` | `GET /logbook` |
| `/logbook/new` | `user` | `(user)/layout.tsx` → AppShell | `EntryForm` | `POST /logbook` |
| `/logbook/:id` | `user` | `(user)/layout.tsx` → AppShell | Detail, `AttachmentUpload` | `GET /logbook/:id` |
| `/logbook/:id/edit` | `user` | `(user)/layout.tsx` → AppShell | `EntryForm` (mode edit) | `PUT /logbook/:id` |
| `/mentorship` | `user` | `(user)/layout.tsx` → AppShell | `MentorList`, `RequestList` | `GET /mentorship`, `POST /mentorship/request/:id` |
| `/profile` | `user` | `(user)/layout.tsx` → AppShell | Form profil | `GET/PUT /profile` |
| `/mentor/dashboard` | `mentor` | `mentor/layout.tsx` → AppShell | `StatCard`, `ActivityChart` | `GET /mentor/logbook` |
| `/mentor/review` | `mentor` | `mentor/layout.tsx` → AppShell | `MentorRequestList` | `GET /mentor/logbook` |
| `/mentor/review/:id` | `mentor` | `mentor/layout.tsx` → AppShell | `ReviewForm`, `PdfViewer` | `GET /mentor/logbook/:id`, `PATCH /mentor/logbook/:id/evaluate` |
| `/mentor/students` | `mentor` | `mentor/layout.tsx` → AppShell | `ActiveStudentList`, `StudentDetailModal` | `GET /mentor/tim` |
| `/mentor/profile` | `mentor` | `mentor/layout.tsx` → AppShell | Form profil | `GET/PUT /profile` |

**Konstanta rute** ada di: `src/lib/constants.ts` → `API_ENDPOINTS`. Selalu rujuk ke sana,
jangan hard-code string URL di komponen.

---

## 4. Layer Arsitektur

Kode diorganisir dalam layer yang jelas. Data mengalir **satu arah ke bawah**:

```
┌─────────────────────────────────────────────────────────┐
│  PAGE / LAYOUT (src/app/**)                             │
│  Server Component — ambil data server-side, render UI   │
└────────────────────────┬────────────────────────────────┘
                         │ props / children
┌────────────────────────▼────────────────────────────────┐
│  COMPONENTS (src/components/**)                         │
│  "use client" — interaktivitas, form, animasi           │
│  Pakai custom HOOK untuk logika bisnis                  │
└────────────────────────┬────────────────────────────────┘
                         │ panggil
┌────────────────────────▼────────────────────────────────┐
│  HOOKS (src/hooks/use-*.ts)                             │
│  useState, useEffect, useCallback                       │
│  Mengatur loading state, error state, data state        │
└────────────────────────┬────────────────────────────────┘
                         │ panggil
┌────────────────────────▼────────────────────────────────┐
│  API LAYER (src/lib/api/*.ts)                           │
│  Fungsi-fungsi Axios per domain                         │
│  Semua melewati apiClient (interceptor auto-token)      │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP
┌────────────────────────▼────────────────────────────────┐
│  BACKEND API (eksternal)                                │
│  Base URL: NEXT_PUBLIC_API_URL                          │
└─────────────────────────────────────────────────────────┘

State global (lintas komponen):
┌─────────────────────────────────────────────────────────┐
│  STORE (src/store/*.ts) — Zustand                       │
│  useAuthStore: user, isAuthenticated                    │
│  useUIStore: showToast(), toastMessage                  │
└─────────────────────────────────────────────────────────┘
```

### Aturan Layer (Jangan Dilanggar)

- **Page/Layout TIDAK boleh** memanggil Axios/API langsung di sisi klien
- **Components TIDAK boleh** mengimpor dari `lib/api` langsung — harus lewat hook
- **Hooks TIDAK boleh** mengimpor dari `store` selain `useUIStore` untuk toast
- **API layer** hanya berisi fungsi Axios murni, tanpa state management

---

## 5. Design System & Token CSS

Semua token visual didefinisikan di **`src/app/globals.css`** menggunakan sintaks `@theme` Tailwind v4.

### Palet Warna Brand

```css
--color-brand-dark:     #264A87  /* Biru Tua — header, aktif sidebar */
--color-brand-primary:  #2E5AA7  /* Biru Tengah — tombol utama, link */
--color-brand-accent:   #FFA62B  /* Oranye — highlight, badge penting */
--color-brand-soft:     #F8E6A0  /* Kuning Pudar — background notification */
--color-brand-white:    #F7FCFE  /* Putih — card background */
--color-brand-white-bg: #F9F8F5  /* Off-white — background halaman */
```

### Warna Status Logbook

Dipetakan langsung ke nilai enum `LogbookStatus` di TypeScript:

```css
--color-status-draft:     #94A3B8  /* Abu — entri belum disubmit */
--color-status-submitted: #8B5CF6  /* Ungu — menunggu review mentor */
--color-status-approved:  #10B981  /* Hijau — disetujui */
--color-status-rejected:  #F43F5E  /* Merah — ditolak, perlu revisi */
```

### Utility Class Status Badge

Sudah ada utility class siap pakai di `@layer utilities`:

```css
.badge-draft      /* bg-slate-50 text-slate-600 border-slate-200 */
.badge-submitted  /* bg-violet-50 text-violet-700 border-violet-200 */
.badge-approved   /* bg-emerald-50 text-emerald-700 border-emerald-200 */
.badge-rejected   /* bg-rose-50 text-rose-700 border-rose-200 */
```

Cara pakai di komponen (lihat `src/components/ui/badge.tsx`):

```tsx
<span className={`badge-${entry.status}`}>{entry.status}</span>
```

### Tipografi

```css
--font-heading: 'Montserrat'  /* h1–h6, judul section */
--font-body:    'Poppins'     /* Teks paragraf, label, konten */
--font-mono:    'Inter'       /* Tanggal, ID, label status — nuansa data */
```

### Custom Animations

```css
.animate-fade-in-down  /* Masuk dari atas — dropdown, notifikasi */
.animate-fade-in-up    /* Masuk dari bawah — modal, toast */
.animate-scale-in      /* Scale dari 0.95 ke 1 — dialog, card */
```

### Line Clamp Utilities

```css
.line-clamp-1  /* Potong teks di baris 1 dengan ellipsis */
.line-clamp-2  /* Potong teks di baris 2 dengan ellipsis */
```

### Cara Menggunakan Token di Komponen

Di Tailwind v4, token `@theme` otomatis tersedia sebagai class Tailwind:

```tsx
// Warna brand
<div className="bg-brand-dark text-brand-white">...</div>

// Warna status (pakai sebagai text/border/bg)
<span className="text-status-approved">Approved</span>

// Atau pakai utility class badge langsung
<span className={`badge-${status}`}>{status}</span>
```

---

## 6. API Layer & Endpoint Map

### Axios Client (`src/lib/api/client.ts`)

```ts
// Base URL dari env
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api";

// Interceptor otomatis attach token dari cookie "token"
apiClient.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

> ⚠️ Interceptor hanya berjalan di browser (ada pengecekan `typeof window !== "undefined"`).
> Server-side fetch (jika ada) harus attach token secara manual.

### API_ENDPOINTS (`src/lib/constants.ts`)

Ini adalah **single source of truth** untuk semua URL endpoint. **Jangan hard-code URL di komponen.**

```ts
API_ENDPOINTS.AUTH.LOGIN                    // "/auth/login"
API_ENDPOINTS.AUTH.REGISTER                 // "/auth/register"

API_ENDPOINTS.LOGBOOK.BASE                  // "/logbook"
API_ENDPOINTS.LOGBOOK.BY_ID(id)             // "/logbook/:id"
API_ENDPOINTS.LOGBOOK.ATTACHMENT(id)        // "/logbook/attachments/:id"
API_ENDPOINTS.LOGBOOK.SUBMIT(id)            // "/logbook/submit/:id"

API_ENDPOINTS.MENTORSHIP.BASE               // "/mentorship"
API_ENDPOINTS.MENTORSHIP.HISTORY            // "/mentorship/history"
API_ENDPOINTS.MENTORSHIP.REQUEST(mentorId)  // "/mentorship/request/:mentorId"
API_ENDPOINTS.MENTORSHIP.ACCEPT(reqId)      // "/mentorship/:reqId/accepted"
API_ENDPOINTS.MENTORSHIP.REJECT(reqId)      // "/mentorship/:reqId/rejected"
API_ENDPOINTS.MENTORSHIP.GET_ACTIVE_STUDENTS // "/mentor/tim"

API_ENDPOINTS.MENTOR_REVIEW.QUEUE           // "/mentor/logbook"
API_ENDPOINTS.MENTOR_REVIEW.BY_ID(id)       // "/mentor/logbook/:id"
API_ENDPOINTS.MENTOR_REVIEW.EVALUATE(id)    // "/mentor/logbook/:id/evaluate"
```

### Catatan Khusus: Submit Logbook

Endpoint `PATCH /logbook/submit/:id` dilakukan via **internal API Route Next.js**
(`/api/proxy/logbook/submit/:id`) menggunakan `fetch()` — bukan Axios — karena
endpoint ini perlu melewati cookie server-side.

```ts
// Di entriesApi.submit():
const response = await fetch(`/api/proxy/logbook/submit/${id}`, { method: "PATCH" });
```

---

## 7. State Management

### `useAuthStore` (Zustand + persist)

```ts
// src/store/auth-store.ts
state: { user: User | null; isAuthenticated: boolean }
actions: { setUser(user), logout() }

// Persist key di localStorage: "user-data"
```

Dipanggil di: `use-auth.ts`, `sidebar.tsx`, `navbar.tsx`

### `useUIStore` (Zustand, no persist)

```ts
// src/store/ui-store.ts
state: { toastMessage: string | null; toastType: "success" | "error" | "info" }
actions: { showToast(message, type?), hideToast() }
// Auto-dismiss setelah 3000ms
```

Dipanggil di: Semua hook yang perlu feedback user, komponen `toast.tsx`

### `notificationStore` (Belum implementasi)

File ada di `src/store/notification-store.ts` tapi masih kosong. Akan diisi saat
fitur notifikasi real-time diimplementasi.

---

## 8. Data Types (TypeScript)

Semua tipe ada di `src/types/`. **Jangan mendefinisikan tipe inline di komponen.**

### `src/types/user.ts`

```ts
interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "mentor";
}
```

### `src/types/entry.ts`

```ts
type LogbookStatus = "draft" | "submitted" | "approved" | "rejected";

interface Attachment {
  id: number;
  file_name: string;
  file_path: string;
}

interface LogbookEntry {
  id: number;
  user_id: number;
  activity_date: string;   // ISO string: "YYYY-MM-DD"
  title: string;
  description: string;
  obstacles: string | null;
  status: LogbookStatus;
  attachments?: Attachment[];
  user?: { id: number; name: string; email: string };
}
```

### `src/types/mentorship.ts`

```ts
interface Mentor {
  id: number;
  name: string;
  email: string;
  studentCount: number;
}

interface MentorshipHistory {
  id: number;
  user_id: number;
  mentor_id: number;
  mentor_name?: string;
  status: "pending" | "accepted" | "rejected";
  information?: string | null;
  created_at: string;
}

interface ActiveStudent {
  requestId: string | number;
  studentId: string | number;
  studentName: string;
  studentEmail: string;
  status: string;
  information: string;
  updatedAt: string;
  totalEntries: number;
  waitingReview: number;
}
```

### `src/types/api.ts`

```ts
// Wrapper standar semua respons API backend
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface AuthResponse {
  token?: string;
  user?: User;
  message?: string;
}

interface ApiError {
  message: string;
  [key: string]: unknown;
}
```

---

## 9. Validasi (Zod Schemas)

### `auth.schema.ts`

- `loginSchema` — email (format valid) + password (min 6)
- `registerSchema` — name (min 3) + email + role (enum user/mentor) + password + confirmPassword
  - `.refine()` cek bahwa password === confirmPassword

### `entry.schema.ts`

- `entrySchema` — activity_date (ISO, tidak boleh kosong) + title (5–150 char) + description (10–2000 char) + obstacles (opsional, maks 500 char)

### `mentorship.schema.ts`

- `mentorshipRequestSchema` — mentorId (number, positive integer) + information (opsional, maks 255 char)

### `review.schema.ts` — Discriminated Union

```ts
// Skema berbeda tergantung status:
// status "approved" → comment opsional
// status "rejected" → comment WAJIB (min 1 karakter)
const reviewActionSchema = z.discriminatedUnion("status", [
  z.object({ status: z.literal("approved"), comment: z.string().max(500).optional() }),
  z.object({ status: z.literal("rejected"), comment: z.string().min(1).max(500) }),
]);
```

---

## 10. Testing

Proyek menggunakan **Jest v30** dengan **Testing Library v16** dan **ts-jest**.

```bash
npm run test              # Jalankan semua test
npm run test:watch        # Mode watch (saat development)
npm run test:coverage     # Dengan laporan coverage
```

**Lokasi test files:**

```
src/components/logbook/__tests__/     # entry-filter, entry-form, entry-list
src/components/mentorship/__tests__/  # mentor-list, request-action, request-list
src/hooks/__tests__/
src/lib/validators/__tests__/
```

**Konfigurasi:** `jest.config.ts` menggunakan `ts-jest`, environment `jsdom`,
dan `identity-obj-proxy` untuk CSS modules.

**Saat menambah komponen baru**, buatkan test file di folder `__tests__` yang
sesuai dengan minimal test: render tanpa crash + interaksi utama.

---

## 11. Pola Komponen — Do & Don't

### ✅ DO — Pola yang Benar

```tsx
// Server Component (default) — ambil param, render komponen client
// app/(user)/logbook/[id]/page.tsx
export default async function LogbookDetailPage({ params }) {
  const { id } = await params;
  return <LogbookDetailClient id={id} />;  // delegate ke client component
}

// Client Component — interaktivitas, hook, state
// components/logbook/entry-form.tsx
"use client";
export function EntryForm() {
  const { register, handleSubmit } = useForm({ resolver: zodResolver(entrySchema) });
  // ...
}

// Selalu gunakan komponen UI yang sudah ada
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Gunakan cn() untuk conditional className
import { cn } from "@/lib/utils";
<div className={cn("base-class", isActive && "active-class", className)} />

// Gunakan API_ENDPOINTS, bukan string literal
import { API_ENDPOINTS } from "@/lib/constants";
await apiClient.get(API_ENDPOINTS.LOGBOOK.BY_ID(id));

// Toast selalu via useUIStore
const { showToast } = useUIStore();
showToast("Berhasil disimpan!", "success");
showToast("Gagal menyimpan.", "error");
```

### ❌ DON'T — Pola yang Salah

```tsx
// JANGAN taruh "use client" di layout.tsx atau page.tsx utama
"use client"; // ❌ Hilangkan ini dari layout

// JANGAN fetch Axios langsung di komponen tanpa hook
const data = await axios.get("/logbook"); // ❌ Buat hook use-entries dulu

// JANGAN hardcode URL endpoint
await apiClient.get("/logbook/123"); // ❌ Gunakan API_ENDPOINTS.LOGBOOK.BY_ID(123)

// JANGAN gunakan type 'any'
const err = error as any; // ❌ Cast ke tipe yang tepat

// JANGAN buat UI primitive baru jika sudah ada
<button className="...">Submit</button> // ❌ Gunakan <Button> dari ui/button

// JANGAN simpan token di cara lain
sessionStorage.setItem("token", token); // ❌ Gunakan cookie seperti yang sudah ada
```

---

## 12. Fitur yang Belum Selesai

Berikut fitur yang strukturnya sudah ada di kode tapi belum diimplementasi penuh:

| Fitur | File terkait | Yang perlu dilakukan |
|---|---|---|
| **Notifikasi** | `src/lib/api/notifications.ts`, `src/store/notification-store.ts`, `src/hooks/use-notifications.ts`, `src/types/notification.ts` | Isi stub dengan implementasi nyata; hubungkan ke `notification-bell.tsx` |
| **Export PDF** | `src/lib/api/reports.ts` | Implementasi blob download dari endpoint backend |
| **Edit Profil** | `src/app/(user)/profile/page.tsx`, `src/app/mentor/profile/page.tsx` | Form edit nama, email, password; endpoint backend belum dikonfirmasi |
| **Mentorship untuk Mentor** | — | Belum ada halaman `/mentor/mentorship` untuk manage request masuk secara terpisah dari students |
| **Filter & Sort Logbook** | `src/components/logbook/entry-filter.tsx` | Komponen sudah ada, tapi filter belum terhubung ke query parameter URL |
