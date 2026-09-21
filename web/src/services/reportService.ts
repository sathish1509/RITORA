import { delay } from './api';
import { mockReports } from '../data/mockData';
import type { Report } from '../types';

export const reportService = {
  async getReports(): Promise<Report[]> {
    await delay();
    return mockReports;
  },

  async generateReport(_type: 'monthly' | 'quarterly' | 'annual' | 'custom'): Promise<Report> {
    await delay(800);
    return mockReports[0];
  },
};
