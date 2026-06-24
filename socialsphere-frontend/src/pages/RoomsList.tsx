import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import type { EchoRoom } from '../types';
import { Trash2 } from 'lucide-react';
import { getAllRooms, createRoom, joinRoom, deleteRoom } from '../api/roomApi';

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
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Echo Rooms 🔊</h1>

      <form onSubmit={handleCreate} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 mb-6 space-y-3">
        <input
          type="text"
          placeholder="Room name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          disabled={creating || !name.trim()}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg px-5 py-2 hover:opacity-90 transition disabled:opacity-50"
        >
          {creating ? 'Creating...' : 'Create Room'}
        </button>
      </form>

      {loading && <p className="text-gray-500 text-center">Loading rooms...</p>}
      {!loading && rooms.length === 0 && (
        <p className="text-gray-500 text-center">No rooms yet. Create the first one!</p>
      )}

      <div className="space-y-3">
        {rooms.map((room) => (
          <div
  key={room.id}
  onClick={() => handleEnter(room)}
  className="w-full text-left bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:border-purple-400 dark:hover:border-purple-500 transition flex items-center justify-between cursor-pointer"
>
          <div>
            <p className="text-gray-900 dark:text-white font-semibold">{room.name}</p>
            {room.description && <p className="text-gray-500 dark:text-gray-400 text-sm">{room.description}</p>}
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Created by {room.creator.username}</p>
          </div>
          <div className="flex items-center gap-3">
            {room.creator.username === username && (
              <button
                onClick={(e) => handleDelete(e, room.id)}
                className="text-gray-400 hover:text-red-500 transition"
                aria-label="Delete room"
              >
                <Trash2 size={18} />
              </button>
            )}
            <span className="text-purple-500 dark:text-purple-400 text-sm">Enter →</span>
          </div>
        </div>
        ))}
      </div>
    </div>
  );
}