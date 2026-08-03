import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface TokenPayload {
  role?: "user" | "mentor";
  [key: string]: unknown;
}

function decodeJwtPayload(token: string): TokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload as TokenPayload;
  } catch {
    return null;
  }
}

async function getVerifiedPayload(): Promise<TokenPayload | null> {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  return decodeJwtPayload(token);
}

/**
 * Panggil di awal Server Component layout yang terproteksi.
 * Sesi tidak valid -> redirect ke /login.
 * requiredRole diisi tapi tidak cocok -> redirect ke /dashboard.
 */
export async function requireAuth(requiredRole?: "user" | "mentor") {
  const payload = await getVerifiedPayload();

  if (!payload) {
    redirect("/login");
  }

  if (requiredRole && payload.role !== requiredRole) {
    redirect("/dashboard");
  }

  return payload;
}