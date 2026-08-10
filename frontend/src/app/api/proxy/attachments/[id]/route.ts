import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL, API_ENDPOINTS } from "@/lib/constants";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  // Ambil ID dari URL (karena API Route berada di /api/proxy/attachments/[id])
  const id = request.nextUrl.pathname.split("/").pop();
  
  if (!id) {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "UNAUTHORIZED", message: "Token tidak ditemukan" }, { status: 401 });
  }

  try {
    const targetUrl = `${API_BASE_URL}${API_ENDPOINTS.LOGBOOK.ATTACHMENT(id)}`;
    const response = await fetch(targetUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch attachment" },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.success && data.url) {
      try {
        const redirectTarget = new URL(data.url);
        if (redirectTarget.protocol !== "http:" && redirectTarget.protocol !== "https:") {
          return NextResponse.json(
            { error: "Invalid redirect protocol" },
            { status: 400 }
          );
        }
      } catch {
        return NextResponse.json(
          { error: "Invalid redirect URL" },
          { status: 400 }
        );
      }
      return NextResponse.redirect(data.url);
    } else {
      return NextResponse.json(
        { error: "Invalid response from backend" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Proxy attachment error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
