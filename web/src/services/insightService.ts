import { apiClient } from './api';
import { mockInsights, mockRiskIndicators, mockPredictions } from '../data/mockData';
import type { HealthInsight, RiskIndicator, Prediction, DashboardData } from '../types';

export const insightService = {
  async getInsights(): Promise<HealthInsight[]> {
    try {
      const insights = await apiClient.get<HealthInsight[]>('/insights');
      return insights.length > 0 ? insights : mockInsights;
    } catch {
      return mockInsights;
    }
  },

  async getRiskIndicators(): Promise<RiskIndicator[]> {
    try {
      const risks = await apiClient.get<RiskIndicator[]>('/insights/risks');
      return risks.length > 0 ? risks : mockRiskIndicators;
    } catch {
      return mockRiskIndicators;
    }
  },

  async getPredictions(): Promise<Prediction[]> {
    try {
      const preds = await apiClient.get<Prediction[]>('/insights/predictions');
      return preds.length > 0 ? preds : mockPredictions;
    } catch {
      return mockPredictions;
    }
  },

  async getDashboard(): Promise<DashboardData | null> {
    try {
      return await apiClient.get<DashboardData>('/dashboard');
    } catch {
      return null;
    }
  },
};
