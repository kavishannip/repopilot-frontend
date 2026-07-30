'use client';

import React from 'react';
import AppShell from '@/components/layout/AppShell';
import RepoUrlInput from '@/components/input/RepoUrlInput';
import QuickSummaryCard from '@/components/quick-summary/QuickSummaryCard';
import AnalysisProgressStepper from '@/components/progress/AnalysisProgressStepper';
import ResultsRenderer from '@/components/deep-results/ResultsRenderer';
import ArchitectureGraph from '@/components/graph/ArchitectureGraph';
import ChatPanel from '@/components/chat/ChatPanel';
import ChatLockCard from '@/components/chat/ChatLockCard';
import StaleBanner from '@/components/shared/StaleBanner';
import { useAppStore } from '@/stores/appStore';
import { useAnalyze } from '@/hooks/useAnalyze';
import { useJobStatus } from '@/hooks/useJobStatus';
import { Sparkles } from 'lucide-react';
import { Typography } from '@wso2/oxygen-ui';

export default function Home() {
  const currentStep = useAppStore((state) => state.currentStep);
  const repoUrl = useAppStore((state) => state.repoUrl);
  const quickSummary = useAppStore((state) => state.quickSummary);
  const deepAnalysisResult = useAppStore((state) => state.deepAnalysisResult);

  const { mutate: triggerAnalyze, isPending: isStartingAnalyze, error: analyzeError } = useAnalyze();
  const { data: jobStatusData, isLoading: isJobStatusLoading, error: jobStatusError } = useJobStatus();

  const handleStartDeepAnalysis = () => {
    triggerAnalyze(undefined);
  };

  return (
    <AppShell>
      {/* Hero Welcome Banner */}
      <section className="text-center space-y-3 py-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Single-Page Progressive Disclosure</span>
        </div>
        <Typography variant="h3" className="font-extrabold text-slate-100 text-2xl md:text-4xl tracking-tight">
          Analyze Any Public GitHub Repository
        </Typography>
        <Typography variant="body1" className="text-slate-400 text-sm md:text-base max-w-xl mx-auto">
          Quick Summary → Deep Analysis → Interactive Chat. Unlocked step-by-step.
        </Typography>
      </section>

      {/* Main Single-Page Flow */}
      <section className="space-y-6">
        {/* Step 1: Repo URL Input */}
        <RepoUrlInput />

        {/* Stale Cache Alert Banner */}
        <StaleBanner />

        {/* Step 2: Quick Summary Card (Only shown if quick summary exists and deep analysis is not yet completed) */}
        {quickSummary && !deepAnalysisResult && (
          <QuickSummaryCard
            data={quickSummary}
            onStartDeepAnalysis={handleStartDeepAnalysis}
            isStartingAnalysis={isStartingAnalyze}
          />
        )}

        {/* Step 3: Analysis Progress Stepper */}
        {(currentStep === 'analyzing' || isStartingAnalyze) && (
          <AnalysisProgressStepper
            statusData={jobStatusData}
            isLoading={isStartingAnalyze || isJobStatusLoading}
            error={analyzeError || jobStatusError}
            onRetry={handleStartDeepAnalysis}
          />
        )}

        {/* Step 4: Deep Analysis Results & Architecture Graph */}
        {deepAnalysisResult && (
          <>
            <ResultsRenderer brief={deepAnalysisResult} repoUrl={repoUrl} />
            <ArchitectureGraph />
            <ChatPanel />
          </>
        )}

        {/* Locked Chat & Results Placeholder Banner */}
        {quickSummary && currentStep === 'quick_summary' && !deepAnalysisResult && (
          <ChatLockCard
            onStartDeepAnalysis={handleStartDeepAnalysis}
            isStartingAnalysis={isStartingAnalyze}
          />
        )}
      </section>
    </AppShell>
  );
}
