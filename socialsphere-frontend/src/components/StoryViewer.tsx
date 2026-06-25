import { useState, useEffect, useRef } from 'react';
import { Trash2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { Story } from '../types';
import { deleteStory } from '../api/storyApi';
import { isVideoUrl } from '../utils/media';
import { motion, AnimatePresence } from 'framer-motion';

interface StoryViewerProps {
  stories: Story[];
  startIndex: number;
  currentUsername: string;
  onClose: () => void;
  onDeleted: (storyId: number) => void;
}

const STORY_DURATION = 5000;

export default function StoryViewer({ stories, startIndex, currentUsername, onClose, onDeleted }: StoryViewerProps) {
  const [index, setIndex] = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setProgress(0);

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIndex((i) => {
            if (i < stories.length - 1) return i + 1;
            onClose();
            return i;
          });
          return 0;
        }
        return prev + 100 / (STORY_DURATION / 100);
      });
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [index, stories.length, onClose]);

  const goNext = () => {
    setProgress(0);
    if (index < stories.length - 1) setIndex((i) => i + 1);
    else onClose();
  };

  const goPrev = () => {
    setProgress(0);
    if (index > 0) setIndex((i) => i - 1);
  };

  const current = stories[index];
  if (!current) return null;

  const isOwner = current.author.username === currentUsername;

  const handleDelete = async () => {
    if (!window.confirm('Delete this story?')) return;
    await deleteStory(current.id, currentUsername);
    onDeleted(current.id);
    if (stories.length <= 1) {
      onClose();
    } else if (index === stories.length - 1) {
      setIndex((i) => i - 1);
    }
  };

  const initial = current.author.username.charAt(0).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center"
    >
      <div className="relative w-full max-w-md h-full sm:h-[85vh] sm:rounded-3xl overflow-hidden bg-gray-950 flex flex-col justify-center border border-white/10 shadow-2xl">
        
        {/* Progress Bars */}
        <div className="absolute top-4 left-4 right-4 flex gap-1.5 z-20">
          {stories.map((_, i) => (
            <div key={i} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: i < index ? '100%' : i === index ? `${progress}%` : '0%' }}
              />
            </div>
          ))}
        </div>

        {/* Story Header */}
        <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-20 bg-black/20 p-2.5 backdrop-blur-sm rounded-2xl border border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white overflow-hidden border border-white/20">
              {current.author.profilePictureUrl ? (
                <img src={current.author.profilePictureUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                initial
              )}
            </div>
            <div>
              <span className="text-white text-xs font-bold block">@{current.author.username}</span>
              <span className="text-[10px] text-gray-300">{new Date(current.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isOwner && (
              <button
                onClick={handleDelete}
                className="p-1.5 hover:bg-white/10 rounded-lg text-white/95 transition cursor-pointer"
                aria-label="Delete story"
              >
                <Trash2 size={16} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-lg text-white transition cursor-pointer"
              aria-label="Close viewer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Media Frame with zoom-in AnimatePresence */}
        <div className="w-full h-full relative z-0 flex items-center justify-center select-none bg-black">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.04, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full flex items-center justify-center"
            >
              {isVideoUrl(current.imageUrl) ? (
                <video
                  src={current.imageUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : (
                <img src={current.imageUrl} alt="" className="w-full h-full object-contain" />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Swipe zones and Nav chevrons */}
        <button
          onClick={goPrev}
          disabled={index === 0}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white cursor-pointer transition disabled:opacity-0 z-10"
          aria-label="Previous story"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={goNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white cursor-pointer transition z-10"
          aria-label="Next story"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </motion.div>
  );
}