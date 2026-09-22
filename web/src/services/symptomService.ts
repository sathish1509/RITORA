import { apiClient } from './api';
import type { Symptom, SymptomType } from '../types';

export const symptomService = {
  async getSymptoms(): Promise<Symptom[]> {
    return await apiClient.get<Symptom[]>('/symptoms');
  },

  async getSymptomsByDate(date: string): Promise<Symptom[]> {
    return await apiClient.get<Symptom[]>(`/symptoms/by-date/${date}`);
  },

  async createSymptom(data: { type: SymptomType; severity: 1 | 2 | 3 | 4 | 5; date: string; notes?: string }): Promise<Symptom> {
    return await apiClient.post<Symptom>('/symptoms', data);
  },

  async deleteSymptom(id: string): Promise<void> {
    await apiClient.delete(`/symptoms/${id}`);
  },
};
