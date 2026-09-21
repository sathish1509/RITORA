import { apiClient } from './api';
import { mockReports } from '../data/mockData';
import type { Report } from '../types';

export const reportService = {
  async getReports(): Promise<Report[]> {
    try {
      const reports = await apiClient.get<Report[]>('/reports');
      return reports.length > 0 ? reports : mockReports;
    } catch {
      return mockReports;
    }
  },

  async generateReport(type: 'monthly' | 'quarterly' | 'annual' | 'custom'): Promise<Report> {
    try {
      return await apiClient.post<Report>('/reports/generate', { type });
    } catch {
      return mockReports[0];
    }
  },
};
