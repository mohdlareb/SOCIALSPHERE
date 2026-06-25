import { useEffect, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import type { ChatMessage } from '../types';

interface UseChatSocketReturn {
  messages: ChatMessage[];
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  connected: boolean;
  sendMessage: (sender: string, content: string) => void;
}

export function useChatSocket(roomId: number): UseChatSocketReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);
  

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 3000,
      onConnect: () => {
        setConnected(true);
        client.subscribe(`/topic/room.${roomId}`, (message) => {
          const parsed: ChatMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, parsed]);
        });
      },
      onDisconnect: () => setConnected(false),
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [roomId]);

  const sendMessage = (sender: string, content: string) => {
    clientRef.current?.publish({
      destination: '/app/chat.send',
      body: JSON.stringify({ roomId, sender, content }),
    });
  };

  return { messages, setMessages, connected, sendMessage };
}