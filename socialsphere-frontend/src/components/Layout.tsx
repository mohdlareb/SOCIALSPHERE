import type { ReactNode } from 'react';
import Navbar from './Navbar';
import DashboardWidgets from './DashboardWidgets';
import { motion } from 'framer-motion';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[var(--app-bg)] text-gray-900 dark:text-white transition-colors duration-300">
      {/* Mobile Top Header (only visible on mobile) */}
      <header className="md:hidden sticky top-0 z-40 bg-white/40 dark:bg-black/40 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/5 py-3 px-4 flex items-center justify-between">
        <h1 className="text-xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 bg-clip-text text-transparent">
            SocialSphere
          </span>
        </h1>
      </header>

      {/* Main Grid Container */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 px-4 md:px-6">
        
        {/* Left Navigation Sidebar */}
        <Navbar />

        {/* Center Content Column */}
        <motion.main
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 max-w-2xl mx-auto w-full py-6 pb-24 md:pb-6"
        >
          {children}
        </motion.main>

        {/* Right Dashboard Widget Column (Desktop only) */}
        <aside className="w-80 py-6 hidden lg:block flex-shrink-0">
          <div className="sticky top-6">
            <DashboardWidgets />
          </div>
        </aside>

      </div>
    </div>
  );
}