"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Send, Paperclip, Mic } from "lucide-react";
import { motion } from "framer-motion";
import { Message } from "./ChatMessages";



interface ChatInputProps {
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  setMessages: (fn: (prev: Message[]) => Message[]) => void;
  selectedPlatform: string | null;
  onSubmitMessage: (message: string) => Promise<void>;
  conversationId: string | null;
  placeholder?: string;
}

export default function ChatInput({
  isGenerating,
  setIsGenerating,
  prompt,
  setPrompt,
  setMessages,
  selectedPlatform,
  onSubmitMessage,
  conversationId,
  placeholder = "Ask me to help you create amazing blog content..."
}: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!inputValue.trim() || isGenerating) return;
    
    const messageToSend = inputValue.trim();
    setInputValue("");
    setIsExpanded(false);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    
    try {
      await onSubmitMessage(messageToSend);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Optionally restore the message in the input on failure
      setInputValue(messageToSend);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 120) + 'px';
      setIsExpanded(scrollHeight > 56);
    }
  };

  const suggestions = [
    "Write a LinkedIn article about AI trends",
    "Create a Twitter thread about productivity tips",
    "Draft a blog post about remote work benefits",
    "Generate an Instagram caption for a tech product"
  ];

  return (
    <div className="p-3 md:p-4 bg-transparent">
      <div className="max-w-4xl mx-auto">
        {/* Platform indicator */}
        {selectedPlatform && (
          <div className="mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/20 border border-blue-600/30 rounded-full text-blue-300 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Optimizing for {selectedPlatform}
            </div>
          </div>
        )}

        {/* Input form */}
        <form onSubmit={handleSubmit} className="relative">
          <div className={`relative bg-gray-800 border border-gray-700 rounded-2xl transition-all duration-200 ${
            isExpanded ? 'rounded-3xl' : ''
          } ${inputValue.trim() ? 'border-gray-600' : ''}`}>
            
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isGenerating}
              className="w-full bg-transparent text-white placeholder-gray-400 px-4 md:px-6 py-3 md:py-4 pr-12 md:pr-16 resize-none focus:outline-none min-h-[48px] md:min-h-[56px] max-h-[120px] text-sm md:text-base"
              style={{ height: '48px' }}
            />

            {/* Actions */}
            <div className="absolute right-2 md:right-3 bottom-2 md:bottom-3 flex items-center gap-1 md:gap-2">
              {/* Optional: Attachment button - hidden on mobile to save space */}
              <button
                type="button"
                className="hidden md:block p-2 text-gray-400 hover:text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                title="Attach file (coming soon)"
                disabled
              >
                <Paperclip className="h-4 w-4" />
              </button>

              {/* Send button */}
              <motion.button
                type="submit"
                disabled={!inputValue.trim() || isGenerating}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  inputValue.trim() && !isGenerating
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
                whileHover={inputValue.trim() && !isGenerating ? { scale: 1.05 } : {}}
                whileTap={inputValue.trim() && !isGenerating ? { scale: 0.95 } : {}}
              >
                <Send className="h-4 w-4" />
              </motion.button>
            </div>
          </div>

          {/* Character count for long messages - smaller on mobile */}
          {inputValue.length > 100 && (
            <div className="text-xs text-gray-500 mt-1 md:mt-2 text-right">
              {inputValue.length} characters
            </div>
          )}
        </form>

        {/* Suggestions (only show when input is empty and not generating) - Simplified on mobile */}
        {!inputValue && !isGenerating && !conversationId && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 md:mt-4"
          >
          </motion.div>
        )}

        {/* Footer text - smaller on mobile */}
        <div className="text-xs text-gray-500 text-center mt-3 md:mt-4">
          AI can make mistakes. Please verify important information.
        </div>
      </div>
    </div>
    );
  }