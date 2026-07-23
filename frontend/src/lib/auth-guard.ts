import "server-only";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";

const JWT_SECRET = process.env.JWT_SECRET;

interface TokenPayload {
  role?: "user" | "mentor";
  [key: string]: unknown;
}

async function getVerifiedPayload(): Promise<TokenPayload | null> {
  const token = (await cookies()).get("token")?.value;
  if (!token || !JWT_SECRET) return null;

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as TokenPayload;
  } catch {
    return null;
  }
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