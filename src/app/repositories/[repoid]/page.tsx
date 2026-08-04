'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import QuickSummaryCard from '@/components/quick-summary/QuickSummaryCard';
import AnalysisProgressStepper from '@/components/progress/AnalysisProgressStepper';
import ResultsRenderer from '@/components/deep-results/ResultsRenderer';
import ArchitectureGraph from '@/components/graph/ArchitectureGraph';
import ChatPanel from '@/components/chat/ChatPanel';
import ChatLockCard from '@/components/chat/ChatLockCard';
import StaleBanner from '@/components/shared/StaleBanner';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAppStore } from '@/stores/appStore';
import { useAnalyze } from '@/hooks/useAnalyze';
import { useJobStatus } from '@/hooks/useJobStatus';
import { api } from '@/lib/api';
import { Button, CircularProgress, Paper, Typography } from '@wso2/oxygen-ui';
import { ArrowLeft, GitBranch, RefreshCw } from 'lucide-react';

export default function SingleRepositoryPage() {
  const params = useParams();
  const repoId = typeof params?.repoid === 'string' ? params.repoid : Array.isArray(params?.repoid) ? params.repoid[0] : '';

  const loadRepositoryDetails = useAppStore((state) => state.loadRepositoryDetails);
  const currentStep = useAppStore((state) => state.currentStep);
  const repoUrl = useAppStore((state) => state.repoUrl);
  const quickSummary = useAppStore((state) => state.quickSummary);
  const deepAnalysisResult = useAppStore((state) => state.deepAnalysisResult);

  const { mutate: triggerAnalyze, isPending: isStartingAnalyze, error: analyzeError } = useAnalyze();
  const { data: jobStatusData, isLoading: isJobStatusLoading, error: jobStatusError } = useJobStatus();

  const {
    data: repoDetails,
    isLoading: isDetailsLoading,
    isError: isDetailsError,
    error: detailsError,
    refetch,
  } = useQuery({
    queryKey: ['repository-details', repoId],
    queryFn: () => api.getRepository(repoId),
    enabled: Boolean(repoId),
  });

  useEffect(() => {
    if (repoDetails) {
      loadRepositoryDetails(repoDetails);
    }
  }, [repoDetails, loadRepositoryDetails]);

  const handleStartDeepAnalysis = () => {
    triggerAnalyze(undefined);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Top Header with Back Navigation */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <Link href="/repositories">
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ArrowLeft className="h-4 w-4" />}
                  className="border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900 text-xs normal-case"
                >
                  Back to Repositories
                </Button>
              </Link>
              {repoDetails && (
                <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
                  <GitBranch className="h-4 w-4 text-indigo-400" />
                  <span>{repoDetails.owner}/{repoDetails.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Loading State */}
          {isDetailsLoading && (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <CircularProgress size={36} className="text-indigo-500" />
              <Typography variant="body2" className="text-slate-400">
                Loading repository analysis...
              </Typography>
            </div>
          )}

          {/* Error State */}
          {isDetailsError && (
            <Paper className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
              <Typography variant="h6" className="text-rose-400 font-semibold">
                Repository Not Found
              </Typography>
              <Typography variant="body2" className="text-slate-400 max-w-md mx-auto text-sm">
                {detailsError instanceof Error ? detailsError.message : 'Could not fetch repository analysis.'}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<RefreshCw className="h-4 w-4" />}
                onClick={() => refetch()}
                className="border-slate-700 text-slate-300"
              >
                Retry
              </Button>
            </Paper>
          )}

          {/* Main Repo Analysis View */}
          {repoDetails && !isDetailsLoading && (
            <section className="space-y-6">
              {/* Stale Cache Alert Banner */}
              <StaleBanner />

              {/* Step 2: Quick Summary Card */}
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

              {/* Step 4: Deep Analysis Results & Architecture Graph & Chat */}
              {deepAnalysisResult && (
                <>
                  <ResultsRenderer brief={deepAnalysisResult} repoUrl={repoUrl} />
                  <ArchitectureGraph />
                  <ChatPanel />
                </>
              )}

              {/* Locked Chat Banner */}
              {quickSummary && currentStep === 'quick_summary' && !deepAnalysisResult && (
                <ChatLockCard
                  onStartDeepAnalysis={handleStartDeepAnalysis}
                  isStartingAnalysis={isStartingAnalyze}
                />
              )}
            </section>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
