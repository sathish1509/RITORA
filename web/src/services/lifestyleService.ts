import { apiClient } from './api';
import type { LifestyleEntry, StressLevel, MoodLevel } from '../types';

export const lifestyleService = {
  async getLifestyle(): Promise<LifestyleEntry[]> {
    return await apiClient.get<LifestyleEntry[]>('/lifestyle');
  },

  async getLifestyleByDate(date: string): Promise<LifestyleEntry | null> {
    return await apiClient.get<LifestyleEntry | null>(`/lifestyle/by-date/${date}`);
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
    return await apiClient.post<LifestyleEntry>('/lifestyle', data);
  },
};
