import { apiClient } from './api';
import type { AssistantMessage } from '../types';

export const assistantService = {
  async getMessages(): Promise<AssistantMessage[]> {
    return await apiClient.get<AssistantMessage[]>('/assistant/messages');
  },

  async sendMessage(message: string): Promise<{ userMessage: AssistantMessage; assistantMessage: AssistantMessage }> {
    return await apiClient.post<{ userMessage: AssistantMessage; assistantMessage: AssistantMessage }>(
      '/assistant/chat',
      { message }
    );
  },
};
