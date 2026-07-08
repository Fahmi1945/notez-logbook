// Mengambil base URL dari .env, dengan fallback ke localhost/IP jika .env belum siap
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://100.125.27.63:3333";

// Mengelompokkan semua endpoint agar rapi dan terpusat
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
  },
  // Nanti kamu bisa tambahkan endpoint lain di sini
  // LOGBOOK: `${API_BASE_URL}/api/logbook`,
  // USERS: `${API_BASE_URL}/api/users`,
};