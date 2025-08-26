import { useState } from "react";
import { Copy, Check, User, Bot, Twitter, Linkedin, Instagram, FileText, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { Message } from "./ChatMessages";



interface MessageBubbleProps {
  message: Message;
  showPlatforms: boolean;
  onPlatformSelect: (platform: string) => void;
}

const platforms = [
  { name: "Twitter", icon: Twitter, color: "bg-blue-500", description: "Short, engaging tweets" },
  { name: "LinkedIn", icon: Linkedin, color: "bg-blue-600", description: "Professional content" },
  { name: "Instagram", icon: Instagram, color: "bg-pink-500", description: "Visual storytelling" },
  { name: "Medium", icon: FileText, color: "bg-green-600", description: "In-depth articles" },
  { name: "Personal Blog", icon: FileText, color: "bg-purple-600", description: "Custom content" },
  { name: "Email Newsletter", icon: Mail, color: "bg-orange-500", description: "Email campaigns" },
];

export default function MessageBubble({
  message,
  showPlatforms,
  onPlatformSelect
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  const formatTime = (createdAt: Date) => {

    if (!createdAt) {
    console.warn('formatTime: createdAt is undefined or null, using current time');
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date());
  }

  const date = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
  if (isNaN(date.getTime())) {
    console.warn('formatTime: Invalid date, using current time');
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date());
  }

    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 md:gap-4 ${isUser ? 'flex-row-reverse' : ''} group`}>
      {/* Avatar */}
      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser 
          ? 'bg-gray-700' 
          : 'bg-gradient-to-r from-blue-500 to-purple-600'
      }`}>
        {isUser ? (
          <User className="h-4 w-4 md:h-5 md:w-5 text-white" />
        ) : (
          <Bot className="h-4 w-4 md:h-5 md:w-5 text-white" />
        )}
      </div>
      
      {/* Message Content */}
      <div className={`flex-1 min-w-0 max-w-[85%] md:max-w-[70%] ${isUser ? 'items-end' : ''}`}>
        {/* Header */}
        <div className={`flex items-center gap-2 mb-1 ${isUser ? 'justify-end' : ''}`}>
          <div className="font-medium text-sm text-gray-300">
            {isUser ? 'You' : 'Aide'}
          </div>
          <div className="text-xs text-gray-500">
            {formatTime(message.createdAt || new Date())}
          </div>
        </div>
        
        {/* Message bubble */}
        <div className={`relative rounded-2xl px-4 py-3 ${
          isUser 
            ? 'bg-blue-600 text-white ml-auto' 
            : 'bg-gray-800 border border-gray-700 text-gray-100'
        }`}>
          {/* Message content */}
          <div className="whitespace-pre-wrap break-words leading-relaxed">
            {message.content}
          </div>
          
          {/* Copy button for assistant messages */}
          {!isUser && (
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-700"
              title="Copy message"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-400" />
              ) : (
                <Copy className="h-4 w-4 text-gray-400" />
              )}
            </button>
          )}
        </div>
        
        {/* Platform selection */}
        {showPlatforms && !isUser && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4"
          >
            <div className="text-sm text-gray-400 mb-3">
              Choose a platform to optimize your content for:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {platforms.map((platform) => (
                <motion.button
                  key={platform.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onPlatformSelect(platform.name)}
                  className="flex items-center gap-3 p-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-xl transition-all group"
                >
                  <div className={`p-2 rounded-lg ${platform.color}`}>
                    <platform.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-medium text-white text-sm">
                      {platform.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {platform.description}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}