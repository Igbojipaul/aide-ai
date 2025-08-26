import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          AI Blog Assistant
        </Link>
        <div className="flex gap-4">
          <Link 
            href="/chat" 
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Start Chatting
          </Link>
        </div>
      </div>
    </nav>
  );
}