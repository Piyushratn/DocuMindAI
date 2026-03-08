'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-white relative overflow-hidden">

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl px-6"
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          DocuMindAI
        </h1>

        <p className="text-lg text-gray-300 mb-8">
          Enterprise Document Intelligence Platform powered by RAG architecture.
          Upload documents. Ask questions. Get contextual AI answers.
        </p>

        <div className="flex gap-6 justify-center">
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium shadow-lg transition"
          >
            Try Demo
          </Link>

          <a
            href="https://github.com/your-github-link"
            target="_blank"
            className="px-8 py-4 border border-white/30 rounded-xl hover:bg-white/10 transition"
          >
            View Code
          </a>
        </div>
      </motion.div>

      {/* Floating Glow Effect */}
      <div className="absolute w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl top-20 -z-10" />
      <div className="absolute w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-3xl bottom-10 right-10 -z-10" />
    </div>
  );
}
