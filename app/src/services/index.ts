import { mobileApiClient, setMobileToken, getMobileToken } from './api';

export const mobileHealthService = {
  login: async (email: string = 'sarah@ritora.app', password: string = 'demo1234') => {
    try {
      const res = await mobileApiClient.post<{ user: any; token: string }>('/auth/login', { email, password });
      if (res?.token) {
        setMobileToken(res.token);
      }
      return res;
    } catch {
      return { token: getMobileToken() };
    }
  },

  getCurrentUser: async () => {
    try {
      return await mobileApiClient.get<any>('/auth/me');
    } catch {
      return null;
    }
  },

  updateProfile: async (data: any) => {
    try {
      return await mobileApiClient.put<any>('/auth/profile', data);
    } catch {
      return null;
    }
  },

  getCurrentCycle: async () => {
    try {
      return await mobileApiClient.get<any>('/cycles/current');
    } catch {
      return null;
    }
  },

  getCycles: async () => {
    try {
      return await mobileApiClient.get<any[]>('/cycles');
    } catch {
      return [];
    }
  },

  logSymptoms: async (symptoms: { type: string; severity: number; date: string }[]) => {
    try {
      return await Promise.all(
        symptoms.map((s) => mobileApiClient.post('/symptoms', s))
      );
    } catch {
      return [];
    }
  },

  logLifestyle: async (data: {
    date: string;
    sleep: number;
    stress: string;
    hydration: number;
    exercise: number;
    mood: string;
  }) => {
    try {
      return await mobileApiClient.post('/lifestyle', data);
    } catch {
      return null;
    }
  },

  getInsights: async () => {
    try {
      return await mobileApiClient.get<any[]>('/insights');
    } catch {
      return [];
    }
  },

  getRiskIndicators: async () => {
    try {
      return await mobileApiClient.get<any[]>('/insights/risks');
    } catch {
      return [];
    }
  },

  getPredictions: async () => {
    try {
      return await mobileApiClient.get<any[]>('/insights/predictions');
    } catch {
      return [];
    }
  },

  askAssistant: async (message: string) => {
    try {
      return await mobileApiClient.post<{ userMessage: any; assistantMessage: any }>('/assistant/chat', { message });
    } catch {
      return null;
    }
  },
};
