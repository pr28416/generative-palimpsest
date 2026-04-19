import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { AI_SYSTEM_PROMPT } from "@/lib/content";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured." },
      { status: 500 }
    );
  }

  let body: { pageIndex: number; visibleText: string; zone: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { pageIndex, visibleText, zone } = body;

  if (typeof pageIndex !== "number" || typeof visibleText !== "string") {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const userPrompt = `Page ${pageIndex}, zone ${zone}. The visible text reads:\n\n${visibleText.slice(0, 800)}`;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-5.4-nano",
      messages: [
        { role: "system", content: AI_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      max_completion_tokens: 120,
    });

    const text = completion.choices[0]?.message?.content?.trim() ?? "";
    return NextResponse.json({ text });
  } catch (err) {
    console.error("OpenAI error:", err);
    return NextResponse.json(
      { error: "Generation failed." },
      { status: 502 }
    );
  }
}
