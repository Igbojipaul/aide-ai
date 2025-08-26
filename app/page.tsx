import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-gray-800 to-gray-700 text-white relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-purple-500/10 to-transparent blur-3xl"></div>

      <main className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Logo/Icon */}
        <div className="flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-2xl shadow-lg mb-6">
          <Sparkles className="h-7 w-7 text-white" />
        </div>

        {/* Headline */}
        <h1 className="text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white to-purple-300">
          Aide AI
        </h1>

        {/* Subtitle */}
        <p className="max-w-xl text-lg text-gray-200 mb-8">
          Your personal AI assistant for creating <span className="font-semibold text-white">platform-optimized</span> content  smarter, faster, and effortlessly.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/sign-in"
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition shadow-lg font-medium"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="px-6 py-3 rounded-xl bg-white text-indigo-700 hover:bg-gray-100 transition shadow-lg font-medium"
          >
            Create Account
          </Link>
        </div>
      </main>

      {/* Footer / Tagline */}
      <footer className="absolute bottom-6 text-gray-400 text-sm">
        ✨ Powered by AI • Built with Next.js + Clerk
      </footer>
    </div>
  );
}
