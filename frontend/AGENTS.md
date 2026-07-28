<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# AGENTS.md — Panduan Wajib untuk Semua AI Coding Agents

> Dokumen ini adalah **kontrak kerja** antara developer dan AI assistant.
> Setiap agent (GitHub Copilot, Cursor, Claude, Gemini, dll.) **wajib membaca
> dan mengikuti semua aturan di bawah ini** sebelum menulis satu baris kode pun.
> Pelanggaran terhadap aturan ini akan menghasilkan kode yang inkonsisten
> dan sulit di-maintain.

---

## 0. Langkah Pertama: Baca Dulu

Sebelum mengerjakan task apa pun, baca file berikut secara berurutan:

1. **File ini (`AGENTS.md`)** — aturan dan constraints
2. **`ARSITEKTUR.md`** — detail teknis, routing, design system, API map
3. **`README.md`** — gambaran fitur, tech stack, env setup

Tanpa membaca ketiga file ini, AI tidak boleh menulis atau memodifikasi kode.

---

## 1. Teknologi & Versi Aktual

> ⚠️ **WAJIB DIPATUHI.** Jangan menambahkan library baru tanpa konfirmasi eksplisit dari developer.

| Yang Dipakai | Yang TIDAK Boleh Ditambahkan |
|---|---|
| Next.js 16.2 (App Router) | Pages Router, Gatsby, Remix |
| React 19 | Class components, legacy patterns |
| Tailwind CSS v4 (sintaks `@theme`) | UI library (shadcn, MUI, Ant Design, Chakra) |
| Zustand v5 | Redux, MobX, Context API (untuk state global) |
| React Hook Form v7 + Zod v4 | Formik, Yup |
| Axios v1 (lewat `apiClient`) | `fetch()` langsung (kecuali internal API route) |
| `jose` (untuk JWT verify) | `jsonwebtoken` (tidak kompatibel Edge Runtime) |
| Phosphor Icons + Lucide React | React Icons, FontAwesome |
| Framer Motion v12 | CSS keyframes manual untuk animasi kompleks |
| `date-fns` v4 | `moment.js`, `dayjs` |
| `clsx` + `tailwind-merge` via `cn()` | Concatenasi string class manual |

---

## 2. Aturan Next.js App Router

### Server Components vs Client Components

```
ATURAN EMAS:
- Semua file di src/app/** → Server Component secara default
- Gunakan "use client" HANYA di komponen yang butuh:
  • useState / useReducer / useRef
  • useEffect / useCallback / useMemo
  • Browser API (localStorage, document, window)
  • Event handler (onClick, onChange, onSubmit)
  • Hooks dari library pihak ketiga
```

**Pola yang benar:**

```tsx
// app/(user)/logbook/[id]/page.tsx → Server Component
export default async function Page({ params }) {
  const { id } = await params; // Di Next.js 16, params adalah Promise
  return <LogbookDetailClient id={id} />;  // Delegate ke Client
}

// components/logbook/logbook-detail-client.tsx → Client Component
"use client";
export function LogbookDetailClient({ id }: { id: string }) {
  const [entry, setEntry] = useState(null);
  // ... logika client
}
```

**Pola yang salah:**

```tsx
// ❌ JANGAN ini — page jadi client component padahal tidak perlu
"use client";
export default function Page({ params }) { ... }
```

### Params di Next.js 16

Di Next.js 16, `params` adalah `Promise` — harus di-await:

```tsx
// ✅ Benar
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
}

// ❌ Salah (Next.js 15 ke bawah)
export default function Page({ params }: { params: { id: string } }) {
  const { id } = params; // deprecated warning di Next.js 16
}
```

---

## 3. Aturan Struktur File

### Naming Convention

| Tipe File | Konvensi | Contoh |
|---|---|---|
| Komponen React | `kebab-case.tsx` | `entry-form.tsx`, `mentor-list.tsx` |
| Hooks | `use-kebab-case.ts` | `use-entries.ts`, `use-auth.ts` |
| API layer | `domain.ts` | `entries.ts`, `auth.ts` |
| Type file | `noun.ts` | `entry.ts`, `user.ts` |
| Store | `noun-store.ts` | `auth-store.ts`, `ui-store.ts` |
| Schema | `noun.schema.ts` | `entry.schema.ts` |
| Test | `nama-file.test.tsx` | `entry-form.test.tsx` |

### Di Mana Menaruh Kode Baru

| Kode | Taruh di |
|---|---|
| Halaman baru untuk mahasiswa | `src/app/(user)/nama-fitur/page.tsx` |
| Halaman baru untuk mentor | `src/app/mentor/nama-fitur/page.tsx` |
| Komponen reusable generik | `src/components/ui/nama-komponen.tsx` |
| Komponen spesifik fitur | `src/components/domain/nama-komponen.tsx` |
| Logika bisnis client | `src/hooks/use-nama-fitur.ts` |
| Fungsi API call | `src/lib/api/domain.ts` |
| Tipe data baru | `src/types/domain.ts` |
| Konstanta pesan | `src/config/messages.ts` |
| URL endpoint baru | `src/lib/constants.ts` di objek `API_ENDPOINTS` |

---

## 4. Aturan Data Fetching & State

### Fetching Data (Client-side)

```tsx
// ✅ Pola benar: komponen → hook → api layer → apiClient
"use client";
function MyComponent() {
  const { entries, isLoading, fetchEntries } = useEntries();
  useEffect(() => { fetchEntries(); }, [fetchEntries]);
  // ...
}

// ❌ Pola salah: komponen langsung call Axios
function MyComponent() {
  const data = await axios.get("/logbook"); // ❌
}
```

### State Loading & Error

Setiap aksi async **wajib** memiliki:
1. State `isLoading` → tampilkan `<Spinner />` atau `<Skeleton />`
2. State `error` → tampilkan pesan error yang manusiawi
3. Feedback sukses → `showToast("Berhasil!", "success")`
4. Feedback gagal → `showToast("Gagal: " + message, "error")`

```tsx
// ✅ Pola benar di hook
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const doSomething = async () => {
  try {
    setIsLoading(true);
    setError(null);
    await someApi.action();
    showToast("Berhasil!", "success");
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } } };
    const msg = e.response?.data?.message || "Terjadi kesalahan.";
    setError(msg);
    showToast(msg, "error");
  } finally {
    setIsLoading(false);
  }
};
```

### Global State

- **Informasi user yang login** → `useAuthStore` (Zustand, persist)
- **Toast/notifikasi UI** → `useUIStore` (Zustand, no persist)
- **Data per-halaman** (list entri, mentor, dll.) → `useState` lokal di hook
- **JANGAN** buat Zustand store baru untuk data yang hanya dipakai di satu halaman

---

## 5. Aturan Validasi

### Semua form wajib pakai Zod + React Hook Form

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { entrySchema, EntryFormInput } from "@/lib/validators/entry.schema";

const form = useForm<EntryFormInput>({
  resolver: zodResolver(entrySchema),
  defaultValues: { title: "", description: "", ... }
});
```

### Tambah skema baru di `src/lib/validators/`

Jangan definisikan `z.object()` inline di komponen. Selalu buat file schema sendiri.

---

## 6. Aturan Styling

### Token CSS — Wajib Dipakai

```tsx
// ✅ Pakai token brand dari globals.css
<header className="bg-brand-dark text-brand-white">

// ✅ Pakai utility badge status
<span className={`badge-${entry.status}`}>

// ✅ Pakai cn() untuk conditional class
className={cn("rounded-lg p-4", isActive && "bg-brand-primary/10")}

// ❌ Jangan pakai warna hex atau rgb inline
style={{ backgroundColor: "#264A87" }}  // ❌

// ❌ Jangan override font secara manual
<p style={{ fontFamily: "Montserrat" }}>  // ❌ Pakai font-heading class
```

### Prinsip Desain

- **Desain harus terlihat profesional dan institusional** — bukan landing page startup
- Warna dasar: `bg-brand-white-bg` untuk halaman, `bg-brand-white` untuk card
- Aksi utama: `bg-brand-primary` (biru), aksen: `bg-brand-accent` (oranye)
- Selalu responsif — gunakan breakpoints Tailwind (`sm:`, `md:`, `lg:`)
- Hover state dan transition wajib ada pada elemen interaktif
- Jangan buat animasi berlebihan — gunakan yang sudah ada di globals.css

### Komponen UI yang Harus Dipakai Terlebih Dahulu

Cek folder `src/components/ui/` sebelum membuat komponen baru:

```
Button, Input, Textarea, Select, Dropdown
Card, Modal, ConfirmDialog
Badge, Spinner, Skeleton, Toast
WarningIcon
```

---

## 7. Aturan Auth & Keamanan

- **Jangan pernah buat mekanisme auth baru** — gunakan yang sudah ada
- Token disimpan di: `cookie "token"` (untuk middleware) + `localStorage` (via Zustand persist)
- Untuk verifikasi server-side: gunakan `requireAuth()` dari `src/lib/auth-guard.ts`
- Untuk redirect setelah login: sesuaikan role — `user` → `/dashboard`, `mentor` → `/mentor/dashboard`
- **Jangan simpan data sensitif** (password, token raw) di state React

---

## 8. Aturan TypeScript

```tsx
// ✅ Selalu definisikan tipe return di fungsi API
async function getEntry(id: number): Promise<ApiResponse<LogbookEntry>> { ... }

// ✅ Gunakan tipe yang sudah ada di src/types/
import type { LogbookEntry, LogbookStatus } from "@/types/entry";
import type { ApiResponse } from "@/types/api";

// ✅ Cast error dengan benar (bukan any)
} catch (err: unknown) {
  const e = err as { response?: { data?: { message?: string } } };
}

// ❌ Jangan gunakan 'any'
const data: any = response.data; // ❌

// ❌ Jangan buat interface duplikat
interface MyEntry { id: number; title: string; } // ❌ Sudah ada LogbookEntry
```

---

## 9. Checklist Sebelum Commit

Sebelum menyelesaikan task, pastikan:

- [ ] Tidak ada error TypeScript (`tsc --noEmit` bersih)
- [ ] Tidak ada `console.log` debug yang tertinggal
- [ ] Semua form punya validasi Zod
- [ ] Semua aksi async punya loading state dan error handling
- [ ] Tidak ada URL endpoint hard-coded (semua pakai `API_ENDPOINTS`)
- [ ] Tidak ada tipe `any` yang digunakan
- [ ] Komponen baru sudah responsif (minimal cek di lebar 768px dan 1280px)
- [ ] Sudah menggunakan komponen UI dari `src/components/ui/` jika tersedia
- [ ] Token warna dan font menggunakan variabel dari `globals.css`

---

## 10. Fitur yang Sedang Dalam Pengembangan

Berikut fitur yang **belum selesai** — jangan berasumsi sudah berfungsi:

| Fitur | Status | Catatan |
|---|---|---|
| Notifikasi real-time | 🚧 Stub | File ada, implementasi belum |
| Export PDF | 🚧 Stub | Endpoint ada, UI belum |
| Edit Profil | 🚧 Halaman ada | Form belum functional |
| Filter logbook by URL params | 🚧 Komponen ada | Belum terhubung ke URL |

Ketika mengerjakan fitur-fitur ini, **tanya developer dulu** untuk konfirmasi
desain dan endpoint backend sebelum mulai implementasi.
