import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import type { Story } from '../types';
import AddStoryModal from './AddStoryModal';

interface StoriesBarProps {
  stories: Story[];
  currentUsername: string;
  onSelectUser: (username: string) => void;
  onStoryAdded: () => void;
}

interface StoryGroup {
  username: string;
  profilePictureUrl: string | null;
  latestAt: string;
}

export default function StoriesBar({ stories, currentUsername, onSelectUser, onStoryAdded }: StoriesBarProps) {
  const [showAddModal, setShowAddModal] = useState(false);

  const { ownGroup, otherGroups } = useMemo(() => {
    const map = new Map<string, StoryGroup>();
    stories.forEach((s) => {
      const existing = map.get(s.author.username);
      if (!existing || new Date(s.createdAt) > new Date(existing.latestAt)) {
        map.set(s.author.username, {
          username: s.author.username,
          profilePictureUrl: s.author.profilePictureUrl,
          latestAt: s.createdAt,
        });
      }
    });
    const all = Array.from(map.values());
    return {
      ownGroup: all.find((g) => g.username === currentUsername) ?? null,
      otherGroups: all
        .filter((g) => g.username !== currentUsername)
        .sort((a, b) => new Date(b.latestAt).getTime() - new Date(a.latestAt).getTime()),
    };
  }, [stories, currentUsername]);

  const ringFor = (hasStory: boolean) =>
    hasStory
      ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400'
      : 'bg-gray-300 dark:bg-dark-border';

  return (
    <>
      <div className="flex gap-4 overflow-x-auto pb-4 mb-6 border-b border-gray-200 dark:border-dark-border scrollbar-hide">
        <button
          onClick={() => (ownGroup ? onSelectUser(currentUsername) : setShowAddModal(true))}
          className="flex flex-col items-center gap-1.5 flex-shrink-0"
        >
          <div className={`w-16 h-16 rounded-full p-[2px] relative ${ringFor(!!ownGroup)}`}>
            <div className="w-full h-full rounded-full bg-white dark:bg-dark-bg p-0.5">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center overflow-hidden">
                {currentUsername.charAt(0).toUpperCase()}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAddModal(true);
              }}
              className="absolute -bottom-0.5 -right-0.5 bg-purple-500 text-white rounded-full p-1 border-2 border-white dark:border-dark-bg"
              aria-label="Add story"
            >
              <Plus size={12} />
            </button>
          </div>
          <span className="text-xs text-gray-600 dark:text-dark-text-secondary">Your story</span>
        </button>

        {otherGroups.map((story) => {
          const initial = story.username.charAt(0).toUpperCase();
          return (
            <button
              key={story.username}
              onClick={() => onSelectUser(story.username)}
              className="flex flex-col items-center gap-1.5 flex-shrink-0"
            >
              <div className={`w-16 h-16 rounded-full p-[2px] ${ringFor(true)}`}>
                <div className="w-full h-full rounded-full bg-white dark:bg-dark-bg p-0.5">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center overflow-hidden">
                    {story.profilePictureUrl ? (
                      <img src={story.profilePictureUrl} alt={story.username} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-bold text-lg">{initial}</span>
                    )}
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-600 dark:text-dark-text-secondary max-w-[64px] truncate">{story.username}</span>
            </button>
          );
        })}
      </div>

      {showAddModal && (
        <AddStoryModal
          username={currentUsername}
          onClose={() => setShowAddModal(false)}
          onCreated={onStoryAdded}
        />
      )}
    </>
  );
}