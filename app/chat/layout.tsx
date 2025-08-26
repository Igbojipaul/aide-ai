"use client";

import { ReactNode, useState, useEffect } from "react";
import ConversationHistory from "@/components/ConversationHistory";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";

export default function ChatLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Extract conversation ID from pathname
  const conversationId =
    pathname === "/chat" ? undefined : pathname.split("/").pop();

  // Handle responsive design
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${isMobile ? "fixed left-0 top-0 z-50" : "relative"} 
          ${sidebarOpen ? (isMobile ? "w-80" : "w-64") : "w-0"} 
          ${isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"}
          transition-all duration-300 ease-in-out
          h-full bg-gray-900 border-r border-gray-800
          ${sidebarOpen ? "overflow-visible" : "overflow-hidden"}
        `}
      >
        {sidebarOpen && (
          <ConversationHistory
            currentConversationId={conversationId}
            onToggle={toggleSidebar}
            isMobile={isMobile}
          />
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 pt-16"> {/* Added pt-16 */}
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

        {/* Chat content */}
        <div className="flex-1 overflow-auto">{children}</div>
      </main>
    </div>
  );
}