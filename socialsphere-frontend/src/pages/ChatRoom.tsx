import { useState, useEffect, useRef } from 'react';
import type { FormEvent } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useChatSocket } from '../hooks/useChatSocket';
import { getRoomMessages, deleteRoom, getAllRooms } from '../api/roomApi';
import { Trash2, Send } from 'lucide-react';
import { mockDb } from '../utils/mockDb';
import type { ChatMessage } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatRoom() {
  const [isCreator, setIsCreator] = useState(false);
  const { roomId } = useParams<{ roomId: string }>();
  const { username } = useAuth();
  const numericRoomId = Number(roomId);
  const { messages, setMessages, connected, sendMessage } = useChatSocket(numericRoomId);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState('Echo Room');

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
      if (room) {
        setRoomName(room.name);
        setIsCreator(room.creator.username === username);
      }
    });
  }, [numericRoomId, username]);

  // Listen to simulated AI replies (when offline fallback is active)
  useEffect(() => {
    const handleNewMessage = (e: Event) => {
      const customEvent = e as CustomEvent<{ roomId: number; message: ChatMessage }>;
      if (customEvent.detail.roomId === numericRoomId) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === customEvent.detail.message.id)) return prev;
          return [...prev, customEvent.detail.message];
        });
      }
    };
    window.addEventListener('ss_new_message', handleNewMessage);
    return () => window.removeEventListener('ss_new_message', handleNewMessage);
  }, [numericRoomId, setMessages]);

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !username) return;

    if (connected) {
      sendMessage(username, input);
    } else {
      // Offline mock fallback: append user message & schedule automated reply
      console.log('Sending message via offline mock fallback channel');
      const newMsg = mockDb.addRoomMessage(numericRoomId, username, input);
      setMessages((prev) => [...prev, newMsg]);
    }
    
    setInput('');
  };

  const handleDeleteRoom = async () => {
    if (!username) return;
    if (!window.confirm('Delete this room? This cannot be undone.')) return;
    await deleteRoom(numericRoomId, username);
    navigate('/rooms');
  };

  return (
    <div className="glass-card rounded-3xl p-5 border border-white/10 shadow-xl flex flex-col h-[calc(100vh-210px)] sm:h-[calc(100vh-160px)] relative overflow-hidden select-none">
      
      {/* Decors */}
      <div className="absolute -top-12 -left-12 w-28 h-28 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header Info Panel */}
      <div className="flex items-center justify-between border-b border-gray-200/50 dark:border-dark-border pb-4 mb-4 relative z-10">
        <div>
          <Link to="/rooms" className="text-purple-400 hover:text-purple-300 text-xs font-semibold">
            ← Back to Rooms
          </Link>
          <h2 className="text-md font-extrabold text-gray-900 dark:text-dark-text-primary mt-1 flex items-center gap-1.5">
            <span>{roomName}</span>
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/40 dark:bg-dark-card rounded-full border border-gray-200 dark:border-dark-border">
            {/* Pulsing indicator ring */}
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                connected ? 'bg-green-400' : 'bg-orange-400'
              }`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                connected ? 'bg-green-500' : 'bg-orange-500'
              }`} />
            </span>
            <span className="text-[10px] text-gray-600 dark:text-dark-text-secondary font-bold">
              {connected ? 'STOMP Real-time' : 'Simulated DB'}
            </span>
          </div>

          {isCreator && (
            <button
              onClick={handleDeleteRoom}
              className="p-2 text-gray-400 hover:text-red-500 transition hover:bg-red-500/10 rounded-xl cursor-pointer"
              aria-label="Delete room"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Messages Scrolling Container */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1.5 scrollbar-hide py-2 relative z-10">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isMine = msg.sender.username === username;
            const initial = msg.sender.username.charAt(0).toUpperCase();
            
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', damping: 20, stiffness: 350 }}
                className={`flex gap-2.5 items-end ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                {/* Avatar for other users */}
                {!isMine && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden flex-shrink-0 shadow-sm">
                    {msg.sender.profilePictureUrl ? (
                      <img src={msg.sender.profilePictureUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      initial
                    )}
                  </div>
                )}

                {/* Message Bubble */}
                <div className={`max-w-[70%] space-y-1`}>
                  {!isMine && (
                    <span className="text-[9px] text-purple-400 font-bold px-1 block">@{msg.sender.username}</span>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-xs shadow-md border ${
                      isMine
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500/20'
                        : 'bg-white/40 dark:bg-dark-card text-gray-850 dark:text-dark-text-primary border-gray-200/60 dark:border-dark-border'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  <span className={`text-[8px] text-gray-400 dark:text-dark-text-secondary px-1.5 block ${isMine ? 'text-right' : 'text-left'}`}>
                    {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input Message Form */}
      <form onSubmit={handleSend} className="flex gap-2 pt-4 border-t border-gray-200/50 dark:border-dark-border mt-4 relative z-10">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a cosmic echo message..."
          className="flex-1 glass-input rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-purple-500 text-xs"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="p-3 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white rounded-xl hover:opacity-95 transition flex items-center justify-center cursor-pointer disabled:opacity-40"
          aria-label="Send message"
        >
          <Send size={14} />
        </button>
      </form>

    </div>
  );
}