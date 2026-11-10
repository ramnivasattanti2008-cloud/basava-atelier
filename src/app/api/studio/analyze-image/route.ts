import { NextResponse } from "next/server";
import { ReferenceImageService } from "@/services/referenceImageService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { dataUrl, prompt } = body as { dataUrl?: string; prompt?: string };

    if (!dataUrl || typeof dataUrl !== "string") {
      return NextResponse.json({ error: "Image dataUrl is required." }, { status: 400 });
    }

    const result = await ReferenceImageService.analyzeReferenceImage(dataUrl, prompt);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("API /api/studio/analyze-image error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to analyze reference image." },
      { status: 500 }
    );
  }
}

