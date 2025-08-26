"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, MessageSquare, Trash2 } from "lucide-react";

export interface Conversation {
  _id: string;
  title: string;
  platform: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface ConversationHistoryProps {
  currentConversationId?: string;
  onToggle?: () => void;
  isMobile?: boolean;
}

export default function ConversationHistory({
  currentConversationId,
  onToggle,
  isMobile = false
}: ConversationHistoryProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/conversations');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Invalid response: ${text.substring(0, 100)}`);
      }
      
      const data = await response.json();
      setConversations(data);
      setError("");
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const createNewConversation = async () => {

      
      router.push(`/chat`)
  };

  const deleteConversation = async (conversationId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent navigation
    
    if (!confirm('Are you sure you want to delete this conversation?')) {
      return;
    }

    try {
      setDeleteLoading(conversationId);
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete conversation');
      }

      // Remove from local state
      setConversations(prev => prev.filter(conv => conv._id !== conversationId));
      
      // If we're currently viewing this conversation, redirect to /chat
      if (currentConversationId === conversationId) {
        router.push('/chat');
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
      setError('Failed to delete conversation');
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const navigateToConversation = (conversationId: string) => {
    // Close sidebar on mobile after selecting conversation
    if (isMobile && onToggle) {
      onToggle();
    }
    router.push(`/chat/${conversationId}`);
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-500" />
          <span className="font-semibold text-white text-sm">Conversations</span>
        </div>
        {isMobile && (
          <button 
            onClick={onToggle}
            className="p-1 text-gray-400 hover:text-white"
            aria-label="Close sidebar"
          >
            ×
          </button>
        )}
      </div>
      
      {/* New Chat Button */}
      <div className="p-4">
        <button 
          onClick={createNewConversation}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg transition-colors font-medium"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </button>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="mx-4 mb-4 p-3 bg-red-900/50 border border-red-700 text-red-200 text-sm rounded-lg">
          {error}
          <button 
            onClick={fetchConversations}
            className="ml-2 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}
      
      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center p-8 text-gray-400">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="ml-2">Loading...</span>
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-4 text-center">
            <div className="text-gray-500 text-sm">
              No conversations yet
            </div>
            <div className="text-gray-600 text-xs mt-1">
              Start a new chat to begin!
            </div>
          </div>
        ) : (
          <div className="p-2">
            {conversations.map(conversation => (
              <div
                key={conversation._id}
                className={`group relative mb-1 rounded-lg transition-all duration-200 ${
                  currentConversationId === conversation._id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <div
                  onClick={() => navigateToConversation(conversation._id)}
                  className="w-full text-left p-3 rounded-lg"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate text-sm">
                        {conversation.title}
                      </div>
                      <div className={`text-xs mt-1 truncate ${
                        currentConversationId === conversation._id
                          ? 'text-blue-100'
                          : 'text-gray-500'
                      }`}>
                        {formatDate(conversation.updatedAt)}
                      </div>
                    </div>
                    
                    {/* Delete Button */}
                    <button
                      onClick={(e) => deleteConversation(conversation._id, e)}
                      disabled={deleteLoading === conversation._id}
                      className={`opacity-0 group-hover:opacity-100 p-1 rounded transition-all ${
                        currentConversationId === conversation._id
                          ? 'hover:bg-blue-700'
                          : 'hover:bg-gray-700'
                      } ${deleteLoading === conversation._id ? 'opacity-50' : ''}`}
                    >
                      {deleteLoading === conversation._id ? (
                        <div className="animate-spin rounded-full h-3 w-3 border border-current border-t-transparent" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}