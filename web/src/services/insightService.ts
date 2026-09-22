import { apiClient } from './api';
import type { HealthInsight, RiskIndicator, Prediction, DashboardData } from '../types';

export const insightService = {
  async getInsights(): Promise<HealthInsight[]> {
    return await apiClient.get<HealthInsight[]>('/insights');
  },

  async getRiskIndicators(): Promise<RiskIndicator[]> {
    return await apiClient.get<RiskIndicator[]>('/insights/risks');
  },

  async getPredictions(): Promise<Prediction[]> {
    return await apiClient.get<Prediction[]>('/insights/predictions');
  },

  async getDashboard(): Promise<DashboardData | null> {
    return await apiClient.get<DashboardData>('/dashboard');
  },
};
