import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, User, Mail, Lock, CheckCircle2, ChevronRight } from 'lucide-react';
import { mockDb } from '../utils/mockDb';

const AVAILABLE_VIBES = [
  { id: 'tech', label: 'Tech & Gadgets', emoji: '💻' },
  { id: 'design', label: '3D Design & UI/UX', emoji: '🎨' },
  { id: 'ai', label: 'AI & Cybernetics', emoji: '🤖' },
  { id: 'gaming', label: 'Gaming Worlds', emoji: '🎮' },
  { id: 'tokyo', label: 'Neon Tokyo', emoji: '🗼' },
  { id: 'space', label: 'Cosmic Science', emoji: '🌌' }
];

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80'
];

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Onboarding steps: 1 = Credentials, 2 = Vibes Picker, 3 = Avatar Selection
  const [step, setStep] = useState(1);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0]);
  const [customBio, setCustomBio] = useState('');

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleCredentialsSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password.trim()) return;
    setError('');
    setLoading(true);
    try {
      await signup(username, email, password);
      // Advance to Vibes picking!
      setStep(2);
    } catch {
      setError('Could not create account. Username may be taken.');
    } finally {
      setLoading(false);
    }
  };

  const toggleVibe = (vibeId: string) => {
    setSelectedVibes((prev) =>
      prev.includes(vibeId) ? prev.filter((id) => id !== vibeId) : [...prev, vibeId]
    );
  };

  const handleFinishOnboarding = () => {
    // Save selections locally in mockDb profile
    const currentBio = customBio || `Exploring the Sphere. Vibe matches: ${selectedVibes.join(', ')} ✨`;
    mockDb.updateProfile(username, currentBio, selectedAvatar);
    
    // Complete onboarding and redirect
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-gray-900 dark:text-white flex items-center justify-center px-4 relative overflow-hidden bg-mesh-light dark:bg-mesh-dark transition-colors duration-300">
      {/* Floating Animated Ambient Elements */}
      <motion.div
        className="absolute w-72 h-72 rounded-full bg-purple-600/10 blur-3xl"
        animate={{
          x: [0, 80, 0],
          y: [0, -50, 0]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        style={{ top: '20%', left: '10%' }}
      />
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-pink-600/10 blur-3xl"
        animate={{
          x: [0, -60, 0],
          y: [0, 80, 0]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        style={{ bottom: '15%', right: '10%' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="w-full max-w-md glass-card rounded-3xl p-8 relative z-10 overflow-hidden"
      >
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-semibold mb-3"
          >
            <Sparkles size={12} />
            <span>Create Profile</span>
          </motion.div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 bg-clip-text text-transparent animate-mesh-bg bg-[length:200%_200%]">
              SocialSphere
            </span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            {step === 1 && 'Create your futuristic social profile'}
            {step === 2 && 'Choose your vibes to customize your sphere'}
            {step === 3 && 'Pick your identity avatar'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="credentials"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                <div className="relative">
                  <User size={18} className="absolute left-3.5 top-3.5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full glass-input rounded-2xl pl-10 pr-4 py-3.5 outline-none focus:border-purple-500 transition-colors placeholder-gray-500"
                  />
                </div>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-3.5 text-gray-500" />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full glass-input rounded-2xl pl-10 pr-4 py-3.5 outline-none focus:border-purple-500 transition-colors placeholder-gray-500"
                  />
                </div>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-3.5 text-gray-500" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full glass-input rounded-2xl pl-10 pr-4 py-3.5 outline-none focus:border-purple-500 transition-colors placeholder-gray-500"
                  />
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm text-center font-medium"
                  >
                    {error}
                  </motion.p>
                )}

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white font-bold rounded-2xl py-3.5 hover:shadow-lg hover:shadow-purple-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    'Initiating Core...'
                  ) : (
                    <>
                      <span>Sign Up & Continue</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </motion.button>
              </form>

              <p className="text-center text-gray-400 text-xs mt-6">
                Already have an account?{' '}
                <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold hover:underline">
                  Log in
                </Link>
              </p>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="vibes"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-3">
                {AVAILABLE_VIBES.map((vibe) => {
                  const isSelected = selectedVibes.includes(vibe.id);
                  return (
                    <motion.button
                      key={vibe.id}
                      onClick={() => toggleVibe(vibe.id)}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className={`p-3.5 rounded-2xl flex flex-col items-center gap-2 border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500 text-purple-600 dark:text-purple-300 neon-glow-purple'
                          : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/10'
                      }`}
                    >
                      <span className="text-2xl">{vibe.emoji}</span>
                      <span className="text-xs font-semibold text-center">{vibe.label}</span>
                    </motion.button>
                  );
                })}
              </div>

              <motion.button
                onClick={() => setStep(3)}
                disabled={selectedVibes.length === 0}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-2xl py-3.5 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
              >
                <span>Continue</span>
                <ChevronRight size={18} />
              </motion.button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="avatar"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-purple-500 via-pink-500 to-indigo-500 overflow-hidden shadow-xl shadow-purple-500/10">
                  <img
                    src={selectedAvatar}
                    alt="Preview avatar"
                    className="w-full h-full object-cover rounded-full bg-gray-800"
                  />
                  <div className="absolute bottom-1 right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-slate-50 dark:border-[#0B0F19] flex items-center justify-center">
                    <CheckCircle2 size={10} className="text-white" />
                  </div>
                </div>

                <div className="flex gap-2 justify-center py-2">
                  {PRESET_AVATARS.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedAvatar(url)}
                      className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedAvatar === url ? 'border-purple-500 scale-110' : 'border-white/10 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="Set your status bio (optional)..."
                  value={customBio}
                  onChange={(e) => setCustomBio(e.target.value)}
                  className="w-full glass-input rounded-2xl px-4 py-3 outline-none focus:border-purple-500 transition-colors text-sm text-center placeholder-gray-500"
                />
              </div>

              <motion.button
                onClick={handleFinishOnboarding}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white font-bold rounded-2xl py-3.5 hover:shadow-lg hover:shadow-purple-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Launch Experience</span>
                <Sparkles size={18} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}