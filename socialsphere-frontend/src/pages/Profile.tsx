import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { getUserProfile } from '../api/userApi';
import { getPostsByUsername } from '../api/postApi';
import { toggleFollow, getFollowStatus, getFollowCounts, getFollowers, getFollowing } from '../api/followApi';
import type { User, Post, FollowCounts } from '../types';
import PostModal from '../components/PostModal';
import FollowListModal from '../components/FollowListModal';
import CardTilt from '../components/CardTilt';
import { Play, TrendingUp, Sparkles, Award, Star, Compass, BarChart2 } from 'lucide-react';
import { isVideoUrl } from '../utils/media';
import { motion, AnimatePresence } from 'framer-motion';

export default function Profile() {
  const { username: profileUsername } = useParams<{ username: string }>();
  const { username: currentUsername } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadedUsername, setLoadedUsername] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const [counts, setCounts] = useState<FollowCounts>({ followerCount: 0, followingCount: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [followBusy, setFollowBusy] = useState(false);
  const [listModal, setListModal] = useState<'followers' | 'following' | null>(null);
  const [listUsers, setListUsers] = useState<User[]>([]);

  // Local tab: 'grid' | 'analytics'
  const [activeTab, setActiveTab] = useState<'grid' | 'analytics'>('grid');

  useEffect(() => {
    if (!profileUsername) return;
    Promise.all([
      getUserProfile(profileUsername),
      getPostsByUsername(profileUsername),
      getFollowCounts(profileUsername)
    ]).then(([userData, postsData, countsData]) => {
      setProfile(userData);
      setPosts(postsData);
      setCounts(countsData);
      setLoadedUsername(profileUsername);
    });
  }, [profileUsername]);

  useEffect(() => {
    if (!profileUsername || !currentUsername || profileUsername === currentUsername) return;
    getFollowStatus(profileUsername, currentUsername).then(setIsFollowing);
  }, [profileUsername, currentUsername]);

  const handlePostUpdated = (updated: Post) => {
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setSelectedPost(updated);
  };

  const handlePostDeleted = (postId: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handleFollowToggle = async () => {
    if (!profileUsername || !currentUsername) return;
    setFollowBusy(true);
    const wasFollowing = isFollowing;
    setIsFollowing(!wasFollowing);
    setCounts((prev) => ({ ...prev, followerCount: prev.followerCount + (wasFollowing ? -1 : 1) }));
    try {
      await toggleFollow(profileUsername, currentUsername);
    } catch {
      setIsFollowing(wasFollowing);
      setCounts((prev) => ({ ...prev, followerCount: prev.followerCount + (wasFollowing ? 1 : -1) }));
    } finally {
      setFollowBusy(false);
    }
  };

  const openFollowers = async () => {
    if (!profileUsername) return;
    const data = await getFollowers(profileUsername);
    setListUsers(data);
    setListModal('followers');
  };

  const openFollowing = async () => {
    if (!profileUsername) return;
    const data = await getFollowing(profileUsername);
    setListUsers(data);
    setListModal('following');
  };

  const loading = loadedUsername !== profileUsername;

  if (loading) return <p className="text-gray-500 text-center mt-10 animate-pulse">Assembling profile components...</p>;
  if (!profile) return <p className="text-gray-500 text-center mt-10">Creator Sphere not found.</p>;

  const isOwnProfile = currentUsername === profile.username;
  const initial = profile.username.charAt(0).toUpperCase();

  return (
    <div className="space-y-6">
      
      {/* 1. Header Profile glass card */}
      <CardTilt>
        <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-xl relative overflow-hidden">
          
          {/* Decorative ambient color nodes inside card */}
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-purple-500/15 rounded-full blur-2xl" />
          <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-pink-500/10 rounded-full blur-2xl" />

          <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10 text-center sm:text-left">
            {/* Avatar block with gradient rings */}
            <div className="w-24 h-24 rounded-full p-[3px] bg-gradient-to-tr from-purple-500 via-pink-500 to-indigo-500 overflow-hidden shadow-lg flex-shrink-0">
              <div className="w-full h-full rounded-full bg-slate-50 dark:bg-dark-bg p-0.5">
                <div className="w-full h-full rounded-full bg-gray-800 overflow-hidden flex items-center justify-center font-bold text-white text-3xl">
                  {profile.profilePictureUrl ? (
                    <img src={profile.profilePictureUrl} alt={profile.username} className="w-full h-full object-cover" />
                  ) : (
                    initial
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-dark-text-primary truncate">@{profile.username}</h1>
                
                <div className="flex justify-center sm:justify-start gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-semibold">
                    <Star size={10} className="fill-purple-400" />
                    <span>Creator</span>
                  </span>
                  
                  {isOwnProfile ? (
                    <Link
                      to="/profile/edit"
                      className="bg-white/40 dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-900 dark:text-dark-text-primary text-xs px-3.5 py-1.5 rounded-xl hover:border-purple-500/30 transition-all font-semibold"
                    >
                      Edit Profile
                    </Link>
                  ) : (
                    <button
                      onClick={handleFollowToggle}
                      disabled={followBusy}
                      className={`text-xs px-4 py-1.5 rounded-xl font-bold transition-all disabled:opacity-50 cursor-pointer ${
                        isFollowing
                          ? 'bg-white/40 dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-900 dark:text-dark-text-primary hover:border-red-500/30'
                          : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/10 hover:shadow-purple-500/20'
                      }`}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                  )}
                </div>
              </div>

              {/* Bio block */}
              {profile.bio && (
                <p className="text-gray-600 dark:text-dark-text-secondary text-xs mt-3 leading-relaxed max-w-md">
                  {profile.bio}
                </p>
              )}

              {/* Stats Counters */}
              <div className="flex justify-center sm:justify-start gap-5 mt-4 text-xs">
                <span className="text-gray-400 dark:text-dark-text-secondary">
                  <strong className="text-gray-900 dark:text-dark-text-primary font-bold">{posts.length}</strong> posts
                </span>
                <button onClick={openFollowers} className="text-gray-400 dark:text-dark-text-secondary hover:text-purple-400 transition cursor-pointer">
                  <strong className="text-gray-900 dark:text-dark-text-primary font-bold">{counts.followerCount}</strong> followers
                </button>
                <button onClick={openFollowing} className="text-gray-400 dark:text-dark-text-secondary hover:text-purple-400 transition cursor-pointer">
                  <strong className="text-gray-900 dark:text-dark-text-primary font-bold">{counts.followingCount}</strong> following
                </button>
              </div>
            </div>
          </div>
        </div>
      </CardTilt>

      {/* 2. Page Tab selector */}
      <div className="flex border-b border-gray-200/50 dark:border-white/5 select-none">
        <button
          onClick={() => setActiveTab('grid')}
          className={`pb-3 pr-6 text-sm font-semibold relative cursor-pointer transition ${
            activeTab === 'grid' ? 'text-purple-500' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          <span>Visual Board</span>
          {activeTab === 'grid' && (
            <motion.div layoutId="profileTabUnderline" className="absolute bottom-0 left-0 right-6 h-0.5 bg-purple-500" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 pr-6 text-sm font-semibold relative cursor-pointer transition ${
            activeTab === 'analytics' ? 'text-purple-500' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <BarChart2 size={15} />
            <span>Sphere Analytics</span>
          </span>
          {activeTab === 'analytics' && (
            <motion.div layoutId="profileTabUnderline" className="absolute bottom-0 left-0 right-6 h-0.5 bg-purple-500" />
          )}
        </button>
      </div>

      {/* 3. Rendering Active Tab views */}
      <AnimatePresence mode="wait">
        {activeTab === 'grid' ? (
          <motion.div
            key="grid-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {posts.length === 0 ? (
              <div className="glass-card rounded-2xl p-8 border border-white/10 text-center">
                <p className="text-gray-500 text-xs">No visual files posted in this sphere yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {posts.map((post) => (
                  <motion.button
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="aspect-square bg-white/40 dark:bg-dark-card border border-gray-200/50 dark:border-dark-border rounded-2xl flex items-center justify-center p-1.5 overflow-hidden hover:border-purple-500/30 transition-all cursor-pointer shadow-sm relative group"
                  >
                    {post.imageUrl ? (
                      isVideoUrl(post.imageUrl) ? (
                        <div className="relative w-full h-full">
                          <video src={post.imageUrl} className="w-full h-full object-cover rounded-xl" muted />
                          <Play size={16} className="absolute bottom-2 right-2 text-white drop-shadow" />
                        </div>
                      ) : (
                        <img src={post.imageUrl} alt="" className="w-full h-full object-cover rounded-xl" />
                      )
                    ) : (
                      <p className="text-gray-600 dark:text-dark-text-secondary text-[10px] text-center line-clamp-4 px-2 leading-relaxed">
                        {post.content}
                      </p>
                    )}
                    {/* Hover glow screen */}
                    <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="analytics-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* SVG Analytic Chart */}
            <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-xl">
              <h3 className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-4 flex items-center gap-1.5">
                <TrendingUp size={15} className="text-purple-400" />
                <span>Audience Impressions Graph</span>
              </h3>
              
              <div className="h-44 w-full relative">
                <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="gradient-area" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#ec4899" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Fill Area */}
                  <path
                    d="M0,30 L0,22 Q15,8 30,20 T60,5 T85,18 T100,8 L100,30 Z"
                    fill="url(#gradient-area)"
                  />
                  {/* Grid Lines */}
                  <line x1="0" y1="10" x2="100" y2="10" className="stroke-gray-200 dark:stroke-white/10" strokeDasharray="2,2" />
                  <line x1="0" y1="20" x2="100" y2="20" className="stroke-gray-200 dark:stroke-white/10" strokeDasharray="2,2" />
                  
                  {/* Line curve */}
                  <path
                    d="M0,22 Q15,8 30,20 T60,5 T85,18 T100,8"
                    fill="none"
                    stroke="#a78bfa"
                    strokeWidth="1.5"
                  />
                </svg>
                <div className="absolute top-[16%] left-[60%] w-3 h-3 bg-purple-500 rounded-full animate-ping" />
                <div className="absolute top-[16%] left-[60%] w-3 h-3 bg-purple-500 rounded-full border-2 border-slate-50 dark:border-[#0B0F19]" />
              </div>
              <div className="flex justify-between items-center text-[10px] text-gray-500 mt-2">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>

            {/* Metric Blocks */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card rounded-2xl p-4 border border-white/10 text-center">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Follower Growth</p>
                <p className="text-xl font-extrabold text-purple-400 mt-1">+14.2%</p>
                <p className="text-[9px] text-gray-500 mt-1">vs previous 7 days</p>
              </div>
              <div className="glass-card rounded-2xl p-4 border border-white/10 text-center">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Engagement Ratio</p>
                <p className="text-xl font-extrabold text-pink-400 mt-1">8.65%</p>
                <p className="text-[9px] text-gray-500 mt-1">Industry average: 3.2%</p>
              </div>
            </div>

            {/* Achievements Widgets */}
            <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-xl">
              <h3 className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-4 flex items-center gap-1.5">
                <Award size={15} className="text-pink-400" />
                <span>Sphere Achievements</span>
              </h3>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-white/5 dark:bg-dark-card rounded-2xl border border-white/5 dark:border-dark-border flex flex-col items-center">
                  <Star size={24} className="text-yellow-500 fill-yellow-500/20" />
                  <p className="text-[10px] font-bold text-gray-900 dark:text-dark-text-primary mt-1.5">Rising Star</p>
                  <p className="text-[9px] text-gray-400 dark:text-dark-text-secondary mt-0.5">Reach 100+ followers</p>
                </div>
                <div className="p-3 bg-white/5 dark:bg-dark-card rounded-2xl border border-white/5 dark:border-dark-border flex flex-col items-center">
                  <Compass size={24} className="text-indigo-400" />
                  <p className="text-[10px] font-bold text-gray-900 dark:text-dark-text-primary mt-1.5">Explorer</p>
                  <p className="text-[9px] text-gray-400 dark:text-dark-text-secondary mt-0.5">Visit 5+ echo rooms</p>
                </div>
                <div className="p-3 bg-white/5 dark:bg-dark-card rounded-2xl border border-white/5 dark:border-dark-border flex flex-col items-center">
                  <Sparkles size={24} className="text-pink-400" />
                  <p className="text-[10px] font-bold text-gray-900 dark:text-dark-text-primary mt-1.5">Stellar Post</p>
                  <p className="text-[9px] text-gray-400 dark:text-dark-text-secondary mt-0.5">Collect 50+ likes</p>
                </div>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialogs */}
      {selectedPost && currentUsername && (
        <PostModal
          post={selectedPost}
          currentUsername={currentUsername}
          onClose={() => setSelectedPost(null)}
          onUpdated={handlePostUpdated}
          onDeleted={handlePostDeleted}
        />
      )}

      {listModal && (
        <FollowListModal
          title={listModal === 'followers' ? 'Followers' : 'Following'}
          users={listUsers}
          onClose={() => setListModal(null)}
        />
      )}
    </div>
  );
}