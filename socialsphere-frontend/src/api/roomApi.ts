import axiosClient from './axiosClient';
import type { EchoRoom, ChatMessage } from '../types';

export async function getAllRooms(): Promise<EchoRoom[]> {
  const res = await axiosClient.get<EchoRoom[]>('/rooms');
  return res.data;
}

export async function createRoom(
  username: string,
  name: string,
  description: string
): Promise<EchoRoom> {
  const res = await axiosClient.post<EchoRoom>(`/rooms/${username}`, { name, description });
  return res.data;
}

export async function joinRoom(roomId: number, username: string): Promise<EchoRoom> {
  const res = await axiosClient.post<EchoRoom>(`/rooms/${roomId}/join/${username}`);
  return res.data;
}

export async function getRoomMessages(roomId: number): Promise<ChatMessage[]> {
  const res = await axiosClient.get<ChatMessage[]>(`/rooms/${roomId}/messages`);
  return res.data;
}
export async function deleteRoom(roomId: number, username: string): Promise<void> {
  await axiosClient.delete(`/rooms/${roomId}/${username}`);
}