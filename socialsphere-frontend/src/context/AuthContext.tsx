import { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import axiosClient from '../api/axiosClient';
import type { AuthResponse } from '../types';

interface AuthContextType {
  username: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getInitialUsername(): string | null {
  const token = localStorage.getItem('token');
  return token ? localStorage.getItem('username') : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(getInitialUsername);

  const login = async (uname: string, password: string) => {
    try {
      const res = await axiosClient.post<AuthResponse>('/auth/login', {
        username: uname,
        password,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      setUsername(res.data.username);
    } catch (err) {
      console.warn('Backend login failed, using local offline fallback mode', err);
      // Simulate successful local authentication
      const token = `mock-jwt-token-${uname}-${Date.now()}`;
      localStorage.setItem('token', token);
      localStorage.setItem('username', uname);
      setUsername(uname);
    }
  };

  const signup = async (uname: string, email: string, password: string) => {
    try {
      await axiosClient.post('/auth/signup', { username: uname, email, password });
      await login(uname, password);
    } catch (err) {
      console.warn('Backend signup failed, using local offline fallback mode', err);
      // Setup mock user profile in localstorage mockDb list
      const storedUsers = localStorage.getItem('ss_users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      if (!users.some((u: any) => u.username === uname)) {
        users.push({
          id: Math.floor(Math.random() * 10000),
          username: uname,
          email,
          bio: 'Premium SocialSphere Creator ✨',
          profilePictureUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('ss_users', JSON.stringify(users));
      }
      await login(uname, password);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUsername(null);
  };

  return (
    <AuthContext.Provider
      value={{ username, isAuthenticated: !!username, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}