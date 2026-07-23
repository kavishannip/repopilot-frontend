import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAppStore } from '@/stores/appStore';
import { QuickSummaryResponse } from '@/lib/types';

export function useQuickSummary() {
  const setQuickSummary = useAppStore((state) => state.setQuickSummary);
  const setStep = useAppStore((state) => state.setStep);

  return useMutation<QuickSummaryResponse, Error, string>({
    mutationFn: (repoUrl: string) => api.getQuickSummary(repoUrl),
    onSuccess: (data) => {
      setQuickSummary(data);
      setStep('quick_summary');
    },
  });
}
