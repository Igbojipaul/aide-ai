// components/chat/Sidebar.tsx
'use client';

import { useState } from 'react';
import { Plus, History, Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface SidebarProps {
  conversations: any[];
  loading: boolean;
  onCreateNew: (platform: string) => void;
  onSelect: (conversationId: string) => void;
}

export function Sidebar({ 
  conversations, 
  loading,
  onCreateNew,
  onSelect
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  
  const platforms = [
    { id: 'twitter', name: 'Twitter/X', icon: '🐦' },
    { id: 'instagram', name: 'Instagram', icon: '📸' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
    { id: 'youtube', name: 'YouTube', icon: '🎥' },
    { id: 'facebook', name: 'Facebook', icon: '👥' }
  ];
  
  const handleCreateNew = (platform: string) => {
    setSelectedPlatform(null);
    onCreateNew(platform);
  };

  return (
    <div className="flex flex-col h-full p-4 bg-gray-800">
      <div className="mb-6">
        <Button 
          className="w-full flex items-center gap-3 p-3"
          onClick={() => setSelectedPlatform('select')}
        >
          <Plus size={18} />
          <span>New Conversation</span>
        </Button>
      </div>
      
      {selectedPlatform === 'select' && (
        <div className="mb-6 p-4 bg-gray-700 rounded-lg">
          <h3 className="text-sm font-medium mb-3">Select Platform</h3>
          <div className="grid grid-cols-2 gap-2">
            {platforms.map(platform => (
              <Button
                key={platform.id}
                variant="outline"
                className="text-sm py-2"
                onClick={() => handleCreateNew(platform.id)}
              >
                {platform.icon} {platform.name}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      <div className="mb-6 overflow-hidden flex-1">
        <h3 className="text-sm font-medium mb-3">Recent Conversations</h3>
        
        {loading ? (
          <div className="text-center py-4 text-gray-500">Loading...</div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No conversations yet
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map(conversation => (
              <div
                key={conversation._id}
                className="p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition"
                onClick={() => onSelect(conversation._id)}
              >
                <div className="flex items-center gap-2">
                  <div className="bg-gray-600 rounded-full w-2 h-2 flex-shrink-0"></div>
                  <div className="truncate">{conversation.title}</div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(conversation.updatedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-auto">
        <Button className="w-full flex items-center gap-3 p-3">
          <Settings size={16} />
          <span>Settings</span>
        </Button>
      </div>
    </div>
  );
}