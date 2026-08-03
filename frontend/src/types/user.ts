export interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "mentor";
  created_at?: string;
}