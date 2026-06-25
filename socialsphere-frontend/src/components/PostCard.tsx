import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { MoreHorizontal, Heart, MessageCircle, Send, Bookmark, Share2 } from 'lucide-react';
import type { Post, Comment } from '../types';
import { toggleLike, getLikeCount, getComments, addComment, updatePost, deletePost } from '../api/postApi';
import ImageUploadInput from './ImageUploadInput';
import { isVideoUrl } from '../utils/media';
import CardTilt from './CardTilt';
import { motion, AnimatePresence } from 'framer-motion';

interface PostCardProps {
  post: Post;
  currentUsername: string;
  onUpdated?: (post: Post) => void;
  onDeleted?: (postId: number) => void;
}

export default function PostCard({ post, currentUsername, onUpdated, onDeleted }: PostCardProps) {
  const [likeCount, setLikeCount] = useState<number | null>(null);
  const [liked, setLiked] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const storedLikes = localStorage.getItem(`ss_likes_${currentUsername}`);
      if (!storedLikes) return false;
      return (JSON.parse(storedLikes) as number[]).includes(post.id);
    } catch {
      return false;
    }
  });
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editImageUrl, setEditImageUrl] = useState(post.imageUrl ?? '');
  const [saving, setSaving] = useState(false);
  
  // Particles for like interactions
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number }[]>([]);
  const [saved, setSaved] = useState(false);

  const isOwner = post.author.username === currentUsername;

  useEffect(() => {
    getLikeCount(post.id)
      .then(setLikeCount)
      .catch(() => setLikeCount(0));
  }, [post.id]);

  const handleLike = async () => {
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((prev) => (prev === null ? prev : prev + (wasLiked ? -1 : 1)));
    
    if (!wasLiked) {
      // Spawn floating hearts
      const heartId = Date.now();
      setFloatingHearts((prev) => [...prev, { id: heartId, x: Math.random() * 40 - 20 }]);
      setTimeout(() => {
        setFloatingHearts((prev) => prev.filter((h) => h.id !== heartId));
      }, 1000);
    }

    try {
      await toggleLike(post.id, currentUsername);
    } catch {
      setLiked(wasLiked);
      setLikeCount((prev) => (prev === null ? prev : prev + (wasLiked ? 1 : -1)));
    }
  };

  const loadComments = async () => {
    if (showComments) {
      setShowComments(false);
      return;
    }
    setShowComments(true);
    if (comments === null) {
      setLoadingComments(true);
      try {
        const data = await getComments(post.id);
        setComments(data);
      } finally {
        setLoadingComments(false);
      }
    }
  };

  const handleAddComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const newComment = await addComment(post.id, currentUsername, commentText);
    setComments((prev) => (prev ? [...prev, newComment] : [newComment]));
    setCommentText('');
  };

  const handleSaveEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editContent.trim()) return;
    setSaving(true);
    try {
      const updated = await updatePost(post.id, currentUsername, editContent, editImageUrl || undefined);
      onUpdated?.(updated);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    await deletePost(post.id, currentUsername);
    onDeleted?.(post.id);
  };

  const initial = post.author.username.charAt(0).toUpperCase();

  return (
    <CardTilt className="mb-6">
      <div className="glass-card rounded-3xl overflow-hidden border border-white/10 dark:border-dark-border shadow-xl relative">
        
        {/* Floating Heart Blast Container */}
        <div className="absolute left-6 bottom-16 pointer-events-none z-20">
          {floatingHearts.map((heart) => (
            <motion.span
              key={heart.id}
              initial={{ opacity: 1, y: 0, x: heart.x, scale: 0.8 }}
              animate={{ opacity: 0, y: -100, scale: 1.5, rotate: heart.x }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute text-red-500 text-2xl"
            >
              ❤️
            </motion.span>
          ))}
        </div>

        {/* Post Header */}
        <div className="flex items-center gap-3 p-5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white flex-shrink-0 overflow-hidden shadow-sm">
            {post.author.profilePictureUrl ? (
              <img src={post.author.profilePictureUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              initial
            )}
          </div>
          <div className="flex-1">
            <Link
              to={`/profile/${post.author.username}`}
              className="text-gray-900 dark:text-dark-text-primary font-bold text-sm hover:text-purple-400 transition"
            >
              {post.author.username}
            </Link>
            <p className="text-gray-400 dark:text-dark-text-secondary text-xs mt-0.5">{new Date(post.createdAt).toLocaleDateString()} {new Date(post.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
          </div>

          {isOwner && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="text-gray-400 dark:text-dark-text-secondary hover:text-gray-900 dark:hover:text-dark-text-primary transition cursor-pointer"
                aria-label="Post options"
              >
                <MoreHorizontal size={18} />
              </button>
              
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-32 glass-card rounded-2xl shadow-xl z-20 overflow-hidden border border-white/10 dark:border-dark-border"
                  >
                    <button
                      onClick={() => {
                        setEditing(true);
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-gray-700 dark:text-dark-text-secondary hover:bg-purple-500/10 hover:text-purple-400 transition cursor-pointer"
                    >
                      Edit Post
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        handleDelete();
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-red-500 hover:bg-red-500/10 transition cursor-pointer"
                    >
                      Delete
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Post Editing State */}
        {editing ? (
          <form onSubmit={handleSaveEdit} className="px-5 pb-5 space-y-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={3}
              className="w-full bg-white/5 dark:bg-dark-card border border-white/10 dark:border-dark-border text-gray-900 dark:text-dark-text-primary rounded-2xl px-4 py-3 outline-none focus:ring-1 focus:ring-purple-500 resize-none text-sm"
            />
            <ImageUploadInput value={editImageUrl} onChange={setEditImageUrl} />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="text-xs px-4 py-2 rounded-xl text-gray-500 dark:text-dark-text-secondary hover:bg-white/5 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="text-xs px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold cursor-pointer disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* Post Content */}
            <div className="px-5 pb-4">
              <p className="text-gray-800 dark:text-dark-text-primary text-sm leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>

            {/* Media Attachment */}
            {post.imageUrl && (
              <div className="relative border-y border-white/5 overflow-hidden">
                {isVideoUrl(post.imageUrl) ? (
                  <video
                    src={post.imageUrl}
                    controls
                    className="w-full max-h-[450px] bg-black/40 object-contain"
                  />
                ) : (
                  <div className="w-full max-h-[450px] bg-black/10 dark:bg-black/40 flex items-center justify-center overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt="Post attachment"
                      className="w-full max-h-[450px] object-contain hover:scale-105 transition duration-700"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Micro-interaction Footer Buttons */}
            <div className="flex items-center justify-between px-5 py-4 border-t border-white/5 dark:border-dark-border">
              <div className="flex items-center gap-5">
                {/* Like Button */}
                <motion.button
                  onClick={handleLike}
                  whileTap={{ scale: 0.8 }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-dark-text-secondary hover:text-red-500 cursor-pointer transition"
                >
                  <Heart
                    size={18}
                    className={`transition-colors ${liked ? 'fill-red-500 text-red-500' : ''}`}
                  />
                  <span>{likeCount ?? 0}</span>
                </motion.button>

                {/* Comment Button */}
                <motion.button
                  onClick={loadComments}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-purple-500 cursor-pointer transition"
                >
                  <MessageCircle size={18} />
                  <span>Comments</span>
                </motion.button>

                {/* Share Button */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
                    alert('Post link copied to clipboard!');
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-blue-500 cursor-pointer transition"
                  aria-label="Share post"
                >
                  <Share2 size={18} />
                </motion.button>
              </div>

              {/* Bookmark Save Button */}
              <motion.button
                onClick={() => setSaved(!saved)}
                whileTap={{ scale: 0.8 }}
                className="text-gray-500 dark:text-gray-400 hover:text-yellow-500 transition cursor-pointer"
                aria-label="Save post"
              >
                <Bookmark size={18} className={saved ? 'fill-yellow-500 text-yellow-500' : ''} />
              </motion.button>
            </div>

            {/* Comment Drawer (Framer Motion Drawer) */}
            <AnimatePresence>
              {showComments && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, type: 'spring', damping: 20 }}
                  className="overflow-hidden border-t border-white/5"
                >
                  <div className="bg-white/10 dark:bg-black/10 px-5 py-4 space-y-4">
                    {loadingComments && (
                      <p className="text-gray-400 text-xs animate-pulse">Loading comments...</p>
                    )}

                    {comments && comments.length > 0 && (
                      <div className="space-y-3.5 max-h-52 overflow-y-auto pr-1">
                        {comments.map((c) => (
                          <div key={c.id} className="text-xs flex gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white overflow-hidden flex-shrink-0">
                              {c.author.profilePictureUrl ? (
                                <img src={c.author.profilePictureUrl} alt="" className="w-full h-full object-cover" />
                              ) : (
                                c.author.username.charAt(0).toUpperCase()
                              )}
                            </div>
                            <div className="flex-1 bg-white/5 dark:bg-dark-card rounded-2xl px-3 py-2 border border-white/5 dark:border-dark-border">
                              <div className="flex justify-between items-center mb-0.5">
                                <span className="font-bold text-gray-900 dark:text-dark-text-primary">
                                  {c.author.username}
                                </span>
                                <span className="text-[10px] text-gray-400 dark:text-dark-text-secondary">
                                  {new Date(c.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-gray-700 dark:text-dark-text-secondary leading-normal">
                                {c.content}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {comments?.length === 0 && (
                      <p className="text-gray-400 text-xs text-center">No comments yet. Share your thoughts!</p>
                    )}

                    {/* New Comment Form */}
                    <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="flex-1 bg-white/5 dark:bg-dark-card border border-white/10 dark:border-dark-border text-gray-900 dark:text-dark-text-primary text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-purple-500 transition-colors"
                      />
                      <button
                        type="submit"
                        className="p-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:opacity-95 transition cursor-pointer flex items-center justify-center"
                        aria-label="Submit comment"
                      >
                        <Send size={14} />
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </CardTilt>
  );
}