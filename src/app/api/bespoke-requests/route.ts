import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { BespokeQuotationRequest } from "@/lib/studio-types";

export async function GET() {
  try {
    const bespokeRequests = await db.getBespokeRequests();
    return NextResponse.json({ ok: true, bespokeRequests });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as BespokeQuotationRequest;
    if (!body || !body.id || !body.customer) {
      return NextResponse.json({ ok: false, error: "Invalid bespoke request payload" }, { status: 400 });
    }

    const saved = await db.saveBespokeRequest(body);
    return NextResponse.json({ ok: true, bespokeRequest: saved });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

