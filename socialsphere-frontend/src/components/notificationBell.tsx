import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/useAuth';
import { getNotifications, getUnreadCount, markAllRead } from '../api/notificationApi';
import type { NotificationItem } from '../types';
import { Bell } from 'lucide-react';

export default function NotificationBell() {
  const { username } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!username) return;
    const poll = () => {
      getUnreadCount(username).then(setUnreadCount).catch(() => {});
    };
    poll();
    const interval = setInterval(poll, 10000);
    return () => clearInterval(interval);
  }, [username]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpen = async () => {
    if (!username) return;
    const willOpen = !open;
    setOpen(willOpen);
    if (willOpen) {
      const data = await getNotifications(username);
      setNotifications(data);
      if (unreadCount > 0) {
        await markAllRead(username);
        setUnreadCount(0);
      }
    }
  };

  const describe = (n: NotificationItem) => {
  if (n.type === 'LIKE') return `${n.actorUsername} liked your post`;
  if (n.type === 'COMMENT') return `${n.actorUsername} commented on your post`;
  if (n.type === 'FOLLOW') return `${n.actorUsername} started following you`;
  return `${n.actorUsername} interacted with your post`;
};

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={handleOpen} className="relative text-lg" aria-label="Notifications">
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl shadow-xl max-h-96 overflow-y-auto z-50">
          <div className="p-3 border-b border-gray-200 dark:border-dark-border">
            <p className="font-semibold text-sm text-gray-900 dark:text-[#F9FAFB]">Notifications</p>
          </div>
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-sm p-4 text-center">No notifications yet.</p>
          ) : (
            notifications.map((n) => {
              const initial = n.actorUsername.charAt(0).toUpperCase();
              return (
                <div
                   key={n.id}
                   className="flex items-center gap-3 p-3 border-b border-gray-100 dark:border-dark-border last:border-0"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white overflow-hidden flex-shrink-0">
                    {n.actorProfilePictureUrl ? (
                      <img src={n.actorProfilePictureUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      initial
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 dark:text-dark-text-primary">{describe(n)}</p>
                    <p className="text-xs text-gray-400 dark:text-dark-text-secondary">{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}