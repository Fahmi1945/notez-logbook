import { User } from "./user"; // Panggil tipe User dari file sebelahnya

// Definisi struktur respons dari Endpoint Auth
export interface AuthResponse {
  token?: string;
  user?: User;
  message?: string;
}

// Definisi struktur Error standar dari API
export interface ApiError {
  message: string;
  [key: string]: unknown;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}