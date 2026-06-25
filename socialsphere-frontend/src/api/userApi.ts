import axiosClient from './axiosClient';
import type { User, UpdateProfileRequest } from '../types';
import { mockDb } from '../utils/mockDb';

export async function getUserProfile(username: string): Promise<User> {
  try {
    const res = await axiosClient.get<User>(`/users/${username}`);
    return res.data;
  } catch (err) {
    console.warn(`getUserProfile offline fallback for ${username}`, err);
    return mockDb.getCurrentUser(username);
  }
}

export async function updateProfile(
  username: string,
  data: UpdateProfileRequest
): Promise<User> {
  try {
    const res = await axiosClient.put<User>(`/users/${username}`, data);
    return res.data;
  } catch (err) {
    console.warn(`updateProfile offline fallback for ${username}`, err);
    return mockDb.updateProfile(username, data.bio, data.profilePictureUrl);
  }
}

export async function searchUsers(query: string): Promise<User[]> {
  try {
    const res = await axiosClient.get<User[]>('/users/search', { params: { query } });
    return res.data;
  } catch (err) {
    console.warn(`searchUsers offline fallback for query: ${query}`, err);
    return mockDb.searchUsers(query);
  }
}