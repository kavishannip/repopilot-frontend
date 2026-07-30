'use client';

import React from 'react';
import { Button, Typography } from '@wso2/oxygen-ui';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { useSync } from '@/hooks/useSync';

export default function StaleBanner() {
  const isRepoStale = useAppStore((state) => state.isRepoStale);
  const staleDiffSummary = useAppStore((state) => state.staleDiffSummary);
  const { mutate: triggerSync, isPending: isSyncing } = useSync();

  if (!isRepoStale) return null;

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
            Cached results may be outdated ({diffText}).
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
