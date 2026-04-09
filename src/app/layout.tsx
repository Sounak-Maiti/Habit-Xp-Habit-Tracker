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
  title: "Habit Tracker - Build Better Habits Daily",
  description: "A modern habit tracking app that helps you build consistency and achieve your goals. Track daily habits, visualize progress, and stay motivated with beautiful analytics.",
  keywords: ["habit tracker", "daily habits", "goal tracking", "productivity", "consistency", "personal development"],
  authors: [{ name: "Habit Tracker Team" }],
  openGraph: {
    title: "Habit Tracker - Build Better Habits Daily",
    description: "A modern habit tracking app that helps you build consistency and achieve your goals.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Habit Tracker - Build Better Habits Daily",
    description: "A modern habit tracking app that helps you build consistency and achieve your goals.",
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
              if (typeof window !== 'undefined') {
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
