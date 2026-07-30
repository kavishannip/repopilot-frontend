import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAppStore } from '@/stores/appStore';
import { QuickSummaryResponse } from '@/lib/types';
import { useCheckUpdate } from './useCheckUpdate';

export function useQuickSummary() {
  const setQuickSummary = useAppStore((state) => state.setQuickSummary);
  const setDeepAnalysisResult = useAppStore((state) => state.setDeepAnalysisResult);
  const setJobId = useAppStore((state) => state.setJobId);
  const setSessionId = useAppStore((state) => state.setSessionId);
  const setStep = useAppStore((state) => state.setStep);
  const setStaleInfo = useAppStore((state) => state.setStaleInfo);
  const { mutate: checkUpdate } = useCheckUpdate();

  return useMutation<QuickSummaryResponse, Error, string>({
    mutationFn: (repoUrl: string) => api.getQuickSummary(repoUrl),
    onMutate: () => {
      // Clear previous repo analysis results, session, and stale state when starting quick summary for a new repo
      setDeepAnalysisResult(null);
      setJobId(null);
      setSessionId(null);
      setStaleInfo(false, null);
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

      if (data.cached) {
        // Asynchronously check if the cached repo has new commits on GitHub
        checkUpdate(data.repo_url);
      }
    },
  });
}
