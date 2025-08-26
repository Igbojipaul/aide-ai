// components/ui/PromptSuggestions.tsx
"use client";

import { useState } from "react";
import { Button } from "./button";

interface PromptSuggestionsProps {
  setInput: (value: string) => void;
}

export default function PromptSuggestions({
  setInput,
}: PromptSuggestionsProps) {
  const [showPrompt, setShowPrompt] = useState(false);

  const prompts = [
    "Explain AI ethics in simple terms",
    "Create Twitter thread about machine learning",
    "Generate Instagram caption about tech trends",
    "Write LinkedIn post about career growth in AI",
  ];
  if (!showPrompt) {
    return (
      <div className="mt-1 w-full overflow-x-hidden pb-1">
        <Button className={"cursor-pointer p-2 rounded md border-gray-500"} onClick={()=>{setShowPrompt(true)}} variant={"outline"}>Show suggested Prompts</Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2 mt-3 w-full flex-wrap overflow-x-hidden pb-1 scrollbar-hide">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          onClick={() => setInput(prompt)}
          className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 transition whitespace-nowrap"
        >
          {prompt}
        </button>
      ))}
      <Button className={"cursor-pointer"} onClick={()=>{setShowPrompt(false)}} variant={"outline"}>Close</Button>

    </div>
  );
}
