import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Level Up Your Life with Habits - Gamified Habit System",
  description: "Earn XP for consistency, build habits like a game! Transform your daily routines into an epic journey of self-improvement with streaks, levels, and achievements.",
  keywords: ["gamified habits", "XP system", "level up habits", "habit game", "streak tracking", "achievement system", "productivity game"],
  authors: [{ name: "Gamified Habit System Team" }],
  openGraph: {
    title: "Level Up Your Life with Habits - Gamified Habit System",
    description: "Earn XP for consistency, build habits like a game! Transform your daily routines into an epic journey.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Level Up Your Life with Habits - Gamified Habit System",
    description: "Earn XP for consistency, build habits like a game! Transform your daily routines into an epic journey.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Prevent MetaMask connection errors
              window.addEventListener('error', function(e) {
                if (e.message && e.message.includes('MetaMask')) {
                  e.preventDefault();
                  console.warn('MetaMask error suppressed:', e.message);
                  return false;
                }
              });
              
              // Prevent unhandled promise rejections from MetaMask
              window.addEventListener('unhandledrejection', function(e) {
                if (e.reason && e.reason.toString && e.reason.toString().includes('MetaMask')) {
                  e.preventDefault();
                  console.warn('MetaMask promise rejection suppressed:', e.reason);
                  return false;
                }
              });
              
              // Override window.ethereum if it exists to prevent connections
              if (typeof window !== 'undefined' && !window.hasOwnProperty('ethereum')) {
                Object.defineProperty(window, 'ethereum', {
                  value: undefined,
                  writable: false,
                  configurable: false
                });
              }
            `,
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
