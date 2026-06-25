import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import type { EchoRoom } from '../types';
import { Trash2, MessageSquare, Plus, ArrowRight, Radio } from 'lucide-react';
import { getAllRooms, createRoom, joinRoom, deleteRoom } from '../api/roomApi';
// framer-motion is optional; remove dependency to avoid build/type issues
import CardTilt from '../components/CardTilt';

export default function RoomsList() {
  const { username } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<EchoRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    getAllRooms()
      .then(setRooms)
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!username || !name.trim()) return;
    setCreating(true);
    try {
      const room = await createRoom(username, name, description);
      setRooms((prev) => [room, ...prev]);
      setName('');
      setDescription('');
    } finally {
      setCreating(false);
    }
  };

  const handleEnter = async (room: EchoRoom) => {
    if (!username) return;
    await joinRoom(room.id, username).catch(() => {});
    navigate(`/rooms/${room.id}`);
  };

  const handleDelete = async (e: React.MouseEvent, roomId: number) => {
    e.stopPropagation();
    if (!username) return;
    if (!window.confirm('Delete this room? This cannot be undone.')) return;
    await deleteRoom(roomId, username);
    setRooms((prev) => prev.filter((r) => r.id !== roomId));
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary flex items-center gap-2 select-none">
        <Radio size={22} className="text-purple-500 animate-pulse" />
        <span>Echo Chat Rooms</span>
      </h1>

      {/* Glassmorphic Room Creation Form */}
      <form
        onSubmit={handleCreate}
        className="glass-card rounded-3xl p-5 border border-white/10 shadow-xl space-y-3"
      >
        <h3 className="text-xs font-bold text-gray-400 dark:text-dark-text-secondary uppercase tracking-wide flex items-center gap-1.5">
          <Plus size={14} className="text-purple-400" />
          <span>Broadcast New Channel</span>
        </h3>
        
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Channel Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/40 dark:bg-dark-card/50 text-gray-900 dark:text-dark-text-primary rounded-xl px-4 py-2.5 outline-none border border-gray-200 dark:border-dark-border focus:border-purple-500 text-xs transition-colors"
          />
          <input
            type="text"
            placeholder="Short Description (Vibe status...)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white/40 dark:bg-dark-card/50 text-gray-900 dark:text-dark-text-primary rounded-xl px-4 py-2.5 outline-none border border-gray-200 dark:border-dark-border focus:border-purple-500 text-xs transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={creating || !name.trim()}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl px-4 py-2 text-xs hover:opacity-95 shadow-md shadow-purple-500/10 cursor-pointer disabled:opacity-40 transition"
        >
          {creating ? 'Broadcasting...' : 'Launch Channel'}
        </button>
      </form>

      {/* Loading state indicator */}
      {loading && (
        <p className="text-gray-500 dark:text-dark-text-secondary text-xs text-center py-6 animate-pulse">Syncing Echo Frequencies...</p>
      )}
      
      {!loading && rooms.length === 0 && (
        <p className="text-gray-500 dark:text-dark-text-secondary text-xs text-center py-6">No active channels. Create the first one above!</p>
      )}

      {/* Rooms Grid list */}
      <div className="space-y-4">
        {rooms.map((room) => (
          <div key={room.id}>
            <CardTilt>
              <div
                onClick={() => handleEnter(room)}
                className="w-full text-left bg-white/40 dark:bg-dark-card border border-gray-200/50 dark:border-dark-border rounded-2xl p-5 hover:border-purple-500/30 transition-all flex items-center justify-between cursor-pointer shadow-md select-none relative group"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl flex-shrink-0 mt-0.5">
                    <MessageSquare size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-gray-900 dark:text-dark-text-primary font-bold text-sm truncate group-hover:text-purple-400 transition-colors">
                      {room.name}
                    </p>
                    {room.description && (
                      <p className="text-gray-400 dark:text-dark-text-secondary text-xs mt-0.5 truncate leading-relaxed">
                        {room.description}
                      </p>
                    )}
                    <p className="text-gray-500 dark:text-dark-text-secondary text-[10px] mt-2">
                      Hosted by <span className="font-semibold text-gray-700 dark:text-dark-text-primary">@{room.creator.username}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 flex-shrink-0 z-10 pl-2">
                  {room.creator.username === username && (
                    <button
                      onClick={(e) => handleDelete(e, room.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition hover:bg-red-500/10 rounded-xl cursor-pointer"
                      aria-label="Delete room"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  <span className="text-purple-400 font-bold text-xs flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                    <span>Enter</span>
                    <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </CardTilt>
          </div>
        ))}
      </div>

    </div>
  );
}