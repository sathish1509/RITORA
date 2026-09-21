import { delay } from './api';
import { mockLifestyle } from '../data/mockData';
import type { LifestyleEntry, StressLevel, MoodLevel } from '../types';

export const lifestyleService = {
  async getLifestyle(): Promise<LifestyleEntry[]> {
    await delay();
    return mockLifestyle;
  },

  async getLifestyleByDate(date: string): Promise<LifestyleEntry | null> {
    await delay();
    return mockLifestyle.find((l) => l.date === date) || null;
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
    await delay(400);
    return { id: `lf_${Date.now()}`, ...data };
  },
};
