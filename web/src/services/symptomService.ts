import { apiClient } from './api';
import { mockSymptoms } from '../data/mockData';
import type { Symptom, SymptomType } from '../types';

export const symptomService = {
  async getSymptoms(): Promise<Symptom[]> {
    try {
      const symptoms = await apiClient.get<Symptom[]>('/symptoms');
      return symptoms.length > 0 ? symptoms : mockSymptoms;
    } catch {
      return mockSymptoms;
    }
  },

  async getSymptomsByDate(date: string): Promise<Symptom[]> {
    try {
      return await apiClient.get<Symptom[]>(`/symptoms/by-date/${date}`);
    } catch {
      return mockSymptoms.filter((s) => s.date === date);
    }
  },

  async createSymptom(data: { type: SymptomType; severity: 1 | 2 | 3 | 4 | 5; date: string; notes?: string }): Promise<Symptom> {
    try {
      return await apiClient.post<Symptom>('/symptoms', data);
    } catch {
      return { id: `sym_${Date.now()}`, ...data };
    }
  },

  async deleteSymptom(id: string): Promise<void> {
    try {
      await apiClient.delete(`/symptoms/${id}`);
    } catch {
      // Mock delete
    }
  },
};
