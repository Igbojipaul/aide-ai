"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

export interface Message {
  _id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: Date;
  showPlatforms?: boolean;
  realAiResponse?: boolean;
}

interface ChatMessagesProps {
  messages: Message[];
  setMessages: (fn: (prev: Message[]) => Message[]) => void;
  isGenerating: boolean;
  setSelectedPlatform: (platform: string) => void;
  saveMessage: (
    message: Omit<Message, "_id" | "createdAt">
  ) => Promise<Message | null>;
  conversationId: string | null;
}

export default function ChatMessages({
  messages,
  setMessages,
  isGenerating,
  setSelectedPlatform,
  saveMessage,
  conversationId,
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  // Update conversation platform in database
  const updateConversationPlatform = async (platform: string) => {
    if (!conversationId) return;

    try {
      await fetch(`/api/conversations/${conversationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform }),
      });
    } catch (error) {
      console.error("Failed to update conversation platform:", error);
    }
  };

  // Handle platform selection
  const handlePlatformSelect = async (platform: string) => {
    if (!conversationId) return;

    // Set the selected platform in parent component
    setSelectedPlatform(platform);

    // Update conversation in database
    await updateConversationPlatform(platform);

    // Create user message
    const userMessage: Omit<Message, "_id" | "createdAt"> = {
      role: "user",
      content: `I choose ${platform}`,
      showPlatforms: false,
      realAiResponse: false,
    };

    // Add to UI immediately (optimistic update)
    const tempUserMessage: Message = {
      ...userMessage,
      _id: `temp-user-${Date.now()}`,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, tempUserMessage]);

    // Save to database
    const savedUserMessage = await saveMessage(userMessage);

    // Update UI with database ID
    if (savedUserMessage) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === tempUserMessage._id ? savedUserMessage : msg
        )
      );
    }

    // Create AI response
    const aiMessage: Omit<Message, "_id" | "createdAt"> = {
      role: "assistant",
      content: `Perfect! I'll help you create content optimized for ${platform}. What topic would you like to write about? Please also let me know:

• Your target audience
• Desired tone (professional, casual, educational, etc.)
• Approximate length you're looking for
• Any specific goals for this content`,
      showPlatforms: false,
      realAiResponse: true,
    };

    // Add AI message to UI
    const tempAiMessage: Message = {
      ...aiMessage,
      _id: `temp-ai-${Date.now()}`,
      createdAt: new Date(),
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, tempAiMessage]);

      // Save AI message to database
      saveMessage(aiMessage).then((savedAiMessage) => {
        if (savedAiMessage) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg._id === tempAiMessage._id ? savedAiMessage : msg
            )
          );
        }
      });
    }, 1000);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="min-h-full p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 && !isGenerating ? (
            // Empty state
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <div className="text-center text-gray-500">
                <div className="text-lg font-medium mb-2">No messages yet</div>
                <div className="text-sm">
                  Start a conversation by typing a message below
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 pb-6">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.1,
                    }}
                  >
                    <MessageBubble
                      message={message}
                      showPlatforms={message.showPlatforms || false}
                      onPlatformSelect={handlePlatformSelect}
                    />
                  </motion.div>
                ))}


              </AnimatePresence>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}
