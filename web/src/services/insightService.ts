import { delay } from './api';
import { mockInsights, mockRiskIndicators, mockPredictions } from '../data/mockData';
import type { HealthInsight, RiskIndicator, Prediction } from '../types';

export const insightService = {
  async getInsights(): Promise<HealthInsight[]> {
    await delay();
    return mockInsights;
  },

  async getRiskIndicators(): Promise<RiskIndicator[]> {
    await delay();
    return mockRiskIndicators;
  },

  async getPredictions(): Promise<Prediction[]> {
    await delay();
    return mockPredictions;
  },
};
