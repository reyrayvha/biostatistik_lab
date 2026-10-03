import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const password = typeof body.password === "string" ? body.password : "";
    const pin = typeof body.pin === "string" ? body.pin : password;
    const correctPassword = process.env.ADMIN_PIN ?? process.env.NEXT_PUBLIC_ADMIN_PIN ?? "admin123";

    if (pin === correctPassword) {
      return NextResponse.json({ success: true, name: "Dosen" });
    }

    return NextResponse.json({ success: false, error: "PIN salah." }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal memvalidasi PIN." }, { status: 500 });
  }
}
