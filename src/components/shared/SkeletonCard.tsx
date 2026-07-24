'use client';

import React from 'react';
import { Paper } from '@wso2/oxygen-ui';

export default function SkeletonCard() {
  return (
    <Paper
      elevation={0}
      className="border border-slate-800 bg-slate-900/60 rounded-xl p-6 space-y-4 animate-pulse"
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-slate-800/80 shrink-0" />
        <div className="space-y-2 flex-1 min-w-0">
          <div className="h-4 bg-slate-800/80 rounded w-1/3" />
          <div className="h-3 bg-slate-800/50 rounded w-2/3" />
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t border-slate-800/60">
        <div className="h-3 bg-slate-800/60 rounded w-full" />
        <div className="h-3 bg-slate-800/60 rounded w-5/6" />
        <div className="h-3 bg-slate-800/40 rounded w-4/6" />
      </div>
    </Paper>
  );
}
