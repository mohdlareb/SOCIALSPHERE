import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Volume2, VolumeX, X, Play, Share2 } from 'lucide-react';

interface Reel {
  id: number;
  videoUrl: string;
  creator: string;
  avatarUrl: string;
  description: string;
  likes: number;
  comments: number;
}

const MOCK_REELS: Reel[] = [
  {
    id: 1,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-neon-light-from-a-building-in-a-rainy-night-42861-large.mp4',
    creator: 'cyber_nomad',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=80',
    description: 'Neon reflection vibes in rain. Tokyo hits different 🗼🌧️ #lofi #cyberpunk',
    likes: 1205,
    comments: 89
  },
  {
    id: 2,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-matrix-style-computer-running-code-43124-large.mp4',
    creator: 'aurora_codes',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=128&q=80',
    description: 'Bending matrix shaders. Speed run compilation of Tailwind 4 plugins! 💻🤖 #code #webgl',
    likes: 984,
    comments: 42
  },
  {
    id: 3,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4',
    creator: 'alex_cosmos',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80',
    description: 'Testing spatial capturing out in nature. The lighting model is insane. 🌳☀️ #nature #spatial',
    likes: 1450,
    comments: 132
  }
];

export default function ReelsFeed() {
  const [activeReel, setActiveReel] = useState<Reel | null>(null);
  const [muted, setMuted] = useState(true);
  const [likesState, setLikesState] = useState<Record<number, { count: number; liked: boolean }>>({});
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});

  const toggleLike = (reelId: number) => {
    setLikesState((prev) => {
      const current = prev[reelId] || { count: MOCK_REELS.find((r) => r.id === reelId)?.likes || 0, liked: false };
      return {
        ...prev,
        [reelId]: {
          count: current.liked ? current.count - 1 : current.count + 1,
          liked: !current.liked
        }
      };
    });
  };

  const currentLikes = (reel: Reel) => {
    return likesState[reel.id] || { count: reel.likes, liked: false };
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-sm font-bold tracking-wider text-gray-400 uppercase flex items-center gap-1.5">
          <Play size={14} className="text-pink-500" />
          <span>Immersive Reels</span>
        </h2>
      </div>

      {/* horizontal scroll of previews */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide py-1">
        {MOCK_REELS.map((reel) => (
          <motion.div
            key={reel.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveReel(reel)}
            className="w-28 h-44 rounded-2xl overflow-hidden relative cursor-pointer flex-shrink-0 border border-white/10 shadow-lg"
          >
            <video
              src={reel.videoUrl}
              muted
              playsInline
              loop
              className="w-full h-full object-cover"
              ref={(el) => {
                videoRefs.current[reel.id] = el;
              }}
              onMouseEnter={() => videoRefs.current[reel.id]?.play().catch(() => {})}
              onMouseLeave={() => {
                videoRefs.current[reel.id]?.pause();
                if (videoRefs.current[reel.id]) {
                  videoRefs.current[reel.id]!.currentTime = 0;
                }
              }}
            />
            {/* dark overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent flex flex-col justify-end p-2.5">
              <div className="flex items-center gap-1">
                <img src={reel.avatarUrl} alt="" className="w-4 h-4 rounded-full object-cover border border-white/30" />
                <span className="text-[10px] text-white font-bold truncate">@{reel.creator}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Immersive Overlay */}
      <AnimatePresence>
        {activeReel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] flex items-center justify-center p-0 sm:p-4"
          >
            <div className="relative w-full max-w-sm h-full sm:h-[85vh] bg-black sm:rounded-3xl overflow-hidden flex flex-col justify-between">
              
              {/* Top Controls */}
              <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center text-white">
                <button
                  onClick={() => setMuted(!muted)}
                  className="p-2 bg-black/40 hover:bg-black/60 rounded-full transition cursor-pointer"
                  aria-label={muted ? 'Unmute' : 'Mute'}
                >
                  {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>

                <button
                  onClick={() => setActiveReel(null)}
                  className="p-2 bg-black/40 hover:bg-black/60 rounded-full transition cursor-pointer"
                  aria-label="Close reels player"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Vertical Video Element */}
              <video
                src={activeReel.videoUrl}
                autoPlay
                playsInline
                loop
                muted={muted}
                className="w-full h-full object-cover absolute inset-0 z-0"
              />

              {/* Bottom Details & Interactivity Panels */}
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10 flex items-end justify-between gap-4 text-white">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={activeReel.avatarUrl}
                      alt=""
                      className="w-8 h-8 rounded-full border border-white/20 object-cover"
                    />
                    <div>
                      <p className="font-bold text-sm">@{activeReel.creator}</p>
                      <p className="text-[10px] text-gray-300">Creator Sphere</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-200 leading-relaxed font-medium">
                    {activeReel.description}
                  </p>
                </div>

                {/* Right Floating Actions Column */}
                <div className="flex flex-col items-center gap-4 flex-shrink-0 z-20">
                  {/* Like Button */}
                  <div className="flex flex-col items-center gap-1">
                    <motion.button
                      onClick={() => toggleLike(activeReel.id)}
                      whileTap={{ scale: 0.8 }}
                      className={`p-3 rounded-full cursor-pointer transition ${
                        currentLikes(activeReel).liked ? 'bg-red-500 text-white' : 'bg-black/40 text-white hover:bg-black/60'
                      }`}
                    >
                      <Heart size={20} className={currentLikes(activeReel).liked ? 'fill-white' : ''} />
                    </motion.button>
                    <span className="text-[10px] font-bold">{currentLikes(activeReel).count}</span>
                  </div>

                  {/* Comment Count Indicator */}
                  <div className="flex flex-col items-center gap-1">
                    <button className="p-3 bg-black/40 hover:bg-black/60 rounded-full text-white cursor-pointer transition">
                      <MessageCircle size={20} />
                    </button>
                    <span className="text-[10px] font-bold">{activeReel.comments}</span>
                  </div>

                  {/* Share button */}
                  <button className="p-3 bg-black/40 hover:bg-black/60 rounded-full text-white cursor-pointer transition">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
