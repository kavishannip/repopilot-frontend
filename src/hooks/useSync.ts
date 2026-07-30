import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAppStore } from '@/stores/appStore';
import { AnalyzeJobResponse } from '@/lib/types';

export function useSync() {
  const repoId = useAppStore((state) => state.repoId);
  const setJobId = useAppStore((state) => state.setJobId);
  const setStep = useAppStore((state) => state.setStep);
  const setStaleInfo = useAppStore((state) => state.setStaleInfo);

  return useMutation<AnalyzeJobResponse, Error, string | undefined>({
    mutationFn: (overrideRepoId?: string) => {
      const targetId = overrideRepoId || repoId;
      if (!targetId) {
        throw new Error('No repository ID available to start sync.');
      }
      return api.syncRepo(targetId);
    },
    onMutate: () => {
      setStaleInfo(false, null);
    },
    onSuccess: (data) => {
      if (data.job_id) {
        setJobId(data.job_id);
        setStep('analyzing');
      }
    },
  });
}
