import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAppStore } from '@/stores/appStore';
import { QuickSummaryResponse } from '@/lib/types';

export function useQuickSummary() {
  const setQuickSummary = useAppStore((state) => state.setQuickSummary);
  const setDeepAnalysisResult = useAppStore((state) => state.setDeepAnalysisResult);
  const setJobId = useAppStore((state) => state.setJobId);
  const setSessionId = useAppStore((state) => state.setSessionId);
  const setStep = useAppStore((state) => state.setStep);

  return useMutation<QuickSummaryResponse, Error, string>({
    mutationFn: (repoUrl: string) => api.getQuickSummary(repoUrl),
    onMutate: () => {
      // Clear previous repo analysis results and session when starting quick summary for a new repo
      setDeepAnalysisResult(null);
      setJobId(null);
      setSessionId(null);
    },
    onSuccess: (data) => {
      setQuickSummary(data);
      if (data.cached_brief) {
        setDeepAnalysisResult(data.cached_brief);
        setJobId(null);
        setSessionId(null);
        setStep('results');
      } else {
        setDeepAnalysisResult(null);
        setJobId(null);
        setSessionId(null);
        setStep('quick_summary');
      }
    },
  });
}
