"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface Conversation {
    _id: string,
    userId: string,
    platform: string,
    title: string
}

export default function ConversationSidebar() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch('/api/conversation');
        const data = await response.json();
        setConversations(data);
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const startNewConversation = async () => {
    try {
      const response = await fetch('/api/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Conversation', platform: '' })
      });
      
      const newConversation = await response.json();
      router.push(`/chat/${newConversation._id}`);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  if (loading) return <div className="p-4 text-gray-400">Loading...</div>;

  return (
    <div className="w-64 bg-gray-900 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-700">
        <button 
          onClick={startNewConversation}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          + New Chat
        </button>
      </div>
      
      <ul className="divide-y divide-gray-700">
        {conversations.map(conversation => (
          <li key={conversation._id}>
            <button
              onClick={() => router.push(`/chat/${conversation._id}`)}
              className="w-full text-left p-4 hover:bg-gray-800 transition"
            >
              <div className="font-medium truncate">{conversation.title}</div>
              <div className="text-sm text-gray-400 truncate">
                {conversation.platform || 'No platform'}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}