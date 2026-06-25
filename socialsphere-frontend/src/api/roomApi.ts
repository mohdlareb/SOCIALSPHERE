import axiosClient from './axiosClient';
import type { EchoRoom, ChatMessage } from '../types';
import { mockDb } from '../utils/mockDb';

export async function getAllRooms(): Promise<EchoRoom[]> {
  try {
    const res = await axiosClient.get<EchoRoom[]>('/rooms');
    return res.data;
  } catch (err) {
    console.warn('getAllRooms offline fallback', err);
    return mockDb.getRooms();
  }
}

export async function createRoom(
  username: string,
  name: string,
  description: string
): Promise<EchoRoom> {
  try {
    const res = await axiosClient.post<EchoRoom>(`/rooms/${username}`, { name, description });
    return res.data;
  } catch (err) {
    console.warn('createRoom offline fallback', err);
    return mockDb.createRoom(username, name, description);
  }
}

export async function joinRoom(roomId: number, username: string): Promise<EchoRoom> {
  try {
    const res = await axiosClient.post<EchoRoom>(`/rooms/${roomId}/join/${username}`);
    return res.data;
  } catch (err) {
    console.warn(`joinRoom offline fallback for room ${roomId}`, err);
    // join is a noop in mockDb, we just return the room
    const room = mockDb.getRooms().find((r) => r.id === roomId);
    if (!room) throw new Error('Room not found');
    return room;
  }
}

export async function getRoomMessages(roomId: number): Promise<ChatMessage[]> {
  try {
    const res = await axiosClient.get<ChatMessage[]>(`/rooms/${roomId}/messages`);
    return res.data;
  } catch (err) {
    console.warn(`getRoomMessages offline fallback for room ${roomId}`, err);
    return mockDb.getRoomMessages(roomId);
  }
}

export async function deleteRoom(roomId: number, username: string): Promise<void> {
  try {
    await axiosClient.delete(`/rooms/${roomId}/${username}`);
  } catch (err) {
    console.warn(`deleteRoom offline fallback for room ${roomId}`, err);
    mockDb.deleteRoom(roomId);
  }
}