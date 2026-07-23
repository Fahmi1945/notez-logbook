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

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const arrayBuffer = await response.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        // Optional: Cache file agar tidak fetch berulang kali
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Proxy attachment error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
