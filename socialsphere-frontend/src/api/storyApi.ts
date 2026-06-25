import axiosClient from './axiosClient';
import type { Story } from '../types';
import { mockDb } from '../utils/mockDb';

export async function getActiveStories(): Promise<Story[]> {
  try {
    const res = await axiosClient.get<Story[]>('/stories');
    return res.data;
  } catch (err) {
    console.warn('getActiveStories offline fallback', err);
    return mockDb.getStories();
  }
}

export async function getStoriesByUser(username: string): Promise<Story[]> {
  try {
    const res = await axiosClient.get<Story[]>(`/stories/user/${username}`);
    return res.data;
  } catch (err) {
    console.warn(`getStoriesByUser offline fallback for ${username}`, err);
    return mockDb.getStories().filter((s) => s.author.username === username);
  }
}

export async function createStory(username: string, imageUrl: string): Promise<Story> {
  try {
    const res = await axiosClient.post<Story>(`/stories/${username}`, { imageUrl });
    return res.data;
  } catch (err) {
    console.warn('createStory offline fallback', err);
    return mockDb.createStory(username, imageUrl);
  }
}

export async function deleteStory(storyId: number, username: string): Promise<void> {
  try {
    await axiosClient.delete(`/stories/${storyId}/${username}`);
  } catch (err) {
    console.warn(`deleteStory offline fallback for ${storyId}`, err);
    mockDb.deleteStory(storyId);
  }
}