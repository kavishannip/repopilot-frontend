'use client';

import React from 'react';
import {
  Paper,
  Typography,
  Button,
  Alert,
} from '@wso2/oxygen-ui';
import { Loader2, Microscope, RefreshCw } from 'lucide-react';
import { JobPhase, JobStatusResponse } from '@/lib/types';

interface AnalysisProgressStepperProps {
  statusData?: JobStatusResponse;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

export default function AnalysisProgressStepper({
  statusData,
  isLoading = false,
  error = null,
  onRetry,
}: AnalysisProgressStepperProps) {
  const currentPhase: JobPhase = statusData?.status || 'queued';
  const isFailed = currentPhase === 'failed' || Boolean(error) || Boolean(statusData?.error);
  const errorMessage = statusData?.error || error?.message || 'An unexpected error occurred during deep analysis.';

  return (
    <Paper
      elevation={0}
      className="border border-slate-800 bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl shadow-indigo-950/30 animate-in fade-in zoom-in-95 duration-500"
    >
      {/* Header Banner */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-md shadow-indigo-500/20">
            <Microscope className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <Typography variant="h5" className="font-extrabold text-slate-100 text-lg md:text-xl tracking-tight">
              Deep Analysis in Progress
            </Typography>
            <Typography variant="body2" className="text-slate-400 text-xs md:text-sm">
              Vectorizing files, building dependency graph, and synthesizing architecture.
            </Typography>
          </div>
        </div>

        {!isFailed && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium shrink-0">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span className="hidden sm:inline">Live Pipeline</span>
          </div>
        )}
      </div>

      {/* Error Alert on Failure */}
      {isFailed && (
        <Alert
          severity="error"
          action={
            onRetry && (
              <Button
                size="small"
                onClick={onRetry}
                className="bg-rose-900/60 hover:bg-rose-800 text-rose-100 text-xs font-semibold px-3 py-1 rounded-lg flex items-center gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Try Again</span>
              </Button>
            )
          }
          className="bg-rose-950/40 border border-rose-800/60 text-rose-300 rounded-xl"
        >
          {errorMessage}
        </Alert>
      )}

      {/* Animated Progress Loader Section */}
      {!isFailed && (
        <div className="py-8 flex flex-col items-center justify-center space-y-6 text-center">
          <div className="relative flex items-center justify-center">
            {/* Outer Glowing Ring Animation */}
            <div className="absolute h-24 w-24 rounded-full bg-gradient-to-tr from-indigo-500 via-cyan-400 to-emerald-400 animate-spin blur-md opacity-60" />
            <div className="relative h-20 w-20 rounded-full bg-slate-950 border border-indigo-500/40 flex items-center justify-center shadow-xl">
              <Loader2 className="h-10 w-10 text-indigo-400 animate-spin" />
            </div>
          </div>

          <div className="space-y-2 max-w-md">
            <Typography variant="h6" className="font-bold text-slate-100 text-base md:text-lg">
              {statusData?.current_phase_label || 'Analyzing Repository Architecture...'}
            </Typography>
            <Typography variant="body2" className="text-slate-400 text-xs md:text-sm">
              Please wait while the LLM reasoning pipeline extracts structural dependencies, dependency graphs, and technical summaries.
            </Typography>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono">
            <span className="h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
            <span>Processing repository... results will appear automatically</span>
          </div>
        </div>
      )}
    </Paper>
  );
}
