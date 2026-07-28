# PROGRESS.md — Status Pengerjaan Fitur NOTEZ Frontend

> File ini adalah catatan hidup (living document) yang merekam apa yang sudah
> selesai, apa yang sedang dikerjakan, dan apa yang masih harus dibuat.
> **Update file ini setiap kali sebuah fitur selesai dikerjakan.**

---

## Status Legend

| Simbol | Arti |
|---|---|
| ✅ | Selesai & sudah bisa dipakai |
| 🔨 | Sedang dikerjakan |
| 🚧 | Stub/struktur ada, belum implementasi |
| ❌ | Belum dibuat sama sekali |
| 🐛 | Ada bug yang diketahui |

---

## Modul: Autentikasi

| Fitur | Status | File Utama | Catatan |
|---|---|---|---|
| Halaman Login | ✅ | `app/(auth)/login/page.tsx` | Captcha aritmatika aktif |
| Halaman Register | ✅ | `app/(auth)/register/page.tsx` | Role selection (user/mentor) |
| Form validation (Zod) | ✅ | `lib/validators/auth.schema.ts` | Login & Register schema |
| JWT verify di Edge | ✅ | `src/proxy.ts` | via `jose`, verif cookie `token` |
| JWT verify Server Component | ✅ | `lib/auth-guard.ts` | `requireAuth(role)` |
| Token storage | ✅ | `hooks/use-auth.ts` | Cookie + localStorage (Zustand) |
| Logout | ✅ | `store/auth-store.ts` | Clear user state + cookie |
| Redirect by role post-login | ✅ | `hooks/use-auth.ts` | user→/dashboard, mentor→/mentor/dashboard |

---

## Modul: Dashboard

| Fitur | Status | File Utama | Catatan |
|---|---|---|---|
| Dashboard mahasiswa | ✅ | `app/(user)/dashboard/page.tsx` | |
| Dashboard mentor | ✅ | `app/mentor/dashboard/page.tsx` | |
| StatCard komponen | ✅ | `components/dashboard/stat-card.tsx` | |
| ActivityChart komponen | ✅ | `components/dashboard/activity-chart.tsx` | |

---

## Modul: Logbook (Mahasiswa)

| Fitur | Status | File Utama | Catatan |
|---|---|---|---|
| List semua entri | ✅ | `app/(user)/logbook/page.tsx` | |
| Filter entri (komponen) | ✅ | `components/logbook/entry-filter.tsx` | |
| Filter terhubung ke URL params | 🚧 | `app/(user)/logbook/page.tsx` | Filter UI ada, query belum |
| Buat entri baru | ✅ | `app/(user)/logbook/new/page.tsx` | Form + Zod validation |
| Detail entri | ✅ | `app/(user)/logbook/[id]/page.tsx` | |
| Edit entri | ✅ | `app/(user)/logbook/[id]/edit/page.tsx` | |
| Hapus entri | ✅ | `hooks/use-entries.ts` | `deleteEntry()` + confirm dialog |
| Submit entri ke mentor | ✅ | `lib/api/entries.ts` | via internal proxy route PATCH |
| Upload lampiran (attachment) | ✅ | `components/logbook/attachment-upload.tsx` | multipart/form-data |
| Viewer lampiran (PDF/gambar) | ✅ | `components/review/pdf-viewer.tsx` | via blob URL |

---

## Modul: Mentorship (Mahasiswa)

| Fitur | Status | File Utama | Catatan |
|---|---|---|---|
| Katalog mentor | ✅ | `components/mentorship/mentor-list.tsx` | GET /mentorship |
| Request bimbingan | ✅ | `hooks/use-mentorship.ts` | `applyForMentorship()` |
| Riwayat request | ✅ | `components/mentorship/request-list.tsx` | GET /mentorship/history |
| Status request (badge) | ✅ | `components/ui/badge.tsx` | pending/accepted/rejected |

---

## Modul: Review (Mentor)

| Fitur | Status | File Utama | Catatan |
|---|---|---|---|
| Antrean entri submitted | ✅ | `app/mentor/review/page.tsx` | GET /mentor/logbook |
| Detail entri untuk review | ✅ | `app/mentor/review/[id]/page.tsx` | |
| Form Approve logbook | ✅ | `components/review/review-form.tsx` | comment opsional |
| Form Reject logbook | ✅ | `components/review/review-form.tsx` | comment WAJIB |
| Evaluasi via API | ✅ | `lib/api/mentor-review.ts` | PATCH /mentor/logbook/:id/evaluate |

---

## Modul: Mentorship (Mentor)

| Fitur | Status | File Utama | Catatan |
|---|---|---|---|
| Daftar mahasiswa aktif | ✅ | `app/mentor/students/page.tsx` | GET /mentor/tim |
| Modal detail mahasiswa | ✅ | `components/mentorship/student-detail-modal.tsx` | statistik entri |
| Antrean request masuk | ✅ | `components/mentorship/mentor-request-list.tsx` | |
| Accept request | ✅ | `lib/api/mentorship.ts` | POST /mentorship/:id/accepted |
| Reject request | ✅ | `lib/api/mentorship.ts` | POST /mentorship/:id/rejected |

---

## Modul: Notifikasi

| Fitur | Status | File Utama | Catatan |
|---|---|---|---|
| Notification Bell UI | 🚧 | `components/layout/notification-bell.tsx` | Komponen ada, belum connect API |
| API layer | 🚧 | `lib/api/notifications.ts` | File kosong/stub |
| Store | 🚧 | `store/notification-store.ts` | File kosong/stub |
| Hook | 🚧 | `hooks/use-notifications.ts` | File kosong/stub |
| Tipe data | 🚧 | `types/notification.ts` | File kosong/stub |
| Realtime (polling/websocket) | ❌ | — | Belum dirancang |

---

## Modul: Profil

| Fitur | Status | File Utama | Catatan |
|---|---|---|---|
| Halaman profil mahasiswa | 🚧 | `app/(user)/profile/page.tsx` | Halaman ada, form belum |
| Halaman profil mentor | 🚧 | `app/mentor/profile/page.tsx` | Halaman ada, form belum |
| API edit profil | ❌ | — | Belum tahu endpoint backend |

---

## Modul: Laporan & Ekspor

| Fitur | Status | File Utama | Catatan |
|---|---|---|---|
| Export PDF logbook | 🚧 | `lib/api/reports.ts` | File stub, endpoint belum dikonfirmasi |
| UI tombol export | ❌ | — | Belum ada UI |

---

## Infrastruktur & Shared

| Fitur | Status | File Utama | Catatan |
|---|---|---|---|
| Axios client + interceptor | ✅ | `lib/api/client.ts` | Auto Bearer token dari cookie |
| API_ENDPOINTS constants | ✅ | `lib/constants.ts` | Semua URL terpusat |
| Toast system | ✅ | `store/ui-store.ts` + `components/ui/toast.tsx` | Auto-dismiss 3 detik |
| Auth store (Zustand persist) | ✅ | `store/auth-store.ts` | Persist ke localStorage |
| cn() utility | ✅ | `lib/utils.ts` | clsx + tailwind-merge |
| MESSAGES konstanta | ✅ | `config/messages.ts` | Error & sukses messages |
| 404 page | ✅ | `app/not-found.tsx` | Custom halaman tidak ditemukan |
| Docker setup | ✅ | `Dockerfile`, `docker-compose.yml` | Standalone output |
| Unit testing setup | ✅ | `jest.config.ts`, `jest.setup.ts` | Jest + Testing Library |
| Unit tests (Logbook) | ✅ | `components/logbook/__tests__/` | entry-filter, entry-form, entry-list |
| Unit tests (Mentorship) | ✅ | `components/mentorship/__tests__/` | mentor-list, request-action, request-list |

---

## Bug yang Diketahui

| Bug | Lokasi | Prioritas | Catatan |
|---|---|---|---|
| Filter logbook belum terhubung ke URL | `entry-filter.tsx` | Medium | Filter state hanya lokal |

---

## Rencana Pengembangan Selanjutnya

Prioritas berdasarkan kebutuhan pengguna:

1. **[HIGH]** Implementasi fitur notifikasi (bell + list + mark as read)
2. **[HIGH]** Selesaikan halaman Edit Profil (mahasiswa & mentor)
3. **[MEDIUM]** Hubungkan filter logbook ke URL query params
4. **[MEDIUM]** Implementasi Export PDF
5. **[LOW]** Tambah halaman `/mentor/mentorship` untuk manage request secara terpisah
