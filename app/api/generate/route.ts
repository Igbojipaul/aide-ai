import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Conversation from "@/models/Conversation";
import { Message } from "@/components/chat/ChatMessages";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  try {
    // Authenticate user
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    // Parse request body
    const { prompt, conversationId, messagesData } = await req.json();

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    // Convert messages into Gemini’s structured format
    const history = Array.isArray(messagesData)
      ? messagesData.map((msg: Message) => ({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        }))
      : [];

    // Add the latest user input at the end
    const payload = {
      contents: [
        ...history,
        {
          role: "user",
          parts: [
            {
              text: `
You are Aide, an AI Blog Assistant designed to create engaging, platform-specific content (LinkedIn, Twitter, Medium, Instagram). 

Guidelines:
- If no platform is specified, pick one randomly (e.g., Medium).
- If the prompt is gibberish, reply humorously.
- If it’s a greeting (e.g., "Hello", "Good morning"), reintroduce yourself and remind the user what you can do.
- Always keep tone friendly, professional, and emoji-enhanced.

New user prompt: "${prompt}"
`,
            },
          ],
        },
      ],
    };

    if (!apiKey) throw new Error("API key not configured");

    // Call Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    // Handle errors
    if (result.error) {
      throw new Error(result.error.message || "Gemini API error");
    }

    const content = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
    if (!content) throw new Error("No content generated");

    // Update conversation title if still "new Conversation"
    const conversation = await Conversation.findById(conversationId);
    if (conversation && conversation.title === "new Conversation") {
      const title = prompt.substring(0, 30) + (prompt.length > 30 ? "..." : "");
      await Conversation.findByIdAndUpdate(conversationId, { title });
    }

    return NextResponse.json({ content });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("[GENERATION_ERROR]", error);
      return NextResponse.json(
        { error: error.message || "Internal server error" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}