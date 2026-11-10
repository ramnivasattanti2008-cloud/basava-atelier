import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { ContactMessage } from "@/lib/types";

export async function GET() {
  try {
    const messages = await db.getMessages();
    return NextResponse.json({ ok: true, messages });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ContactMessage;
    if (!body || !body.name || !body.email || !body.message) {
      return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
    }

    const saved = await db.saveMessage({
      id: body.id || `MSG-${Date.now().toString(36).toUpperCase()}`,
      createdAt: body.createdAt || new Date().toISOString(),
      name: body.name,
      email: body.email,
      phone: body.phone || "",
      topic: body.topic || "General",
      message: body.message,
      read: false,
    });
    return NextResponse.json({ ok: true, message: saved });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
