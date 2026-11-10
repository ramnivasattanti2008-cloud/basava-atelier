import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("bv_admin_session") || cookieStore.get("kd_admin_session");
  const isAuthenticated = session?.value === "authenticated";
  return NextResponse.json({ authenticated: isAuthenticated });
}

