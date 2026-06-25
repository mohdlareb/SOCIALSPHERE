import axiosClient from './axiosClient';
import type { Post, Comment } from '../types';
import { mockDb } from '../utils/mockDb';

export async function getAllPosts(): Promise<Post[]> {
  try {
    const res = await axiosClient.get<Post[]>('/posts');
    return res.data;
  } catch (err) {
    console.warn('getAllPosts offline fallback', err);
    return mockDb.getPosts();
  }
}

export async function createPost(
  username: string,
  content: string,
  imageUrl?: string
): Promise<Post> {
  try {
    const res = await axiosClient.post<Post>(`/posts/${username}`, { content, imageUrl });
    return res.data;
  } catch (err) {
    console.warn('createPost offline fallback', err);
    return mockDb.createPost(username, content, imageUrl);
  }
}

export async function toggleLike(postId: number, username: string): Promise<string> {
  try {
    const res = await axiosClient.post<string>(`/posts/${postId}/likes/${username}`);
    return res.data;
  } catch (err) {
    console.warn(`toggleLike offline fallback for post ${postId}`, err);
    return mockDb.toggleLike(postId, username);
  }
}

export async function getLikeCount(postId: number): Promise<number> {
  try {
    const res = await axiosClient.get<number>(`/posts/${postId}/likes/count`);
    return res.data;
  } catch (err) {
    console.warn(`getLikeCount offline fallback for post ${postId}`, err);
    return mockDb.getLikeCount(postId);
  }
}

export async function getComments(postId: number): Promise<Comment[]> {
  try {
    const res = await axiosClient.get<Comment[]>(`/posts/${postId}/comments`);
    return res.data;
  } catch (err) {
    console.warn(`getComments offline fallback for post ${postId}`, err);
    return mockDb.getComments(postId);
  }
}

export async function addComment(
  postId: number,
  username: string,
  content: string
): Promise<Comment> {
  try {
    const res = await axiosClient.post<Comment>(`/posts/${postId}/comments/${username}`, { content });
    return res.data;
  } catch (err) {
    console.warn(`addComment offline fallback for post ${postId}`, err);
    return mockDb.addComment(postId, username, content);
  }
}

export async function getPostsByUsername(username: string): Promise<Post[]> {
  try {
    const res = await axiosClient.get<Post[]>(`/posts/user/${username}`);
    return res.data;
  } catch (err) {
    console.warn(`getPostsByUsername offline fallback for user ${username}`, err);
    return mockDb.getPosts().filter((p) => p.author.username === username);
  }
}

export async function updatePost(
  postId: number,
  username: string,
  content: string,
  imageUrl?: string
): Promise<Post> {
  try {
    const res = await axiosClient.put<Post>(`/posts/${postId}/${username}`, { content, imageUrl });
    return res.data;
  } catch (err) {
    console.warn(`updatePost offline fallback for post ${postId}`, err);
    return mockDb.updatePost(postId, content, imageUrl);
  }
}

export async function deletePost(postId: number, username: string): Promise<void> {
  try {
    await axiosClient.delete(`/posts/${postId}/${username}`);
  } catch (err) {
    console.warn(`deletePost offline fallback for post ${postId}`, err);
    mockDb.deletePost(postId);
  }
}