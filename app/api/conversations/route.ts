import { NextResponse } from "next/server";
import Conversation from "@/models/Conversation";
import dbConnect from "@/lib/mongodb";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const newConversation = await Conversation.create({
      title: "New Conversation",
      platform: "none",
      userId,
    });
    return NextResponse.json(newConversation);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  await dbConnect();
  // console.log("I've been hit")

  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const conversations = await Conversation.find({ userId }).sort({ updatedAt: -1 });
    return NextResponse.json(conversations);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to get conversations" },
      { status: 500 }
    );
  }
}