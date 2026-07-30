import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAppStore } from '@/stores/appStore';
import { CheckUpdateResponse } from '@/lib/types';

export function useCheckUpdate() {
  const repoUrl = useAppStore((state) => state.repoUrl);
  const setStaleInfo = useAppStore((state) => state.setStaleInfo);

  return useMutation<CheckUpdateResponse, Error, string | undefined>({
    mutationFn: (overrideUrl?: string) => {
      const url = overrideUrl || repoUrl;
      if (!url) {
        throw new Error('No repo URL available to check for updates.');
      }
      return api.checkUpdate(url);
    },
    onSuccess: (data) => {
      setStaleInfo(data.is_stale, data.diff_summary || null);
    },
  });
}
