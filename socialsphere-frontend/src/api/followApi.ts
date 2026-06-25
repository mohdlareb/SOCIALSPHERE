import axiosClient from './axiosClient';
import type { User, FollowCounts } from '../types';
import { mockDb } from '../utils/mockDb';

export async function toggleFollow(targetUsername: string, username: string): Promise<string> {
  try {
    const res = await axiosClient.post<string>(`/follow/${targetUsername}/${username}`);
    return res.data;
  } catch (err) {
    console.warn(`toggleFollow offline fallback for ${targetUsername}`, err);
    return mockDb.toggleFollow(targetUsername, username);
  }
}

export async function getFollowStatus(targetUsername: string, username: string): Promise<boolean> {
  try {
    const res = await axiosClient.get<boolean>(`/follow/${targetUsername}/status/${username}`);
    return res.data;
  } catch (err) {
    console.warn(`getFollowStatus offline fallback for ${targetUsername}`, err);
    return mockDb.getFollowStatus(targetUsername, username);
  }
}

export async function getFollowCounts(username: string): Promise<FollowCounts> {
  try {
    const res = await axiosClient.get<FollowCounts>(`/follow/${username}/counts`);
    return res.data;
  } catch (err) {
    console.warn(`getFollowCounts offline fallback for ${username}`, err);
    return mockDb.getFollowCounts(username);
  }
}

export async function getFollowers(username: string): Promise<User[]> {
  try {
    const res = await axiosClient.get<User[]>(`/follow/${username}/followers`);
    return res.data;
  } catch (err) {
    console.warn(`getFollowers offline fallback for ${username}`, err);
    return mockDb.getFollowersList(username);
  }
}

export async function getFollowing(username: string): Promise<User[]> {
  try {
    const res = await axiosClient.get<User[]>(`/follow/${username}/following`);
    return res.data;
  } catch (err) {
    console.warn(`getFollowing offline fallback for ${username}`, err);
    // return users that username follows
    const followingUsernames = mockDb.getFollowingList(username);
    return mockDb.getUsers().filter((u) => followingUsernames.includes(u.username));
  }
}