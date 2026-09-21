import { delay } from './api';
import { mockSymptoms } from '../data/mockData';
import type { Symptom, SymptomType } from '../types';

export const symptomService = {
  async getSymptoms(): Promise<Symptom[]> {
    await delay();
    return mockSymptoms;
  },

  async getSymptomsByDate(date: string): Promise<Symptom[]> {
    await delay();
    return mockSymptoms.filter((s) => s.date === date);
  },

  async createSymptom(data: { type: SymptomType; severity: 1 | 2 | 3 | 4 | 5; date: string; notes?: string }): Promise<Symptom> {
    await delay(400);
    return { id: `sym_${Date.now()}`, ...data };
  },
};
