import { delay } from './api';
import { mockCycles, currentCycle } from '../data/mockData';
import type { Cycle } from '../types';

export const cycleService = {
  async getCycles(): Promise<Cycle[]> {
    await delay();
    return mockCycles;
  },

  async getCurrentCycle(): Promise<Cycle> {
    await delay();
    return currentCycle;
  },

  async createCycle(data: Partial<Cycle>): Promise<Cycle> {
    await delay(400);
    return {
      id: `cyc_${Date.now()}`,
      startDate: data.startDate || new Date().toISOString().split('T')[0],
      endDate: null,
      cycleLength: null,
      flow: [],
      symptoms: [],
      isActive: true,
    };
  },

  async endCycle(cycleId: string): Promise<Cycle> {
    await delay(400);
    const cycle = mockCycles.find((c) => c.id === cycleId);
    if (!cycle) throw new Error('Cycle not found');
    return { ...cycle, isActive: false, endDate: new Date().toISOString().split('T')[0] };
  },
};
