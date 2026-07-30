'use client';

import React from 'react';
import { Button, Typography } from '@wso2/oxygen-ui';
import { RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { useSync } from '@/hooks/useSync';

export default function StaleBanner() {
  const isRepoStale = useAppStore((state) => state.isRepoStale);
  const staleDiffSummary = useAppStore((state) => state.staleDiffSummary);
  const quickSummary = useAppStore((state) => state.quickSummary);
  const deepAnalysisResult = useAppStore((state) => state.deepAnalysisResult);
  const { mutate: triggerSync, isPending: isSyncing } = useSync();

  const isCached = Boolean(quickSummary?.cached && deepAnalysisResult);

  // Extract last updated date
  const rawDate = (quickSummary?.metadata?.pushed_at ||
    quickSummary?.metadata?.updated_at ||
    deepAnalysisResult?.repo_metadata?.pushed_at ||
    deepAnalysisResult?.repo_metadata?.updated_at) as string | undefined;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return null;
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(date);
    } catch {
      return null;
    }
  };

  const lastUpdated = formatDate(rawDate);

  // Case 1: Updates available on GitHub (stale)
  if (isRepoStale) {
    const diffText = staleDiffSummary
      ? `${staleDiffSummary.added || 0} added, ${staleDiffSummary.modified || 0} modified, ${staleDiffSummary.removed || 0} deleted`
      : 'Recent commits detected';

    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200 text-sm animate-in fade-in duration-300">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400" />
          <div>
            <Typography variant="body2" className="font-semibold text-amber-200">
              Repository updated on GitHub
            </Typography>
            <Typography variant="caption" className="text-amber-300/80">
              Updates available ({diffText}).{lastUpdated ? ` Last updated: ${lastUpdated}.` : ''}
            </Typography>
          </div>
        </div>

        <Button
          variant="contained"
          color="warning"
          size="small"
          startIcon={<RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />}
          onClick={() => triggerSync(undefined)}
          disabled={isSyncing}
          className="shrink-0 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
        >
          {isSyncing ? 'Syncing...' : 'Sync Now'}
        </Button>
      </div>
    );
  }

  // Case 2: Already indexed in database & clean (No updates available, do not show Sync button)
  if (isCached) {
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-sm animate-in fade-in duration-300">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 shrink-0">
            <CheckCircle2 className="h-4.5 w-4.5" />
          </div>
          <div>
            <Typography variant="body2" className="font-semibold text-emerald-200">
              Repository Already Indexed
            </Typography>
            {lastUpdated && (
              <Typography variant="caption" className="text-emerald-300/80 block">
                Last updated: {lastUpdated}
              </Typography>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
