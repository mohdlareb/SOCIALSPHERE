import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, TrendingUp, UserPlus, Check, Award } from 'lucide-react';
import { mockDb } from '../utils/mockDb';

export default function DashboardWidgets() {
  const navigate = useNavigate();
  const [followedState, setFollowedState] = useState<Record<string, boolean>>({});
  const [removedSuggestions, setRemovedSuggestions] = useState<string[]>([]);
  const currentUser = localStorage.getItem('username') || '';

  const suggestions = useMemo(() => {
    const allUsers = mockDb.getUsers();
    const following = mockDb.getFollowingList(currentUser);

    return allUsers
      .filter(
        (u) =>
          u.username !== currentUser &&
          !following.includes(u.username) &&
          !removedSuggestions.includes(u.username)
      )
      .slice(0, 3);
  }, [currentUser, removedSuggestions]);

  const handleFollow = (username: string) => {
    mockDb.toggleFollow(username, currentUser);
    setFollowedState((prev) => ({ ...prev, [username]: true }));
    setRemovedSuggestions((prev) => (prev.includes(username) ? prev : [...prev, username]));
  };

  return (
    <div className="space-y-6">
      {/* 1. CREATOR ANALYTICS WIDGET */}
      <div className="glass-card rounded-2xl p-5 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-bl-2xl">
          <Award size={18} className="text-purple-400" />
        </div>
        
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-1.5">
          <TrendingUp size={16} className="text-purple-400" />
          <span>Creator Metrics</span>
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Weekly Engagement Rate</p>

        {/* SVG Sparkline Graphic */}
        <div className="h-20 w-full relative group">
          <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gradient-sparkline" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {/* Background path fill */}
            <path
              d="M0,30 L0,15 Q15,5 30,18 T60,8 T90,20 T100,5 L100,30 Z"
              fill="url(#gradient-sparkline)"
            />
            {/* Sparkline curve */}
            <path
              d="M0,15 Q15,5 30,18 T60,8 T90,20 T100,5"
              fill="none"
              stroke="url(#gradient-glow)"
              strokeWidth="1.5"
              className="stroke-purple-500 dark:stroke-purple-400"
            />
            {/* Glowing path definition */}
            <linearGradient id="gradient-glow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </svg>
          {/* Pulse marker */}
          <div className="absolute top-[13%] right-[2%] w-2 h-2 bg-pink-500 rounded-full animate-ping" />
          <div className="absolute top-[13%] right-[2%] w-2 h-2 bg-pink-500 rounded-full" />
        </div>

        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-white/5 text-xs">
          <div>
            <p className="text-gray-400">Total Views</p>
            <p className="font-bold text-gray-900 dark:text-white mt-0.5">14.8K</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400">Engagement</p>
            <p className="font-bold text-green-500 mt-0.5">+24.3%</p>
          </div>
        </div>
      </div>

      {/* 2. AI CONTENT SUGGESTIONS */}
      {suggestions.length > 0 && (
        <div className="glass-card rounded-2xl p-5 border border-white/10">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-1.5">
            <Sparkles size={16} className="text-pink-400" />
            <span>AI Suggested Creators</span>
          </h3>

          <div className="space-y-3">
            {suggestions.map((user) => (
              <div key={user.id} className="flex items-center justify-between gap-3 text-xs">
                <div
                  onClick={() => navigate(`/profile/${user.username}`)}
                  className="flex items-center gap-2 cursor-pointer group flex-1"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white overflow-hidden flex-shrink-0">
                    {user.profilePictureUrl ? (
                      <img src={user.profilePictureUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      user.username.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white group-hover:underline truncate">
                      {user.username}
                    </p>
                    <p className="text-gray-400 truncate text-[10px]">{user.bio || 'SocialSphere Creator'}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleFollow(user.username)}
                  className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center flex-shrink-0 ${
                    followedState[user.username]
                      ? 'bg-green-500/10 border-green-500/30 text-green-500'
                      : 'bg-white/5 border-white/10 hover:border-purple-500 text-gray-400 hover:text-white'
                  }`}
                  aria-label="Quick follow"
                >
                  {followedState[user.username] ? <Check size={14} /> : <UserPlus size={14} />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. TRENDING HASHTAGS */}
      <div className="glass-card rounded-2xl p-5 border border-white/10">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Trending Topics</h3>
        <div className="space-y-2.5">
          {[
            { tag: 'SpatialComputing', posts: '4.8K spheres' },
            { tag: 'Glassmorphism', posts: '3.2K spheres' },
            { tag: 'CreativeCoding', posts: '2.9K spheres' },
            { tag: 'NeonTokyo', posts: '1.7K spheres' }
          ].map((item) => (
            <div
              key={item.tag}
              onClick={() => navigate(`/search?query=${item.tag}`)}
              className="group cursor-pointer flex justify-between items-center text-xs"
            >
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-purple-400 transition-colors">
                  #{item.tag}
                </p>
                <p className="text-gray-400 text-[10px] mt-0.5">{item.posts}</p>
              </div>
              <span className="text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                Explore →
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
