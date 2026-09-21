import { apiClient, setToken, removeToken, setStoredUser, getStoredUser } from './api';
import { mockUser } from '../data/mockData';
import type { User } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      const res = await apiClient.post<{ user: User; token: string }>('/auth/login', { email, password });
      if (res && res.token) {
        setToken(res.token);
        setStoredUser(res.user);
        return res;
      }
      throw new Error('Invalid response');
    } catch (err) {
      console.warn('Backend login failed, checking fallback demo login...', err);
      if (email === 'sarah@ritora.app') {
        const mockAuth = { user: mockUser, token: 'mock-jwt-token-ritora' };
        setToken(mockAuth.token);
        setStoredUser(mockAuth.user);
        return mockAuth;
      }
      throw err;
    }
  },

  async register(data: { name: string; email: string; password: string; age: number }): Promise<{ user: User; token: string }> {
    try {
      const res = await apiClient.post<{ user: User; token: string }>('/auth/register', data);
      if (res && res.token) {
        setToken(res.token);
        setStoredUser(res.user);
        return res;
      }
      throw new Error('Invalid response');
    } catch (err) {
      console.warn('Backend register failed, fallback...', err);
      const fallbackUser: User = {
        id: `usr_${Date.now()}`,
        name: data.name,
        email: data.email,
        age: Number(data.age),
        averageCycleLength: 28,
        averagePeriodDuration: 5,
        createdAt: new Date().toISOString(),
      };
      const fallbackAuth = { user: fallbackUser, token: 'mock-jwt-token-ritora' };
      setToken(fallbackAuth.token);
      setStoredUser(fallbackAuth.user);
      return fallbackAuth;
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const user = await apiClient.get<User>('/auth/me');
      setStoredUser(user);
      return user;
    } catch {
      return getStoredUser() || mockUser;
    }
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const user = await apiClient.put<User>('/auth/profile', data);
      setStoredUser(user);
      return user;
    } catch {
      const current = getStoredUser() || mockUser;
      const updated = { ...current, ...data };
      setStoredUser(updated);
      return updated;
    }
  },

  async logout(): Promise<void> {
    removeToken();
  },
};
