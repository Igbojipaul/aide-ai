import { 
  TwitterLogoIcon, 
  InstagramLogoIcon, 
  LinkedInLogoIcon, 
  VideoIcon,  // For YouTube
  FaceIcon    // For Facebook
} from "@radix-ui/react-icons";

import React, { ReactNode } from "react";

export interface Platform {
  id: string;
  name: string;
  icon: ReactNode;
  bgColor: string;
  textColor: string;
  description: string;
  charLimit: number;
}

export const PLATFORMS: Platform[] = [
  {
    id: "twitter",
    name: "Twitter/X",
    icon: "icon",
    bgColor: "bg-black hover:bg-gray-900",
    textColor: "text-white",
    description: "Short, impactful posts",
    charLimit: 280,
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "icon",
    bgColor: "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600",
    textColor: "text-white",
    description: "Visual storytelling",
    charLimit: 2200,
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: "icon",
    bgColor: "bg-blue-600 hover:bg-blue-700",
    textColor: "text-white",
    description: "Professional content",
    charLimit: 3000,
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: "icon",
    bgColor: "bg-red-600 hover:bg-red-700",
    textColor: "text-white",
    description: "Video descriptions",
    charLimit: 5000,
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: "icon",
    bgColor: "bg-blue-500 hover:bg-blue-600",
    textColor: "text-white",
    description: "Long-form posts",
    charLimit: 63206,
  },
];