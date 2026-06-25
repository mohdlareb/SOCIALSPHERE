import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageCircle, Settings as SettingsIcon, Search, Plus, Sparkles, LogOut, FileText, Image } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useTheme } from '../context/useTheme';
import NotificationBell from './notificationBell';
import CreatePostModal from './CreatePostModal';
import AddStoryModal from './AddStoryModal';
import ThemeToggle from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { username, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);

  const initial = username ? username.charAt(0).toUpperCase() : '?';

  // Close fab when route changes
  useEffect(() => {
    setFabOpen(false);
  }, [location.pathname]);

  const activeClass = (path: string) => {
    const isActive = location.pathname === path;
    return isActive
      ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-500 border-l-4 border-purple-500 font-bold'
      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white';
  };

  const activeMobileClass = (path: string) => {
    return location.pathname === path
      ? 'text-purple-500 scale-110 font-bold'
      : 'text-gray-600 dark:text-gray-400';
  };

  return (
    <>
      {/* 1. DESKTOP NAVIGATION SIDEBAR (screens >= md) */}
      <nav className="hidden md:flex flex-col w-64 h-[calc(100vh-32px)] sticky top-4 left-0 glass-card rounded-3xl p-6 border border-white/10 select-none z-30 flex-shrink-0">
        {/* App Logo */}
        <div className="mb-8 pl-2 flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 via-pink-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
            <Sparkles size={16} />
          </div>
          <Link to="/" className="text-2xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 bg-clip-text text-transparent bg-[length:200%_200%] animate-mesh-bg">
              SocialSphere
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 space-y-2">
          <Link
            to="/"
            className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-200 ${activeClass('/')}`}
          >
            <Home size={20} />
            <span className="text-sm">Feed</span>
          </Link>

          <Link
            to="/search"
            className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-200 ${activeClass('/search')}`}
          >
            <Search size={20} />
            <span className="text-sm">Explore</span>
          </Link>

          <Link
            to="/rooms"
            className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-200 ${activeClass('/rooms')}`}
          >
            <MessageCircle size={20} />
            <span className="text-sm">Echo Rooms</span>
          </Link>

          <Link
            to={`/profile/${username}`}
            className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-200 ${activeClass(`/profile/${username}`)}`}
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden">
              {initial}
            </div>
            <span className="text-sm">Profile</span>
          </Link>

          <Link
            to="/settings"
            className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-200 ${activeClass('/settings')}`}
          >
            <SettingsIcon size={20} />
            <span className="text-sm">Settings</span>
          </Link>
        </div>

        {/* Expandable Desktop Floating Action Button (FAB) Area */}
        <div className="relative mb-6">
          <AnimatePresence>
            {fabOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                className="absolute bottom-16 left-0 right-0 glass-card rounded-2xl p-2 border border-white/10 shadow-xl space-y-1 mb-2"
              >
                <button
                  onClick={() => {
                    setShowCreatePost(true);
                    setFabOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs hover:bg-purple-500/10 hover:text-purple-400 transition text-left cursor-pointer"
                >
                  <FileText size={14} className="text-purple-400" />
                  <span>Create Post</span>
                </button>
                <button
                  onClick={() => {
                    setShowCreateStory(true);
                    setFabOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs hover:bg-pink-500/10 hover:text-pink-400 transition text-left cursor-pointer"
                >
                  <Image size={14} className="text-pink-400" />
                  <span>Share Story</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={() => setFabOpen((prev) => !prev)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <motion.div animate={{ rotate: fabOpen ? 45 : 0 }}>
              <Plus size={18} />
            </motion.div>
            <span>Create New</span>
          </motion.button>
        </div>

        {/* Bottom Utilities */}
        <div className="border-t border-gray-100 dark:border-white/5 pt-4 space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
                {initial}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold truncate text-gray-900 dark:text-white">{username}</p>
                <p className="text-[10px] text-gray-400">Sphere Member</p>
              </div>
            </div>
            <NotificationBell />
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="flex-1 py-2 glass-card rounded-xl border border-white/5 flex items-center justify-center text-gray-500 hover:text-red-500 transition cursor-pointer"
              aria-label="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* 2. MOBILE FLOATING NAVIGATION BAR (screens < md) */}
      <nav className="md:hidden fixed bottom-6 left-4 right-4 glass-card rounded-2xl border border-white/10 px-6 py-3.5 shadow-2xl z-40 flex items-center justify-between">
        <Link to="/" className={`p-1.5 transition-transform ${activeMobileClass('/')}`} aria-label="Feed">
          <Home size={22} />
        </Link>
        <Link to="/search" className={`p-1.5 transition-transform ${activeMobileClass('/search')}`} aria-label="Search">
          <Search size={22} />
        </Link>

        {/* Center Actions FAB */}
        <div className="relative">
          <AnimatePresence>
            {fabOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                className="absolute bottom-16 -left-14 w-36 glass-card rounded-xl p-1.5 border border-white/10 shadow-xl space-y-1 mb-1"
              >
                <button
                  onClick={() => {
                    setShowCreatePost(true);
                    setFabOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[10px] hover:bg-purple-500/10 hover:text-purple-400 transition text-left cursor-pointer"
                >
                  <FileText size={12} className="text-purple-400" />
                  <span>Create Post</span>
                </button>
                <button
                  onClick={() => {
                    setShowCreateStory(true);
                    setFabOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[10px] hover:bg-pink-500/10 hover:text-pink-400 transition text-left cursor-pointer"
                >
                  <Image size={12} className="text-pink-400" />
                  <span>Share Story</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setFabOpen((prev) => !prev)}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/20 cursor-pointer"
          >
            <motion.div animate={{ rotate: fabOpen ? 45 : 0 }}>
              <Plus size={20} />
            </motion.div>
          </button>
        </div>

        <Link to="/rooms" className={`p-1.5 transition-transform ${activeMobileClass('/rooms')}`} aria-label="Echo Rooms">
          <MessageCircle size={22} />
        </Link>

        {/* Right utility items on mobile navbar */}
        <div className="flex items-center gap-3">
          <NotificationBell />
          <Link to={`/profile/${username}`} aria-label="Profile">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-[10px] font-bold text-white">
              {initial}
            </div>
          </Link>
        </div>
      </nav>

      {/* 3. DIALOGS */}
      {showCreatePost && username && (
        <CreatePostModal
          username={username}
          onClose={() => setShowCreatePost(false)}
          onCreated={() => navigate('/')}
        />
      )}

      {showCreateStory && username && (
        <AddStoryModal
          username={username}
          onClose={() => setShowCreateStory(false)}
          onCreated={() => {
            // refresh stories bar if window has refetch callbacks
            window.dispatchEvent(new Event('ss_story_added'));
          }}
        />
      )}
    </>
  );
}