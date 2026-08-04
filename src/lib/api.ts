import { API_BASE_URL } from './constants';
import { getClientId } from './clientId';
import { AsgardeoSPAClient } from '@asgardeo/auth-react';
import {
  QuickSummaryResponse,
  AnalyzeJobResponse,
  JobStatusResponse,
  ArchitectureDiagramResponse,
  CreateChatSessionResponse,
  SendChatMessageResponse,
  ChatMessage,
  RepositoryItem,
  RepositoryDetailsResponse,
  ChatSessionItem,
} from './types';



class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function getAccessToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  try {
    const auth = AsgardeoSPAClient.getInstance();
    if (!auth) return null;
    const isAuthenticated = await auth.isAuthenticated();
    if (isAuthenticated) {
      // getIDToken() returns the OpenID Connect 3-segment RS256 JWT
      const idToken = await auth.getIDToken();
      if (idToken && idToken.split('.').length === 3) {
        return idToken;
      }
      const accessToken = await auth.getAccessToken();
      if (accessToken && accessToken.split('.').length === 3) {
        return accessToken;
      }
    }
  } catch {
    // Return null if auth is not initialized or user is not logged in
  }
  return null;
}


async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const { headers: extraHeaders, ...restOptions } = options;

  const accessToken = await getAccessToken();
  const authHeaders: Record<string, string> = {};
  if (accessToken) {
    authHeaders['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...(extraHeaders as Record<string, string> | undefined),
    },
    ...restOptions,
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

  // Check Repository Update / Staleness
  checkUpdate: (repoUrl: string) =>
    request<import('./types').CheckUpdateResponse>('/api/analyzer/check-update', {
      method: 'POST',
      body: JSON.stringify({ repo_url: repoUrl }),
    }),

  // Submit Sync async job
  syncRepo: (repoId: string) =>
    request<AnalyzeJobResponse>('/api/analyzer/sync', {
      method: 'POST',
      body: JSON.stringify({ repo_id: repoId }),
    }),

  // Get async job status (polled)
  getJobStatus: (jobId: string) =>
    request<JobStatusResponse>(`/api/analyzer/status/${jobId}`),

  // Generate Architecture Diagram via LLM
  generateArchitectureDiagram: (repoId: string, forceRegenerate: boolean = false) =>
    request<ArchitectureDiagramResponse>('/api/analyzer/architecture-diagram', {
      method: 'POST',
      body: JSON.stringify({ repo_id: repoId, force_regenerate: forceRegenerate }),
    }),

  // Chat - Create Session
  createChatSession: (repoId: string, clientId: string) =>
    request<CreateChatSessionResponse>('/api/chat/session', {
      method: 'POST',
      body: JSON.stringify({ repo_id: repoId, client_id: clientId, title: 'Repo Chat' }),
      headers: { 'X-Client-ID': clientId },
    }),

  // Chat - Send Message (clientId auto-resolved from localStorage)
  sendChatMessage: (sessionId: string, message: string) =>
    request<SendChatMessageResponse>('/api/chat/message', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId, question: message, message }),
      headers: { 'X-Client-ID': getClientId() },
    }),

  // Chat - Get History (clientId auto-resolved from localStorage)
  getChatHistory: (sessionId: string) =>
    request<{ messages: ChatMessage[] }>(`/api/chat/session/${sessionId}`, {
      headers: { 'X-Client-ID': getClientId() },
    }),

  // Chat - Delete Session
  deleteChatSession: (sessionId: string) =>
    request<{ success: boolean }>(`/api/chat/session/${sessionId}`, {
      method: 'DELETE',
      headers: { 'X-Client-ID': getClientId() },
    }),

  // Chat - List User Sessions
  listChatSessions: (repoId?: string) =>
    request<ChatSessionItem[]>(`/api/chat/sessions${repoId ? `?repo_id=${repoId}` : ''}`, {
      headers: { 'X-Client-ID': getClientId() },
    }),

  // User Scanned Repositories List

  getRepositories: () =>
    request<RepositoryItem[]>('/api/analyzer/repositories'),

  // Get Single Repository Details
  getRepository: (repoId: string) =>
    request<RepositoryDetailsResponse>(`/api/analyzer/repository/${repoId}`),
};

