import React, { useState, useEffect, useRef } from 'react';
import { X, Menu } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

export default function Header({ toggleSidebar, sidebarOpen }: HeaderProps) {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);
  const mainRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Find the main scrollable container
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainRef.current = mainElement as HTMLElement;
    }

    const handleScroll = () => {
      const scrollContainer = mainRef.current || window;
      const currentScrollY = mainRef.current ? mainRef.current.scrollTop : window.scrollY;

      // Clear any existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Show header when at the top or scrolling up
      if (currentScrollY <= 0) {
        setIsHeaderVisible(true);
      } else if (currentScrollY < lastScrollY) {
        setIsHeaderVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsHeaderVisible(false);
      }

      // Set timeout to hide header after 2 seconds of no scrolling
      const id = setTimeout(() => {
        if (currentScrollY > 0) {
          setIsHeaderVisible(false);
        }
      }, 2000);

      setTimeoutId(id);
      setLastScrollY(currentScrollY);
    };

    const scrollContainer = mainRef.current || window;
    scrollContainer.addEventListener('scroll', handleScroll);

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [lastScrollY, timeoutId]);

  return (
    <header
      className={`flex items-center bg-gray-900 justify-between px-4 border-b border-gray-800 transition-transform duration-300 ${
        isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
      } fixed top-0 left-0 right-0 z-50 h-16`} // Added h-16 for explicit height
    >
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {sidebarOpen ? (
            <X className="h-4 w-4 text-gray-300" />
          ) : (
            <Menu className="h-4 w-4 text-gray-300" />
          )}
        </button>
        <h1 className="text-lg font-semibold text-white">Aide</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="p-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
}