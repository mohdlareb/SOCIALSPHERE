import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import type { User } from '../types';

interface FollowListModalProps {
  title: string;
  users: User[];
  onClose: () => void;
}

export default function FollowListModal({ title, users, onClose }: FollowListModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center px-4">
      <div className="w-full max-w-sm glass-card rounded-2xl shadow-xl max-h-[70vh] flex flex-col overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-gray-200/50 dark:border-dark-border px-4 py-3">
          <h2 className="font-semibold text-gray-900 dark:text-dark-text-primary">{title}</h2>
          <button onClick={onClose} className="text-gray-500 dark:text-dark-text-secondary hover:text-gray-900 dark:hover:text-dark-text-primary cursor-pointer">
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto p-2">
          {users.length === 0 ? (
            <p className="text-gray-500 text-sm text-center p-4">No one here yet.</p>
          ) : (
            users.map((user) => {
              const initial = user.username.charAt(0).toUpperCase();
              return (
                <Link
                  key={user.id}
                  to={`/profile/${user.username}`}
                  onClick={onClose}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-border/40 transition"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white flex-shrink-0 overflow-hidden">
                    {user.profilePictureUrl ? (
                      <img src={user.profilePictureUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      initial
                    )}
                  </div>
                  <p className="text-gray-900 dark:text-dark-text-primary text-sm font-medium">{user.username}</p>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}