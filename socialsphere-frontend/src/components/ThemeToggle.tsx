import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  toggleTheme: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function ThemeToggle({ isDark, toggleTheme }: ThemeToggleProps) {
  return (
    <button
      onClick={toggleTheme}
      className="flex-1 py-2 glass-card rounded-xl border border-white/5 flex items-center justify-center text-gray-500 hover:text-purple-500 transition-all cursor-pointer relative overflow-hidden h-10 select-none"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="sun"
            initial={{ y: 20, rotate: -90, opacity: 0 }}
            animate={{ y: 0, rotate: 0, opacity: 1 }}
            exit={{ y: -20, rotate: 90, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="absolute flex items-center justify-center gap-2"
          >
            <Sun size={18} className="text-amber-500 fill-amber-500/20" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ y: 20, rotate: 90, opacity: 0 }}
            animate={{ y: 0, rotate: 0, opacity: 1 }}
            exit={{ y: -20, rotate: -90, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="absolute flex items-center justify-center gap-2"
          >
            <Moon size={18} className="text-indigo-600 fill-indigo-600/10" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
