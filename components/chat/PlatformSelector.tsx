// components/chat/PlatformSelector.tsx
'use client';

import { Button } from '@/components/ui/button';

interface PlatformSelectorProps {
  onSelect: (platform: string) => void;
}

const platforms = [
  { id: 'twitter', name: 'Twitter/X', icon: '🐦' },
  { id: 'instagram', name: 'Instagram', icon: '📸' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
  { id: 'youtube', name: 'YouTube', icon: '🎥' },
  { id: 'facebook', name: 'Facebook', icon: '👥' }
];

export default function PlatformSelector({ onSelect }: PlatformSelectorProps) {
  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2">
        {platforms.map((platform) => (
          <Button
            key={platform.id}
            variant="outline"
            className="text-sm px-3 py-1.5 rounded-full bg-gray-700 hover:bg-gray-600 transition whitespace-nowrap"
            onClick={() => onSelect(platform.name)}
          >
            {platform.icon} {platform.name}
          </Button>
        ))}
      </div>
    </div>
  );
}