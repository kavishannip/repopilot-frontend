'use client';

import React from 'react';
import {
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Alert,
  CircularProgress,
  Box,
} from '@wso2/oxygen-ui';
import { Check, Loader2, AlertCircle, Microscope, RefreshCw } from 'lucide-react';
import { PHASE_STEPS } from '@/lib/constants';
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

  // Determine active phase index in stepper
  const activeStepIndex = PHASE_STEPS.findIndex((step) => step.phase === currentPhase);
  const normalizedActiveStep = activeStepIndex === -1 ? (currentPhase === 'completed' ? PHASE_STEPS.length : 0) : activeStepIndex;

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

      {/* Stepper Pipeline List */}
      <div className="py-2">
        <Stepper activeStep={normalizedActiveStep} orientation="vertical" className="space-y-4">
          {PHASE_STEPS.map((stepItem, index) => {
            const isCompleted = index < normalizedActiveStep || currentPhase === 'completed';
            const isActive = index === normalizedActiveStep && !isFailed && currentPhase !== 'completed';

            return (
              <Step key={stepItem.phase} active={isActive} completed={isCompleted}>
                <StepLabel
                  StepIconComponent={() => (
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : isActive
                          ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/40 ring-4 ring-indigo-500/20 scale-110'
                          : 'bg-slate-800 text-slate-500 border border-slate-700/60'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="h-4 w-4 text-emerald-400" />
                      ) : isActive ? (
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                  )}
                >
                  <div className="ml-2">
                    <Typography
                      variant="subtitle2"
                      className={`font-semibold text-sm transition-colors ${
                        isActive
                          ? 'text-indigo-300 font-bold'
                          : isCompleted
                          ? 'text-slate-200'
                          : 'text-slate-500'
                      }`}
                    >
                      {stepItem.label}
                    </Typography>
                    <Typography variant="caption" className="text-slate-400 text-xs block mt-0.5">
                      {isActive && statusData?.current_phase_label
                        ? statusData.current_phase_label
                        : stepItem.description}
                    </Typography>
                  </div>
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </div>
    </Paper>
  );
}
