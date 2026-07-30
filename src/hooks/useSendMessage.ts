import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAppStore } from '@/stores/appStore';
import { ChatMessage, SendChatMessageResponse } from '@/lib/types';

export function useSendMessage() {
  const sessionId = useAppStore((state) => state.sessionId);
  const queryClient = useQueryClient();

  return useMutation<
    SendChatMessageResponse,
    Error,
    string,
    { previousMessages: ChatMessage[] }
  >({
    mutationFn: async (messageText: string) => {
      if (!sessionId) throw new Error('No active chat session.');
      const currentStep = useAppStore.getState().currentStep;
      if (currentStep === 'analyzing') {
        throw new Error('Chat is temporarily disabled while repository analysis/sync is in progress.');
      }
      return api.sendChatMessage(sessionId, messageText);
    },
    onMutate: async (messageText: string) => {
      // Optimistic user message addition
      await queryClient.cancelQueries({ queryKey: ['chatHistory', sessionId] });
      const previousMessages = queryClient.getQueryData<ChatMessage[]>(['chatHistory', sessionId]) || [];

      const optimisticUserMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: messageText,
        timestamp: new Date().toISOString(),
      };

      queryClient.setQueryData<ChatMessage[]>(['chatHistory', sessionId], [
        ...previousMessages,
        optimisticUserMsg,
      ]);

      return { previousMessages };
    },
    onSuccess: (response, messageText) => {
      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: response.answer,
        timestamp: new Date().toISOString(),
        sufficient: response.sufficient,
        retrieved_chunks_count: response.retrieved_chunks_count,
        fallback_triggered: response.fallback_triggered,
        sources: response.sources,
      };

      queryClient.setQueryData<ChatMessage[]>(['chatHistory', sessionId], (old = []) => [
        ...old,
        assistantMsg,
      ]);
    },
    onError: (err, variables, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(['chatHistory', sessionId], context.previousMessages);
      }
    },
  });
}
