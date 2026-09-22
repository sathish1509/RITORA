import { apiClient, setToken, removeToken, setStoredUser, getStoredUser } from './api';
import type { User } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await apiClient.post<{ user: User; token: string }>('/auth/login', { email, password });
    if (res && res.token) {
      setToken(res.token);
      setStoredUser(res.user);
      return res;
    }
    throw new Error('Invalid login response from server');
  },

  async register(data: { name: string; email: string; password: string; age: number }): Promise<{ user: User; token: string }> {
    const res = await apiClient.post<{ user: User; token: string }>('/auth/register', data);
    if (res && res.token) {
      setToken(res.token);
      setStoredUser(res.user);
      return res;
    }
    throw new Error('Invalid registration response from server');
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const user = await apiClient.get<User>('/auth/me');
      setStoredUser(user);
      return user;
    } catch {
      return getStoredUser();
    }
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const user = await apiClient.put<User>('/auth/profile', data);
    setStoredUser(user);
    return user;
  },

  async logout(): Promise<void> {
    removeToken();
  },
};
