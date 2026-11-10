import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { Order } from "@/lib/types";

export async function GET() {
  try {
    const orders = await db.getOrders();
    return NextResponse.json({ ok: true, orders });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Order;
    if (!body || !body.id || !body.customer) {
      return NextResponse.json({ ok: false, error: "Invalid order payload" }, { status: 400 });
    }

    const saved = await db.saveOrder(body);
    return NextResponse.json({ ok: true, order: saved });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
