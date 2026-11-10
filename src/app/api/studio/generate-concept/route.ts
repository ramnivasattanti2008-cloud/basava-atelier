import { NextResponse } from "next/server";
import { ImageGenerationService } from "@/services/imageGenerationService";
import type { BespokeDesignConfig } from "@/lib/studio-types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { config } = body as { config?: BespokeDesignConfig };

    if (!config) {
      return NextResponse.json({ error: "Bespoke bag configuration is required." }, { status: 400 });
    }

    const views = await ImageGenerationService.generateConceptViews(config);

    return NextResponse.json({
      success: true,
      views,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("API /api/studio/generate-concept error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate concept views." },
      { status: 500 }
    );
  }
}

