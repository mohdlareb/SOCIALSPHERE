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
    const res = await axiosClient.post<AuthResponse>('/auth/login', {
      username: uname,
      password,
    });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('username', res.data.username);
    setUsername(res.data.username);
  };

  const signup = async (uname: string, email: string, password: string) => {
    await axiosClient.post('/auth/signup', { username: uname, email, password });
    await login(uname, password);
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