import { apiClient } from './api';
import type { Report } from '../types';

export const reportService = {
  async getReports(): Promise<Report[]> {
    return await apiClient.get<Report[]>('/reports');
  },

  async generateReport(type: 'monthly' | 'quarterly' | 'annual' | 'custom'): Promise<Report> {
    return await apiClient.post<Report>('/reports/generate', { type });
  },
};
