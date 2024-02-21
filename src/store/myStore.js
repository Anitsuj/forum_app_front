import { create } from 'zustand';

export const useStore = create((set) => ({
  user: [],
  setUser: (data) => set((state) => ({ user: data })),
  allUsers: [],
  setAllUsers: (data) => set((state) => ({ allUsers: data })),
  topic: [],
  setTopic: (data) => set((state) => ({ topic: data })),
  discussion: [],
  setDiscussion: (data) => set((state) => ({ discussion: data })),
  post: [],
  setPost: (data) => set((state) => ({ post: data })),
  message: [],
  setMessage: (data) => set((state) => ({ message: data })),
  unreadMessages: 0,
  setUnreadMessages: (data) => set((state) => ({ unreadMessages: data })),
}));
