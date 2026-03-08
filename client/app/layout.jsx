import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import {
  ClerkProvider,
  SignedOut,
  SignInButton,
  SignedIn,
  UserButton,
} from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DocuMind AI",
  description: "Enterprise Document Intelligence Platform",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white overflow-hidden`}
        >
          {/* Animated Background */}
          <div className="fixed inset-0 -z-20 bg-gradient-to-br from-purple-900 via-slate-900 to-black animate-gradient" />
          <div className="fixed inset-0 -z-10 bg-black/40 backdrop-blur-3xl" />

          {/* Header */}
          <header className="w-full flex justify-between items-center px-8 py-4 backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-lg">

            {/* Left: Logo */}
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/DocuMindAI Logo.png"
                alt="DocuMindAI Logo"
                width={45}
                height={45}
                className="rounded-full object-cover border border-white/40 shadow-lg"
              />
              <div className="flex flex-col leading-tight">
                <span className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  DocuMindAI
                </span>
                <span className="text-xs text-gray-400">
                  Enterprise Document Intelligence
                </span>
              </div>
            </Link>

            {/* Center Navigation */}
            <nav className="hidden md:flex gap-8 text-sm text-gray-300">
              <Link href="/" className="hover:text-white transition">
                Home
              </Link>
              <Link href="/dashboard" className="hover:text-white transition">
                Dashboard
              </Link>
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-5">
              <a
                href="https://github.com/piyushratn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition"
              >
                GitHub
              </a>

              <SignedOut>
                <SignInButton>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-md transition duration-300">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>

          {/* Page Content */}
          <main className="pt-6 px-4 h-[calc(100vh-80px)] overflow-hidden">
            {children}
          </main>

        </body>
      </html>
    </ClerkProvider>
  );
}
