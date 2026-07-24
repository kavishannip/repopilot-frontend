import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAppStore } from '@/stores/appStore';
import { getClientId } from '@/lib/clientId';
import { ChatMessage } from '@/lib/types';

export function useChatSession() {
  const repoId = useAppStore((state) => state.repoId);
  const sessionId = useAppStore((state) => state.sessionId);
  const setSessionId = useAppStore((state) => state.setSessionId);
  const deepAnalysisResult = useAppStore((state) => state.deepAnalysisResult);

  // Auto-create chat session when deep analysis result is available and no session exists
  const createSessionMutation = useMutation({
    mutationFn: async () => {
      if (!repoId) throw new Error('No repo_id available to create chat session.');
      const clientId = getClientId();
      return api.createChatSession(repoId, clientId);
    },
    onSuccess: (data) => {
      setSessionId(data.session_id);
    },
  });

  // Query history when session_id exists
  const historyQuery = useQuery<ChatMessage[]>({
    queryKey: ['chatHistory', sessionId],
    queryFn: async () => {
      if (!sessionId) return [];
      const res = await api.getChatHistory(sessionId);
      return res.messages || [];
    },
    enabled: Boolean(sessionId),
    staleTime: 1000 * 60 * 5,
  });

  return {
    sessionId,
    createSession: createSessionMutation.mutate,
    isCreatingSession: createSessionMutation.isPending,
    createSessionError: createSessionMutation.error,
    history: historyQuery.data || [],
    isLoadingHistory: historyQuery.isLoading,
    refetchHistory: historyQuery.refetch,
    isChatUnlocked: Boolean(deepAnalysisResult),
  };
}
