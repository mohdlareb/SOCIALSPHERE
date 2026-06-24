import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Sparkles, Flame, Users, Grid } from 'lucide-react';
import { searchUsers } from '../api/userApi';
import type { User } from '../types';
import CardTilt from '../components/CardTilt';
import { motion, AnimatePresence } from 'framer-motion';

const TRENDING_TAGS = [
  { tag: 'SpatialComputing', posts: 4802, category: 'Technology' },
  { tag: 'Glassmorphism', posts: 3218, category: 'Design' },
  { tag: 'CreativeCoding', posts: 2931, category: 'Development' },
  { tag: 'NeonTokyo', posts: 1740, category: 'Photography' },
  { tag: 'AIArts', posts: 1420, category: 'Artificial Intelligence' }
];

const EXPLORE_POSTS = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
    title: 'Glassmorphic shaders in canvas',
    views: '8.4K'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=400&q=80',
    title: '3D refraction rendering',
    views: '12.1K'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&q=80',
    title: 'Midnight rain capture in Tokyo',
    views: '15.4K'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=400&q=80',
    title: 'Immersive VR spatial prototyping',
    views: '6.7K'
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=400&q=80',
    title: '3D fluid aesthetics simulation',
    views: '9.2K'
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?auto=format&fit=crop&w=400&q=80',
    title: 'Late night lo-fi terminal coding',
    views: '11.8K'
  }
];

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('query') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync initial query param change
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    debounceRef.current = setTimeout(() => {
      searchUsers(query.trim())
        .then(setResults)
        .finally(() => setSearching(false));
    }, 350);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const selectHashtag = (tag: string) => {
    setQuery(tag);
    setSearchParams({ query: tag });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary mb-6 flex items-center gap-2 select-none">
        <Sparkles size={22} className="text-purple-500" />
        <span>Explore the Sphere</span>
      </h1>

      {/* Glowing Search input */}
      <div className="relative mb-6">
        <SearchIcon
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search accounts or interests..."
          value={query}
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value);
            setSearchParams(value ? { query: value } : {});
          }}
          className="w-full bg-white/40 dark:bg-dark-card/50 backdrop-blur-md text-gray-900 dark:text-dark-text-primary rounded-2xl pl-12 pr-4 py-3.5 outline-none border border-gray-200 dark:border-dark-border focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-gray-500"
        />
      </div>

      <AnimatePresence mode="wait">
        {searching && (
          <motion.div
            key="searching-loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center py-10"
          >
            <p className="text-xs text-gray-400 dark:text-dark-text-secondary animate-pulse">Filtering stellar coordinates...</p>
          </motion.div>
        )}

        {!searching && query.trim() && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {results.length === 0 ? (
              <p className="text-gray-500 dark:text-dark-text-secondary text-sm text-center py-6">
                No accounts found matching "{query}"
              </p>
            ) : (
              results.map((user) => {
                const initial = user.username.charAt(0).toUpperCase();
                return (
                  <motion.div key={user.id} whileHover={{ scale: 1.01 }} className="block">
                    <Link
                      to={`/profile/${user.username}`}
                      className="flex items-center justify-between p-4 glass-card rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white overflow-hidden shadow-sm flex-shrink-0">
                          {user.profilePictureUrl ? (
                            <img src={user.profilePictureUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            initial
                          )}
                        </div>
                        <div>
                          <p className="text-gray-900 dark:text-dark-text-primary font-bold text-sm">@{user.username}</p>
                          {user.bio && (
                            <p className="text-gray-400 dark:text-dark-text-secondary text-xs mt-0.5 line-clamp-1">{user.bio}</p>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-purple-400 font-semibold">View Profile →</span>
                    </Link>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        )}

        {!searching && !query.trim() && (
          <motion.div
            key="default-explore"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* 1. Trending Hashtags List */}
            <div>
              <h2 className="text-xs font-bold tracking-wider text-gray-400 dark:text-dark-text-secondary uppercase mb-4 flex items-center gap-1.5 select-none">
                <Flame size={14} className="text-purple-500" />
                <span>Trending Coordinates</span>
              </h2>

              <div className="flex flex-wrap gap-2.5">
                {TRENDING_TAGS.map((t) => (
                  <motion.button
                    key={t.tag}
                    onClick={() => selectHashtag(t.tag)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-4 py-2 bg-white/40 dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-full hover:border-purple-500/30 text-xs font-semibold text-gray-700 dark:text-dark-text-primary cursor-pointer flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <span className="text-purple-400">#</span>
                    <span>{t.tag}</span>
                    <span className="text-[10px] text-gray-400 dark:text-dark-text-secondary opacity-60">({t.posts})</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* 2. Masonry grid visual cards */}
            <div>
              <h2 className="text-xs font-bold tracking-wider text-gray-400 dark:text-dark-text-secondary uppercase mb-4 flex items-center gap-1.5 select-none">
                <Grid size={14} className="text-pink-500" />
                <span>Curated Spheres</span>
              </h2>

              <div className="grid grid-cols-2 gap-4">
                {EXPLORE_POSTS.map((item) => (
                  <CardTilt key={item.id}>
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden relative group border border-white/10 shadow-lg cursor-pointer">
                      <img
                        src={item.url}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      {/* Dark overlay drawer */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end opacity-90 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-xs font-bold leading-normal truncate">{item.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Users size={10} className="text-gray-300" />
                          <span className="text-[10px] text-gray-300 font-semibold">{item.views} views</span>
                        </div>
                      </div>
                    </div>
                  </CardTilt>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}