import { apiClient } from './api';
import type { Cycle } from '../types';

export const cycleService = {
  async getCycles(): Promise<Cycle[]> {
    return await apiClient.get<Cycle[]>('/cycles');
  },

  async getCurrentCycle(): Promise<Cycle | null> {
    return await apiClient.get<Cycle | null>('/cycles/current');
  },

  async createCycle(data: Partial<Cycle>): Promise<Cycle> {
    return await apiClient.post<Cycle>('/cycles', data);
  },

  async endCycle(cycleId: string, endDate?: string): Promise<Cycle> {
    return await apiClient.put<Cycle>(`/cycles/${cycleId}/end`, { endDate });
  },
};
