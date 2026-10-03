import { NextResponse } from "next/server";

const MAX_ATTEMPTS = 3;
const RATE_LIMIT_MS = 60_000;
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

function getClientKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return request.headers.get("x-real-ip") ?? "local-client";
}

export async function POST(request: Request) {
  try {
    const clientKey = getClientKey(request);
    const now = Date.now();
    const record = rateLimitMap.get(clientKey);

    if (record && record.expiresAt > now && record.count >= MAX_ATTEMPTS) {
      return NextResponse.json(
        {
          success: false,
          error: "Terlalu banyak percobaan. Coba lagi nanti.",
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const pin = typeof body.pin === "string" ? body.pin : "";
    const expectedPin = process.env.ADMIN_PIN ?? process.env.NEXT_PUBLIC_ADMIN_PIN ?? "admin123";

    if (!pin.trim()) {
      return NextResponse.json(
        { success: false, error: "PIN wajib diisi." },
        { status: 400 }
      );
    }

    if (pin !== expectedPin) {
      const nextCount = (record?.count ?? 0) + 1;
      rateLimitMap.set(clientKey, {
        count: nextCount,
        expiresAt: now + RATE_LIMIT_MS,
      });

      return NextResponse.json(
        { success: false, error: "PIN salah. Silakan coba lagi." },
        { status: 401 }
      );
    }

    rateLimitMap.delete(clientKey);

    return NextResponse.json({
      success: true,
      name: "Dosen",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Gagal memvalidasi PIN." },
      { status: 500 }
    );
  }
}
