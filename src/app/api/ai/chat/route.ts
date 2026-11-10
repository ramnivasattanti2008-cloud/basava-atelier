import { NextResponse } from "next/server";
import { ConversationService } from "@/services/conversationService";
import { defaultStudioOptions } from "@/data/studio-defaults";
import type { BespokeDesignConfig, DesignMessage } from "@/lib/studio-types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, currentConfig, history } = body as {
      message?: string;
      currentConfig?: BespokeDesignConfig;
      history?: DesignMessage[];
    };

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message text is required." }, { status: 400 });
    }

    if (!currentConfig) {
      return NextResponse.json({ error: "currentConfig is required." }, { status: 400 });
    }

    const result = await ConversationService.processMessage(
      message,
      currentConfig,
      history || [],
      defaultStudioOptions
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("API /api/ai/chat error:", error);
    return NextResponse.json(
      {
        error: error?.message || "Failed to process message with AI designer.",
        reply: "I am having trouble connecting to the design studio right now. Please select your options using the visual studio controls on the right.",
      },
      { status: 500 }
    );
  }
}

