import axiosClient from './axiosClient';
import type { NotificationItem } from '../types';
import { mockDb } from '../utils/mockDb';

export async function getNotifications(username: string): Promise<NotificationItem[]> {
  try {
    const res = await axiosClient.get<NotificationItem[]>(`/notifications/${username}`);
    return res.data;
  } catch (err) {
    console.warn(`getNotifications offline fallback for ${username}`, err);
    return mockDb.getNotifications(username);
  }
}

export async function getUnreadCount(username: string): Promise<number> {
  try {
    const res = await axiosClient.get<number>(`/notifications/${username}/unread-count`);
    return res.data;
  } catch (err) {
    console.warn(`getUnreadCount offline fallback for ${username}`, err);
    return mockDb.getUnreadCount(username);
  }
}

export async function markAllRead(username: string): Promise<void> {
  try {
    await axiosClient.put(`/notifications/${username}/read-all`);
  } catch (err) {
    console.warn(`markAllRead offline fallback for ${username}`, err);
    mockDb.markAllRead(username);
  }
}