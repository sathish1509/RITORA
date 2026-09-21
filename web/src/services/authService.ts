import { delay } from './api';
import { mockUser } from '../data/mockData';
import type { User } from '../types';

export const authService = {
  async login(_email: string, _password: string): Promise<{ user: User; token: string }> {
    await delay(500);
    return { user: mockUser, token: 'mock-jwt-token-ritora' };
  },

  async register(_data: { name: string; email: string; password: string; age: number }): Promise<{ user: User; token: string }> {
    await delay(500);
    return { user: mockUser, token: 'mock-jwt-token-ritora' };
  },

  async getCurrentUser(): Promise<User> {
    await delay(200);
    return mockUser;
  },

  async logout(): Promise<void> {
    await delay(200);
  },
};
