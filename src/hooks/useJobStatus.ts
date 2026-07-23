import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAppStore } from '@/stores/appStore';
import { JobStatusResponse } from '@/lib/types';
import { STATUS_POLL_INTERVAL_MS } from '@/lib/constants';
import { useEffect } from 'react';

export function useJobStatus() {
  const jobId = useAppStore((state) => state.jobId);
  const currentStep = useAppStore((state) => state.currentStep);
  const setStep = useAppStore((state) => state.setStep);
  const setDeepAnalysisResult = useAppStore((state) => state.setDeepAnalysisResult);

  const query = useQuery<JobStatusResponse, Error>({
    queryKey: ['jobStatus', jobId],
    queryFn: () => {
      if (!jobId) throw new Error('No active job ID');
      return api.getJobStatus(jobId);
    },
    enabled: Boolean(jobId) && (currentStep === 'analyzing' || currentStep === 'quick_summary'),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === 'completed' || status === 'failed') {
        return false;
      }
      return STATUS_POLL_INTERVAL_MS;
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query.data?.status === 'completed' && query.data.result) {
      setDeepAnalysisResult(query.data.result);
      setStep('results');
    }
  }, [query.data, setDeepAnalysisResult, setStep]);

  return query;
}
