// Membatasi role hanya boleh dua string ini (mencegah typo)
export type Role = "user" | "mentor";

export interface User {
  id: string | number;
  name: string;
  email: string;
  role: Role;
}

// Interface standar untuk balasan saat sukses Login/Register
export interface AuthResponse {
  message: string;
  user: User;
  token?: string;
}