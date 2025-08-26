"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import ChatInput from "./chat/ChatInput";
import ChatMessages, { Message } from "./chat/ChatMessages";
import { MessageSquare, Sparkles } from "lucide-react";

interface ChatInterfaceProps {
  conversationId?: string;
}

export default function ChatInterface({
  conversationId: propConversationId,
}: ChatInterfaceProps = {}) {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();

  // Determine conversation ID from route params or props
  const routeConversationId = params?.conversationId as string | undefined;
  const conversationId = routeConversationId || propConversationId || null;

  // State management
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [conversationTitle, setConversationTitle] =
    useState("New Conversation");

  // Check if this is a new chat (no conversation ID)
  const isNewChat = !conversationId || pathname === "/chat";

  // Load conversation data
  const loadConversation = useCallback(
    async (convId: string) => {
      setLoading(true);
      setError("");

      try {
        // Load conversation details
        const convResponse = await fetch(`/api/conversations/${convId}`);

        if (!convResponse.ok) {
          if (convResponse.status === 404) {
            throw new Error("Conversation not found");
          }
          throw new Error(
            `Failed to load conversation: ${convResponse.status}`
          );
        }

        const conversation = await convResponse.json();

        if (conversation.error) {
          throw new Error(conversation.error);
        }

        setConversationTitle(conversation.title || "Untitled Conversation");
        setSelectedPlatform(conversation.platform || null);

        // Load messages
        const messagesResponse = await fetch(
          `/api/conversations/${convId}/messages`
        );

        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json();

          if (Array.isArray(messagesData)) {
            const formattedMessages: Message[] = messagesData.map(
              (msg: Message) => ({
                _id: msg._id,
                role: msg.role,
                content: msg.content,
                createdAt: msg?.createdAt,
                showPlatforms: msg.showPlatforms || false,
                realAiResponse: msg.realAiResponse || false,
              })
            );

            setMessages(formattedMessages);
          } else {
            setMessages([]);
          }
        } else {
          // Conversation exists but no messages yet
          router.push("/chat");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Failed to load conversation:", error);
          setError(error.message || "Failed to load conversation");
          setMessages([]);

          // If conversation not found, redirect to new chat
          if (error.message === "Conversation not found") {
            router.push("/chat");
          }
        } else {
          setError("An unknown error occured.");
        }
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  // Initialize conversation on mount or when conversationId changes
  useEffect(() => {
    if (conversationId && !isNewChat) {
      loadConversation(conversationId);
    } else {
      // Reset state for new chat
      setMessages([]);
      setSelectedPlatform(null);
      setConversationTitle("New Conversation");
      setError("");
      setLoading(false);
    }
  }, [conversationId, isNewChat, loadConversation]);

  // Create new conversation
  const createNewConversation = async (): Promise<string> => {
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Failed to create conversation: ${response.status}`);
      }

      const newConversation = await response.json();

      if (newConversation.error) {
        throw new Error(newConversation.error);
      }

      return newConversation._id;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Failed to create conversation:", error);
        throw new Error(error.message || "Failed to create new conversation");
      } else {
        console.error("Failed to create conversation");
        throw new Error("Failed to create new conversation");
      }
    }
  };

  // Save message to database
  const saveMessage = async (
    message: Omit<Message, "_id" | "createdAt">,
    convId: string
  ): Promise<Message | null> => {
    try {
      const response = await fetch(`/api/conversations/${convId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        throw new Error(`Failed to save message: ${response.status}`);
      }

      const savedMessage = await response.json();

      if (savedMessage.error) {
        throw new Error(savedMessage.error);
      }

      return {
        _id: savedMessage._id,
        role: savedMessage.role,
        content: savedMessage.content,
        showPlatforms: savedMessage.showPlatforms || false,
        realAiResponse: savedMessage.realAiResponse || false,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Failed to save message:", error);
        return null;
      } else {
        return null;
      }
    }
  };

  // Update conversation title based on first message
  const updateConversationTitle = async (
    convId: string,
    firstMessage: string
  ) => {
    try {
      // Generate a title from the first message (first 50 characters)
      const title =
        firstMessage.length > 50
          ? firstMessage.substring(0, 50) + "..."
          : firstMessage;

      const response = await fetch(`/api/conversations/${convId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (response.ok) {
        setConversationTitle(title);
      }
    } catch (error) {
      console.error("Failed to update conversation title:", error);
    }
  };

  // Handle message submission
  const handleSubmitMessage = async (prompt: string) => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setError("");

    try {
      let currentConvId = conversationId;

      // Create conversation if we're in a new chat
      if (!currentConvId || isNewChat) {
        currentConvId = await createNewConversation();
        // Navigate to the new conversation
        router.push(`/chat/${currentConvId}`);
        // Update title with first message
        updateConversationTitle(currentConvId, prompt);
      }

      // Create user message
      const userMessage: Omit<Message, "_id" | "createdAt"> = {
        role: "user",
        content: prompt.trim(),
        showPlatforms: false,
        realAiResponse: false,
      };

      // Add to UI immediately (optimistic update)
      const tempUserMessage: Message = {
        ...userMessage,
        _id: `temp-user-${Date.now()}`,
      };

      setMessages((prev) => [...prev, tempUserMessage]);

      // Save user message to database
      const savedUserMessage = await saveMessage(userMessage, currentConvId);

      if (!savedUserMessage) {
        throw new Error("Failed to save user message");
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === tempUserMessage._id ? savedUserMessage : msg
        )
      );

      // Add temporary assistant message
      const tempAssistantMessage: Message = {
        _id: `temp-assistant-${Date.now()}`,
        role: "assistant",
        content: "Thinking...",
        showPlatforms: false,
        realAiResponse: true,
      };

      setMessages((prev) => [...prev, tempAssistantMessage]);

      // TODO: Call your AI API here
      // For now, simulate AI response
      const res = await fetch(`/api/generate/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          conversationId: currentConvId,
          messagesData: messages.concat(savedUserMessage),
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to generate content: ${res.status}`);
      }

      const data = await res.json();

      const assistantMessage: Omit<Message, "_id" | "createdAt"> = {
        role: "assistant",
        content: data.content,
        showPlatforms: false,
        realAiResponse: true,
      };

      const savedAssistantMessage = await saveMessage(
        assistantMessage,
        currentConvId
      );

      if (!savedAssistantMessage) {
        throw new Error("Failed to save assistant message");
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === tempAssistantMessage._id ? savedAssistantMessage : msg
        )
      );

      setIsGenerating(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Failed to submit message:", error);
        setError(error.message || "Failed to send message. Please try again.");
        setIsGenerating(false);
        setMessages((prev) =>
          prev.filter((msg) => !msg._id.startsWith("temp-"))
        );
      }
      setError(
        "An unknown error occured, your message was not submitted. Please try again"
      );
      setIsGenerating(false);

      // Remove temporary messages on error
      setMessages((prev) => prev.filter((msg) => !msg._id.startsWith("temp-")));
    }
  };

  // Loading state for existing conversations
  if (loading && conversationId && !isNewChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          <div className="text-gray-400">Loading conversation...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !isNewChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-950 p-8">
        <div className="max-w-md text-center">
          <div className="text-red-400 mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
            {error}
          </div>
          <div className="space-y-3">
            <button
              onClick={() => router.push("/chat")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors"
            >
              Start New Conversation
            </button>
            {conversationId && (
              <button
                onClick={() => {
                  setError("");
                  loadConversation(conversationId);
                }}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Welcome screen for new chats
  if (isNewChat && messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col bg-gray-950 min-h-0 relative">
        {/* Welcome Content - Condensed */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex items-center justify-center p-4 md:p-6 min-h-full">
            <div className="max-w-3xl w-full text-center">
              {/* Header */}
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full mb-3">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Aide
                </h1>
                <p className="text-sm md:text-base text-gray-400 px-4">
                  Create engaging blog content for any platform
                </p>
              </div>

              {/* Feature Cards - Minimal and Responsive */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 px-4">
                <div className="bg-gray-900 p-3 hidden sm:block rounded-lg border border-gray-800">
                  <MessageSquare className="h-5 w-5 text-blue-500 mb-2 mx-auto" />
                  <h3 className="font-semibold text-white text-sm">
                    Smart Writing
                  </h3>
                  <p className="text-gray-400 text-xs">
                    Optimized blog posts for your audience
                  </p>
                </div>
                <div className="bg-gray-900 p-3 hidden sm:block rounded-lg border border-gray-800">
                  <Sparkles className="h-5 w-5 text-green-500 mb-2 mx-auto" />
                  <h3 className="font-semibold text-white text-sm">
                    Multiple Platforms
                  </h3>
                  <p className="text-gray-400 text-xs">
                    Content for LinkedIn, Medium, and more
                  </p>
                </div>
                <div className="bg-gray-900 hidden sm:block p-3 rounded-lg border border-gray-800">
                  <MessageSquare className="h-5 w-5 text-purple-500 mb-2 mx-auto" />
                  <h3 className="font-semibold text-white text-sm">
                    Conversation Memory
                  </h3>
                  <p className="text-gray-400 text-xs">
                    Continue chats with full context
                  </p>
                </div>
              </div>

              {/* Quick Start Examples - Compact */}
              <div className="px-4">
                <p className="text-gray-400 text-xs mb-3">Try asking:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-xl mx-auto">
                  {[
                    "Write a LinkedIn post about AI",
                    "Create a Twitter thread on productivity",
                    "Draft a blog intro about remote work",
                    "Generate Instagram captions",
                  ].map((example, index) => (
                    <div
                      key={index}
                      className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-2 text-xs text-gray-300"
                    >
                      {example}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Chat Input */}
        <div className="fixed bottom-0 left-0 right-0 bg-transparent p-4">
          <div className="max-w-4xl mx-auto">
            <ChatInput
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
              prompt=""
              setPrompt={() => {}}
              setMessages={setMessages}
              selectedPlatform={selectedPlatform}
              onSubmitMessage={handleSubmitMessage}
              conversationId={null}
              placeholder="What would you like to write about today?"
            />
          </div>
        </div>
      </div>
    );
  }

  // Main chat interface
  return (
    <div className="flex-1 flex flex-col h-full bg-gray-950 ">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-scroll">
        <ChatMessages
          messages={messages}
          setMessages={setMessages}
          isGenerating={isGenerating}
          setSelectedPlatform={setSelectedPlatform}
          saveMessage={(msg) =>
            conversationId
              ? saveMessage(msg, conversationId)
              : Promise.resolve(null)
          }
          conversationId={conversationId}
        />
      </div>

      {/* Chat Input */}
      <div>
        <ChatInput
          isGenerating={isGenerating}
          setIsGenerating={setIsGenerating}
          prompt=""
          setPrompt={() => {}}
          setMessages={setMessages}
          selectedPlatform={selectedPlatform}
          onSubmitMessage={handleSubmitMessage}
          conversationId={conversationId}
        />
      </div>
    </div>
  );
}
