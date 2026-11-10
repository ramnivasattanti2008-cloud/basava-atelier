import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const EXPECTED_PASSCODE = process.env.ADMIN_PASSCODE || "kris2026";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { passcode } = body;

    if (!passcode || passcode.trim() !== EXPECTED_PASSCODE) {
      return NextResponse.json({ ok: false, error: "Incorrect passcode." }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set("kd_admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}

