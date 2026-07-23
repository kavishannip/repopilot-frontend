import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAppStore } from '@/stores/appStore';
import { AnalyzeJobResponse } from '@/lib/types';

export function useAnalyze() {
  const repoId = useAppStore((state) => state.repoId);
  const setJobId = useAppStore((state) => state.setJobId);
  const setStep = useAppStore((state) => state.setStep);
  const setDeepAnalysisResult = useAppStore((state) => state.setDeepAnalysisResult);

  return useMutation<AnalyzeJobResponse, Error, string | undefined>({
    mutationFn: (overrideRepoId?: string) => {
      const targetId = overrideRepoId || repoId;
      if (!targetId) {
        throw new Error('No repository ID available to start analysis.');
      }
      return api.startDeepAnalysis(targetId);
    },
    onSuccess: (data) => {
      if (data.status === 'completed' && data.message) {
        // Cache hit or instant completion
        setStep('results');
      } else if (data.job_id) {
        setJobId(data.job_id);
        setStep('analyzing');
      }
    },
  });
}
