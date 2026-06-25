import { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { getAllPosts } from '../api/postApi';
import { getActiveStories } from '../api/storyApi';
import type { Post, Story } from '../types';
import PostCard from '../components/PostCard';
import StoriesBar from '../components/Storiesbar';
import StoryViewer from '../components/StoryViewer';
import ReelsFeed from '../components/ReelsFeed';
import { SkeletonPost } from '../components/SkeletonLoader';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Sparkles } from 'lucide-react';
import { mockDb } from '../utils/mockDb';

export default function Feed() {
  const { username } = useAuth();
  const location = useLocation();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStoryUser, setActiveStoryUser] = useState<string | null>(null);

  // Feed Tab type: 'foryou' | 'following'
  const [feedType, setFeedType] = useState<'foryou' | 'following'>('foryou');
  const [refreshing, setRefreshing] = useState(false);
  const [appending, setAppending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Story added listener
  useEffect(() => {
    const handleStoryAdded = () => {
      getActiveStories().then(setStories);
    };
    window.addEventListener('ss_story_added', handleStoryAdded);
    return () => window.removeEventListener('ss_story_added', handleStoryAdded);
  }, []);

  const refetchStories = () => {
    getActiveStories().then(setStories);
  };

  const fetchFeedData = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const [postsData, storiesData] = await Promise.all([
        getAllPosts(),
        getActiveStories()
      ]);
      setPosts(postsData);
      setStories(storiesData);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => {
    let isActive = true;
    if (isActive) {
      fetchFeedData(true);
    }
    return () => {
      isActive = false;
    };
  }, [location.key]);

  // Pull-to-refresh simulation
  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await fetchFeedData(false);
    setRefreshing(false);
  };

  // Infinite Scroll Observer
  useEffect(() => {
    if (loading) return;
    
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && !appending) {
          setAppending(true);
          // Simulate loading next batch of posts
          await new Promise((resolve) => setTimeout(resolve, 1200));
          
          setPosts((prev) => {
            // Append some older mock duplicates with updated IDs
            const currentUsers = mockDb.getUsers();
            const additional: Post[] = [
              {
                id: Date.now() + 1,
                content: 'Infinite scroll matches the AI indexing models smoothly. WebGL elements compile on viewport intersections now. 📈🌌',
                imageUrl: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=80',
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                author: currentUsers[Math.floor(Math.random() * currentUsers.length)]
              },
              {
                id: Date.now() + 2,
                content: 'Enjoying some coffee and coding session. Let\'s build something beautiful today! ☕🎨',
                imageUrl: null,
                createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
                author: currentUsers[Math.floor(Math.random() * currentUsers.length)]
              }
            ];
            return [...prev, ...additional];
          });
          setAppending(false);
        }
      },
      { threshold: 1.0 }
    );

    const currentBottom = bottomRef.current;
    if (currentBottom) {
      observer.observe(currentBottom);
    }

    return () => {
      if (currentBottom) {
        observer.unobserve(currentBottom);
      }
    };
  }, [loading, appending]);

  const handlePostUpdated = (updated: Post) => {
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handlePostDeleted = (postId: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handleStoryDeleted = (storyId: number) => {
    setStories((prev) => prev.filter((s) => s.id !== storyId));
  };

  // Filter posts based on tab
  const filteredPosts = useMemo(() => {
    if (feedType === 'foryou') {
      return posts; // show all
    }
    // Only show posts from users currentUsername follows
    if (!username) return [];
    const following = mockDb.getFollowingList(username);
    return posts.filter((p) => p.author.username === username || following.includes(p.author.username));
  }, [posts, feedType, username]);

  const activeStories = useMemo(() => {
    if (!activeStoryUser) return [];
    return stories
      .filter((s) => s.author.username === activeStoryUser)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [activeStoryUser, stories]);

  if (!username) return null;

  return (
    <div className="relative min-h-screen bg-[var(--app-bg)] dark:bg-[#0B0F19]">
      
      {/* Stories Horizontal Tray */}
      <StoriesBar
        stories={stories}
        currentUsername={username}
        onSelectUser={setActiveStoryUser}
        onStoryAdded={refetchStories}
      />

      {/* Reels Segment */}
      <ReelsFeed />

      {/* Feed Filter Segment & Pull to Refresh Toggle */}
      <div className="flex items-center justify-between border-b border-gray-200/50 dark:border-dark-border mb-6 select-none">
        <div className="flex gap-6 text-sm font-semibold">
          <button
            onClick={() => setFeedType('foryou')}
            className={`pb-3 relative cursor-pointer transition ${
              feedType === 'foryou' ? 'text-purple-500' : 'text-gray-500 hover:text-gray-800 dark:text-dark-text-secondary dark:hover:text-dark-text-primary'
            }`}
          >
            <span className="flex items-center gap-1">
              <Sparkles size={14} />
              <span>For You</span>
            </span>
            {feedType === 'foryou' && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"
              />
            )}
          </button>
          <button
            onClick={() => setFeedType('following')}
            className={`pb-3 relative cursor-pointer transition ${
              feedType === 'following' ? 'text-purple-500' : 'text-gray-500 hover:text-gray-800 dark:text-dark-text-secondary dark:hover:text-dark-text-primary'
            }`}
          >
            <span>Following</span>
            {feedType === 'following' && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"
              />
            )}
          </button>
        </div>

        {/* Pull to refresh action */}
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2 text-gray-500 hover:text-purple-500 hover:bg-white/5 rounded-xl transition cursor-pointer mb-2"
          aria-label="Refresh feed"
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin text-purple-500' : ''} />
        </button>
      </div>

      {/* Main Feed Content List */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="shimmer-feed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[1, 2].map((i) => (
              <SkeletonPost key={i} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key={`feed-${feedType}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {filteredPosts.length === 0 ? (
              <div className="glass-card rounded-2xl p-8 border border-white/10 text-center">
                <p className="text-gray-500 text-sm">
                  {feedType === 'following'
                    ? 'No posts from creators you follow. Explore new accounts in For You!'
                    : 'No posts yet. Share something with the sphere!'}
                </p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUsername={username}
                  onUpdated={handlePostUpdated}
                  onDeleted={handlePostDeleted}
                />
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Infinite scrolling bottom anchor */}
      <div ref={bottomRef} className="py-4 flex justify-center text-xs text-gray-500 select-none">
        {appending && (
          <div className="w-full">
            <SkeletonPost />
          </div>
        )}
        {!loading && !appending && (
          <span className="opacity-40 animate-pulse">Scanning the cosmos for more spheres...</span>
        )}
      </div>

      {/* Full screen active story viewer */}
      <AnimatePresence>
        {activeStoryUser && activeStories.length > 0 && (
          <StoryViewer
            stories={activeStories}
            startIndex={0}
            currentUsername={username}
            onClose={() => setActiveStoryUser(null)}
            onDeleted={handleStoryDeleted}
          />
        )}
      </AnimatePresence>
    </div>
  );
}