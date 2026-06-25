import type { User, Post, Comment, EchoRoom, ChatMessage, NotificationItem, FollowCounts, Story } from '../types';

// Helper to get or initialize state in localstorage
function getStorageItem<T>(key: string, defaultValue: T): T {
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    return JSON.parse(stored) as T;
  } catch {
    return defaultValue;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Initial mock data
const INITIAL_USERS: User[] = [
  {
    id: 101,
    username: 'alex_cosmos',
    email: 'alex@cosmos.design',
    bio: 'Building next-gen spatial interfaces. Designing the future of computing. 🌌✨',
    profilePictureUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 102,
    username: 'elena_pixels',
    email: 'elena@pixels.io',
    bio: 'Sculpting light and shadows in digital spaces. 🎨 Blender & WebGL enthusiast.',
    profilePictureUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 103,
    username: 'cyber_nomad',
    email: 'nomad@cyber.net',
    bio: 'Wandering through decentralized webs and neon cities. 🎒💻 Coffee & Cyberpunk.',
    profilePictureUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 104,
    username: 'aurora_codes',
    email: 'aurora@creativecoding.dev',
    bio: 'Turning pixels into interactive poetry. Framer Motion is my playground. 💻💜',
    profilePictureUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    content: `Just launched the prototype for the spatial glass UI. The backdrop filter feels incredibly premium. Let me know what you think of the glassmorphic side nav! 🌌💻

#UXDesign #SpatialComputing #CreativeCoding #Glassmorphism`,
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    author: INITIAL_USERS[0]
  },
  {
    id: 2,
    content: `Fresh 3D render of a glassmorphic orb. The light refraction and dispersion calculations took forever in Blender, but the glowing highlights look absolutely magical. ✨💎`,
    imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    author: INITIAL_USERS[1]
  },
  {
    id: 3,
    content: `Late night walks under the neon lights of Tokyo. There's something magical about rainy nights, street reflections, and lo-fi vibes. 🌧️🗼🤖`,
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    author: INITIAL_USERS[2]
  },
  {
    id: 4,
    content: `Animating components should feel organic, not robotic. Remember: Springs > Linear/Ease curves! Framer motion makes layout animations feel incredibly fluid. Let's make every micro-interaction tell a story. 🦄📈`,
    imageUrl: null,
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    author: INITIAL_USERS[3]
  }
];

const INITIAL_COMMENTS: Record<number, Comment[]> = {
  1: [
    {
      id: 201,
      content: 'This glass effect is pure gold! How is the responsiveness on mobile?',
      createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
      author: INITIAL_USERS[1]
    },
    {
      id: 202,
      content: 'Absolutely stunning. I love the soft gradients in the background.',
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      author: INITIAL_USERS[3]
    }
  ],
  2: [
    {
      id: 203,
      content: 'Woah, the color dispersion inside the glass is next level. Tutorial soon?',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      author: INITIAL_USERS[0]
    }
  ],
  3: [
    {
      id: 204,
      content: 'Takes me back to my trip last winter. Tokyo is unbeatable.',
      createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
      author: INITIAL_USERS[0]
    }
  ]
};

const INITIAL_STORIES: Story[] = [
  {
    id: 301,
    author: INITIAL_USERS[0],
    imageUrl: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=400&q=80',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 302,
    author: INITIAL_USERS[1],
    imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=400&q=80',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 303,
    author: INITIAL_USERS[2],
    imageUrl: 'https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?auto=format&fit=crop&w=400&q=80',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  }
];

const INITIAL_ROOMS: EchoRoom[] = [
  {
    id: 401,
    name: 'Creative Coding & WebGL 🔊',
    description: 'Discuss shader programming, canvas animations, and web design mechanics.',
    creator: INITIAL_USERS[3],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 402,
    name: 'Futuristic UI/UX Design 🎨',
    description: 'Glassmorphism, Apple-level aesthetics, and premium interactions.',
    creator: INITIAL_USERS[0],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 403,
    name: 'Cyberpunk Tokyo Vibes 🗼',
    description: 'City photography, neon lights, and synthwave soundtracks.',
    creator: INITIAL_USERS[2],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const INITIAL_MESSAGES: Record<number, ChatMessage[]> = {
  401: [
    {
      id: 501,
      content: 'Welcome to the WebGL chat! Has anyone checked React Three Fiber with Tailwind 4?',
      sentAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      sender: INITIAL_USERS[3]
    },
    {
      id: 502,
      content: 'Yes! It integrates pretty well. The new build setup is fast.',
      sentAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      sender: INITIAL_USERS[1]
    }
  ],
  402: [
    {
      id: 503,
      content: 'Welcome! Share your premium UI/UX mockups here.',
      sentAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      sender: INITIAL_USERS[0]
    }
  ]
};

const INITIAL_NOTIFICATIONS: Record<string, NotificationItem[]> = {
  // mapped by username
};

export const mockDb = {
  // --- USERS ---
  getUsers(): User[] {
    return getStorageItem<User[]>('ss_users', INITIAL_USERS);
  },

  getCurrentUser(username: string): User {
    const users = this.getUsers();
    let user = users.find((u) => u.username === username);
    if (!user) {
      // Create user on the fly if needed
      user = {
        id: Math.floor(Math.random() * 10000),
        username,
        email: `${username}@socialsphere.com`,
        bio: 'Premium SocialSphere Enthusiast ✨',
        profilePictureUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80',
        createdAt: new Date().toISOString()
      };
      users.push(user);
      setStorageItem('ss_users', users);
    }
    return user;
  },

  updateProfile(username: string, bio: string, profilePictureUrl: string): User {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.username === username);
    const updated = {
      ...this.getCurrentUser(username),
      bio,
      profilePictureUrl: profilePictureUrl || null
    };

    if (idx !== -1) {
      users[idx] = updated;
    } else {
      users.push(updated);
    }
    setStorageItem('ss_users', users);
    return updated;
  },

  searchUsers(query: string): User[] {
    const q = query.toLowerCase();
    return this.getUsers().filter((u) => u.username.toLowerCase().includes(q) || (u.bio && u.bio.toLowerCase().includes(q)));
  },

  // --- POSTS ---
  getPosts(): Post[] {
    return getStorageItem<Post[]>('ss_posts', INITIAL_POSTS);
  },

  createPost(username: string, content: string, imageUrl?: string): Post {
    const posts = this.getPosts();
    const author = this.getCurrentUser(username);
    const newPost: Post = {
      id: Date.now(),
      content,
      imageUrl: imageUrl || null,
      createdAt: new Date().toISOString(),
      author
    };
    posts.unshift(newPost);
    setStorageItem('ss_posts', posts);
    return newPost;
  },

  updatePost(postId: number, content: string, imageUrl?: string): Post {
    const posts = this.getPosts();
    const idx = posts.findIndex((p) => p.id === postId);
    if (idx === -1) throw new Error('Post not found');
    posts[idx] = {
      ...posts[idx],
      content,
      imageUrl: imageUrl || null
    };
    setStorageItem('ss_posts', posts);
    return posts[idx];
  },

  deletePost(postId: number): void {
    const posts = this.getPosts().filter((p) => p.id !== postId);
    setStorageItem('ss_posts', posts);
  },

  // --- LIKES ---
  // Store liked post IDs per username
  getLikes(username: string): number[] {
    return getStorageItem<number[]>(`ss_likes_${username}`, [2]); // pre-like Elena's post
  },

  toggleLike(postId: number, username: string): string {
    const likes = this.getLikes(username);
    const idx = likes.indexOf(postId);
    let action = '';
    if (idx === -1) {
      likes.push(postId);
      action = 'Liked';
      // Trigger notification to the author
      const post = this.getPosts().find((p) => p.id === postId);
      if (post && post.author.username !== username) {
        this.addNotification(post.author.username, {
          type: 'LIKE',
          actorUsername: username,
          actorProfilePictureUrl: this.getCurrentUser(username).profilePictureUrl,
          postId: post.id
        });
      }
    } else {
      likes.splice(idx, 1);
      action = 'Unliked';
    }
    setStorageItem(`ss_likes_${username}`, likes);
    
    // update cached like count
    const counts = getStorageItem<Record<number, number>>('ss_like_counts', { 1: 42, 2: 128, 3: 15, 4: 8 });
    const currentCount = counts[postId] || 0;
    counts[postId] = currentCount + (action === 'Liked' ? 1 : -1);
    setStorageItem('ss_like_counts', counts);

    return action;
  },

  getLikeCount(postId: number): number {
    const counts = getStorageItem<Record<number, number>>('ss_like_counts', { 1: 42, 2: 128, 3: 15, 4: 8 });
    return counts[postId] ?? 0;
  },

  // --- COMMENTS ---
  getComments(postId: number): Comment[] {
    const allComments = getStorageItem<Record<number, Comment[]>>('ss_comments', INITIAL_COMMENTS);
    return allComments[postId] || [];
  },

  addComment(postId: number, username: string, content: string): Comment {
    const allComments = getStorageItem<Record<number, Comment[]>>('ss_comments', INITIAL_COMMENTS);
    const author = this.getCurrentUser(username);
    const newComment: Comment = {
      id: Date.now(),
      content,
      createdAt: new Date().toISOString(),
      author
    };
    if (!allComments[postId]) {
      allComments[postId] = [];
    }
    allComments[postId].push(newComment);
    setStorageItem('ss_comments', allComments);

    // Trigger notification
    const post = this.getPosts().find((p) => p.id === postId);
    if (post && post.author.username !== username) {
      this.addNotification(post.author.username, {
        type: 'COMMENT',
        actorUsername: username,
        actorProfilePictureUrl: author.profilePictureUrl,
        postId: post.id
      });
    }

    return newComment;
  },

  // --- STORIES ---
  getStories(): Story[] {
    // filter out expired stories
    const now = new Date().getTime();
    const stories = getStorageItem<Story[]>('ss_stories', INITIAL_STORIES);
    const active = stories.filter((s) => new Date(s.expiresAt).getTime() > now);
    if (active.length !== stories.length) {
      setStorageItem('ss_stories', active);
    }
    return active;
  },

  createStory(username: string, imageUrl: string): Story {
    const stories = this.getStories();
    const author = this.getCurrentUser(username);
    const newStory: Story = {
      id: Date.now(),
      author,
      imageUrl,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
    stories.unshift(newStory);
    setStorageItem('ss_stories', stories);
    return newStory;
  },

  deleteStory(storyId: number): void {
    const stories = this.getStories().filter((s) => s.id !== storyId);
    setStorageItem('ss_stories', stories);
  },

  // --- ROOMS & MESSAGES ---
  getRooms(): EchoRoom[] {
    return getStorageItem<EchoRoom[]>('ss_rooms', INITIAL_ROOMS);
  },

  createRoom(username: string, name: string, description: string): EchoRoom {
    const rooms = this.getRooms();
    const creator = this.getCurrentUser(username);
    const newRoom: EchoRoom = {
      id: Date.now(),
      name,
      description: description || null,
      creator,
      createdAt: new Date().toISOString()
    };
    rooms.unshift(newRoom);
    setStorageItem('ss_rooms', rooms);
    return newRoom;
  },

  deleteRoom(roomId: number): void {
    const rooms = this.getRooms().filter((r) => r.id !== roomId);
    setStorageItem('ss_rooms', rooms);
  },

  getRoomMessages(roomId: number): ChatMessage[] {
    const msgs = getStorageItem<Record<number, ChatMessage[]>>('ss_messages', INITIAL_MESSAGES);
    return msgs[roomId] || [];
  },

  addRoomMessage(roomId: number, username: string, content: string): ChatMessage {
    const msgs = getStorageItem<Record<number, ChatMessage[]>>('ss_messages', INITIAL_MESSAGES);
    const sender = this.getCurrentUser(username);
    const newMsg: ChatMessage = {
      id: Date.now(),
      content,
      sentAt: new Date().toISOString(),
      sender
    };
    if (!msgs[roomId]) {
      msgs[roomId] = [];
    }
    msgs[roomId].push(newMsg);
    setStorageItem('ss_messages', msgs);

    // Simulate AI chat response in 1 second!
    setTimeout(() => {
      this.simulateAiReply(roomId, content);
    }, 1500);

    return newMsg;
  },

  simulateAiReply(roomId: number, userMessage: string) {
    const msgs = getStorageItem<Record<number, ChatMessage[]>>('ss_messages', INITIAL_MESSAGES);
    const aiUsers = INITIAL_USERS.filter((u) => u.username !== 'alex_cosmos'); // pick an AI
    const randomAi = aiUsers[Math.floor(Math.random() * aiUsers.length)];
    
    const responses = [
      `That is fascinating! Tell me more. 💡`,
      `Agreed, glassmorphism combined with spring physics feels next level.`,
      `Interesting point about "${userMessage.substring(0, 15)}...". We should experiment with that in R3F.`,
      `I am working on a demo for this. Will share the GitHub link shortly!`,
      `Haha, spot on! Cyber nomads unite ☕💻`
    ];
    const replyText = responses[Math.floor(Math.random() * responses.length)];

    const aiMsg: ChatMessage = {
      id: Date.now() + 1,
      content: replyText,
      sentAt: new Date().toISOString(),
      sender: randomAi
    };

    if (!msgs[roomId]) msgs[roomId] = [];
    msgs[roomId].push(aiMsg);
    setStorageItem('ss_messages', msgs);

    // Dispatch custom event to notify active ChatRoom instances in window
    window.dispatchEvent(new CustomEvent('ss_new_message', { detail: { roomId, message: aiMsg } }));
  },

  // --- FOLLOWS ---
  // Store targetUsername array followed by username
  getFollowingList(username: string): string[] {
    return getStorageItem<string[]>(`ss_following_${username}`, ['alex_cosmos', 'aurora_codes']);
  },

  toggleFollow(targetUsername: string, username: string): string {
    const following = this.getFollowingList(username);
    const idx = following.indexOf(targetUsername);
    let state = '';
    if (idx === -1) {
      following.push(targetUsername);
      state = 'Followed';
      // Trigger notification
      this.addNotification(targetUsername, {
        type: 'FOLLOW',
        actorUsername: username,
        actorProfilePictureUrl: this.getCurrentUser(username).profilePictureUrl,
        postId: null
      });
    } else {
      following.splice(idx, 1);
      state = 'Unfollowed';
    }
    setStorageItem(`ss_following_${username}`, following);

    // Sync follower count
    const followerCounts = getStorageItem<Record<string, number>>('ss_follower_counts', {
      alex_cosmos: 342,
      elena_pixels: 189,
      cyber_nomad: 512,
      aurora_codes: 247
    });
    followerCounts[targetUsername] = (followerCounts[targetUsername] || 0) + (state === 'Followed' ? 1 : -1);
    setStorageItem('ss_follower_counts', followerCounts);

    return state;
  },

  getFollowStatus(targetUsername: string, username: string): boolean {
    return this.getFollowingList(username).includes(targetUsername);
  },

  getFollowCounts(username: string): FollowCounts {
    const following = this.getFollowingList(username).length;
    const followerCounts = getStorageItem<Record<string, number>>('ss_follower_counts', {
      alex_cosmos: 342,
      elena_pixels: 189,
      cyber_nomad: 512,
      aurora_codes: 247
    });
    const followerCount = followerCounts[username] || 0;
    return {
      followerCount,
      followingCount: following
    };
  },

  getFollowersList(username: string): User[] {
    // find users that follow username
    const allUsers = this.getUsers();
    // return users who have username in their following list
    return allUsers.filter((u) => this.getFollowingList(u.username).includes(username));
  },

  // --- NOTIFICATIONS ---
  getNotifications(username: string): NotificationItem[] {
    const notifs = getStorageItem<Record<string, NotificationItem[]>>('ss_notifications', INITIAL_NOTIFICATIONS);
    return notifs[username] || [
      {
        id: 801,
        type: 'FOLLOW',
        actorUsername: 'cyber_nomad',
        actorProfilePictureUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
        postId: null,
        read: false,
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      },
      {
        id: 802,
        type: 'LIKE',
        actorUsername: 'elena_pixels',
        actorProfilePictureUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
        postId: 1,
        read: false,
        createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString()
      }
    ];
  },

  getUnreadCount(username: string): number {
    return this.getNotifications(username).filter((n) => !n.read).length;
  },

  markAllRead(username: string): void {
    const notifs = getStorageItem<Record<string, NotificationItem[]>>('ss_notifications', INITIAL_NOTIFICATIONS);
    const userNotifs = notifs[username] || this.getNotifications(username);
    const updated = userNotifs.map((n) => ({ ...n, read: true }));
    notifs[username] = updated;
    setStorageItem('ss_notifications', notifs);
  },

  addNotification(username: string, item: Omit<NotificationItem, 'id' | 'read' | 'createdAt'>): void {
    const notifs = getStorageItem<Record<string, NotificationItem[]>>('ss_notifications', INITIAL_NOTIFICATIONS);
    if (!notifs[username]) {
      notifs[username] = [];
    }
    const newNotif: NotificationItem = {
      id: Date.now(),
      read: false,
      createdAt: new Date().toISOString(),
      ...item
    };
    notifs[username].unshift(newNotif);
    setStorageItem('ss_notifications', notifs);

    // Dispatch global event for instant display
    window.dispatchEvent(new CustomEvent('ss_new_notification', { detail: { username, notification: newNotif } }));
  }
};
