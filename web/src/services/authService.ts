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

  async updateProfile(data: Partial<User> & { sleep?: string | number; stress?: string; exercise?: string | number; lastPeriodStart?: string }): Promise<User> {
    const user = await apiClient.put<User>('/auth/profile', data);
    setStoredUser(user);
    return user;
  },

  async submitOnboarding(data: {
    averageCycleLength: number;
    averagePeriodDuration: number;
    lastPeriodStart?: string;
    sleep: string;
    sleepHours?: number;
    stress: string;
    stressLevel?: string;
    exercise: string;
    exerciseFrequency?: string;
    exerciseMinutes?: number;
    goals?: string[];
  }): Promise<User> {
    const res = await apiClient.post<{ user: User }>('/auth/onboarding', data);
    const user = (res as any)?.user || res;
    setStoredUser(user);
    return user;
  },

  async logout(): Promise<void> {
    removeToken();
  },
};
