// components/PlatformPicker.tsx
import React from "react";
import PlatformCard from "./PlatformCard";
import { PLATFORMS } from "@/lib/platforms";

interface PlatformPickerProps {
  onSelect: (platformId: string) => void;
}

const PlatformPicker: React.FC<PlatformPickerProps> = ({ onSelect }) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-2">Select a Platform</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Choose where you want to publish your content
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PLATFORMS.map((platform) => (
          <PlatformCard
            key={platform.id}
            platform={platform}
            onClick={() => onSelect(platform.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default PlatformPicker;