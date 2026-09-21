import { apiClient } from './api';
import { mockLifestyle } from '../data/mockData';
import type { LifestyleEntry, StressLevel, MoodLevel } from '../types';

export const lifestyleService = {
  async getLifestyle(): Promise<LifestyleEntry[]> {
    try {
      const entries = await apiClient.get<LifestyleEntry[]>('/lifestyle');
      return entries.length > 0 ? entries : mockLifestyle;
    } catch {
      return mockLifestyle;
    }
  },

  async getLifestyleByDate(date: string): Promise<LifestyleEntry | null> {
    try {
      return await apiClient.get<LifestyleEntry>(`/lifestyle/by-date/${date}`);
    } catch {
      return mockLifestyle.find((l) => l.date === date) || null;
    }
  },

  async createLifestyleEntry(data: {
    date: string;
    sleep: number;
    stress: StressLevel;
    hydration: number;
    exercise: number;
    mood: MoodLevel;
    notes?: string;
  }): Promise<LifestyleEntry> {
    try {
      return await apiClient.post<LifestyleEntry>('/lifestyle', data);
    } catch {
      return { id: `lf_${Date.now()}`, ...data };
    }
  },
};
