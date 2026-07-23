import { API_BASE_URL } from './constants';
import {
  QuickSummaryResponse,
  AnalyzeJobResponse,
  JobStatusResponse,
  ArchitectureGraphResponse,
  CreateChatSessionResponse,
  SendChatMessageResponse,
  ChatMessage,
} from './types';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const errorJson = await response.json();
      if (errorJson.detail) errorMessage = errorJson.detail;
      else if (errorJson.message) errorMessage = errorJson.message;
    } catch {
      // Ignore JSON parse error on non-ok response
    }
    throw new ApiError(response.status, errorMessage);
  }

  return response.json() as Promise<T>;
}

export const api = {
  // Quick Summary
  getQuickSummary: (repoUrl: string) =>
    request<QuickSummaryResponse>('/api/analyzer/quicksummary', {
      method: 'POST',
      body: JSON.stringify({ repo_url: repoUrl }),
    }),

  // Submit Deep Analysis async job
  startDeepAnalysis: (repoId: string) =>
    request<AnalyzeJobResponse>('/api/analyzer/analyze', {
      method: 'POST',
      body: JSON.stringify({ repo_id: repoId }),
    }),

  // Get async job status (polled)
  getJobStatus: (jobId: string) =>
    request<JobStatusResponse>(`/api/analyzer/status/${jobId}`),

  // Get Architecture Graph
  getArchitectureGraph: (repoUrl: string) =>
    request<ArchitectureGraphResponse>(`/api/analyzer/graph?repo_url=${encodeURIComponent(repoUrl)}`),

  // Chat - Create Session
  createChatSession: (repoId: string, clientId: string) =>
    request<CreateChatSessionResponse>('/api/chat/session', {
      method: 'POST',
      body: JSON.stringify({ repo_id: repoId, client_id: clientId, title: 'Repo Chat' }),
    }),

  // Chat - Send Message
  sendChatMessage: (sessionId: string, message: string) =>
    request<SendChatMessageResponse>('/api/chat/message', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId, message }),
    }),

  // Chat - Get History
  getChatHistory: (sessionId: string) =>
    request<{ messages: ChatMessage[] }>(`/api/chat/session/${sessionId}`),

  // Chat - Delete Session
  deleteChatSession: (sessionId: string) =>
    request<{ success: boolean }>(`/api/chat/session/${sessionId}`, {
      method: 'DELETE',
    }),
};
