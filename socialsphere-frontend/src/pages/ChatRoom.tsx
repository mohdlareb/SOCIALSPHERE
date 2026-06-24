import { useState, useEffect, useRef } from 'react';
import type { FormEvent } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useChatSocket } from '../hooks/useChatSocket';
import { getRoomMessages, deleteRoom, getAllRooms } from '../api/roomApi';
import { Trash2 } from 'lucide-react';


export default function ChatRoom() {
  const [isCreator, setIsCreator] = useState(false);
  const { roomId } = useParams<{ roomId: string }>();
  const { username } = useAuth();
  const numericRoomId = Number(roomId);
  const { messages, setMessages, connected, sendMessage } = useChatSocket(numericRoomId);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getRoomMessages(numericRoomId).then(setMessages);
  }, [numericRoomId, setMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  useEffect(() => {
  if (!username) return;
  getAllRooms().then((rooms) => {
    const room = rooms.find((r) => r.id === numericRoomId);
    setIsCreator(room?.creator.username === username);
  });
}, [numericRoomId, username]);

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !username) return;
    sendMessage(username, input);
    setInput('');
  };
  const handleDeleteRoom = async () => {
  if (!username) return;
  if (!window.confirm('Delete this room? This cannot be undone.')) return;
  await deleteRoom(numericRoomId, username);
  navigate('/rooms');
};

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] sm:h-[calc(100vh-120px)]">
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3 mb-3">
        <Link to="/rooms" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm">
          ← Back to rooms
        </Link>
        <div className="flex items-center gap-3">
          <span className={`text-xs ${connected ? 'text-green-400' : 'text-gray-500'}`}>
            {connected ? '● Connected' : '○ Connecting...'}
          </span>
          {isCreator && (
            <button onClick={handleDeleteRoom} className="text-gray-400 hover:text-red-500 transition" aria-label="Delete room">
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.map((msg) => {
          const isMine = msg.sender.username === username;
          return (
            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                  isMine
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                }`}
              >
                {!isMine && (
                  <p className="text-xs font-semibold text-purple-500 dark:text-purple-300 mb-0.5">{msg.sender.username}</p>
                )}
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-800 mt-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg px-5 py-2 hover:opacity-90 transition disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}