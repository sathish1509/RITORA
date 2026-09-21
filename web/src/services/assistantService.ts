import { apiClient } from './api';
import type { AssistantMessage } from '../types';

export const assistantService = {
  async getMessages(): Promise<AssistantMessage[]> {
    try {
      return await apiClient.get<AssistantMessage[]>('/assistant/messages');
    } catch {
      return [
        {
          id: 'welcome_msg',
          role: 'assistant',
          content: "Hello! I'm RITORA, your cycle intelligence companion. How can I help you today?",
          timestamp: new Date().toISOString(),
        },
      ];
    }
  },

  async sendMessage(message: string): Promise<{ userMessage: AssistantMessage; assistantMessage: AssistantMessage }> {
    try {
      return await apiClient.post<{ userMessage: AssistantMessage; assistantMessage: AssistantMessage }>(
        '/assistant/chat',
        { message }
      );
    } catch {
      const userMsg: AssistantMessage = {
        id: `usr_${Date.now()}`,
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      };
      const assistantMsg: AssistantMessage = {
        id: `asst_${Date.now()}`,
        role: 'assistant',
        content: "I received your message. (Operating in offline mode - connect to backend with valid Gemini API key for full AI intelligence).",
        timestamp: new Date().toISOString(),
      };
      return { userMessage: userMsg, assistantMessage: assistantMsg };
    }
  },
};
