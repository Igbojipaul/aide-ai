import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ensureUserSynced } from "@/lib/syncUser";

export const metadata: Metadata = {
  title: "Aide ai",
  description:
    "An ai powered project that helps you write blog posts like a pro",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await ensureUserSynced();
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
    {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
