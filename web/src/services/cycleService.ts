import { apiClient } from './api';
import { mockCycles, currentCycle } from '../data/mockData';
import type { Cycle } from '../types';

export const cycleService = {
  async getCycles(): Promise<Cycle[]> {
    try {
      const cycles = await apiClient.get<Cycle[]>('/cycles');
      return cycles.length > 0 ? cycles : mockCycles;
    } catch (err) {
      console.warn('Using mock cycles fallback', err);
      return mockCycles;
    }
  },

  async getCurrentCycle(): Promise<Cycle> {
    try {
      const cycle = await apiClient.get<Cycle>('/cycles/current');
      return cycle || currentCycle;
    } catch (err) {
      console.warn('Using mock current cycle fallback', err);
      return currentCycle;
    }
  },

  async createCycle(data: Partial<Cycle>): Promise<Cycle> {
    try {
      return await apiClient.post<Cycle>('/cycles', data);
    } catch {
      return {
        id: `cyc_${Date.now()}`,
        startDate: data.startDate || new Date().toISOString().split('T')[0],
        endDate: null,
        cycleLength: null,
        flow: data.flow || ['medium'],
        symptoms: [],
        isActive: true,
      };
    }
  },

  async endCycle(cycleId: string, endDate?: string): Promise<Cycle> {
    try {
      return await apiClient.put<Cycle>(`/cycles/${cycleId}/end`, { endDate });
    } catch {
      const cycle = mockCycles.find((c) => c.id === cycleId) || currentCycle;
      return { ...cycle, isActive: false, endDate: endDate || new Date().toISOString().split('T')[0] };
    }
  },
};
