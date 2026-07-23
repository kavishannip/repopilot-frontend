'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import RepoUrlInput from '@/components/input/RepoUrlInput';
import QuickSummaryCard from '@/components/quick-summary/QuickSummaryCard';
import AnalysisProgressStepper from '@/components/progress/AnalysisProgressStepper';
import ResultsRenderer from '@/components/deep-results/ResultsRenderer';
import ArchitectureGraph from '@/components/graph/ArchitectureGraph';
import SectionCard from '@/components/shared/SectionCard';
import TagChip from '@/components/shared/TagChip';
import { useAppStore } from '@/stores/appStore';
import { useAnalyze } from '@/hooks/useAnalyze';
import { useJobStatus } from '@/hooks/useJobStatus';
import { Sparkles, Lock, Microscope, ChevronDown, ChevronUp } from 'lucide-react';
import { Typography, Button, Collapse, IconButton } from '@wso2/oxygen-ui';

export default function Home() {
  const currentStep = useAppStore((state) => state.currentStep);
  const repoUrl = useAppStore((state) => state.repoUrl);
  const quickSummary = useAppStore((state) => state.quickSummary);
  const deepAnalysisResult = useAppStore((state) => state.deepAnalysisResult);

  const [summaryExpanded, setSummaryExpanded] = useState(true);

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

        {/* Step 2: Quick Summary Card */}
        {quickSummary && (
          <div>
            {deepAnalysisResult ? (
              // Collapsible Accordion wrapper once deep results are active
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-900/90 transition-colors select-none"
                  onClick={() => setSummaryExpanded(!summaryExpanded)}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                    <span className="font-semibold text-slate-200 text-sm">Quick Overview Summary</span>
                    <TagChip label="Collapsible" category="frontend" />
                  </div>
                  <IconButton size="small" className="text-slate-400">
                    {summaryExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </IconButton>
                </div>
                <Collapse in={summaryExpanded}>
                  <div className="p-4 pt-0">
                    <QuickSummaryCard data={quickSummary} />
                  </div>
                </Collapse>
              </div>
            ) : (
              <QuickSummaryCard
                data={quickSummary}
                onStartDeepAnalysis={handleStartDeepAnalysis}
                isStartingAnalysis={isStartingAnalyze}
              />
            )}
          </div>
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

        {/* Step 4: Deep Analysis Results Dashboard */}
        {deepAnalysisResult && (
          <>
            <ResultsRenderer brief={deepAnalysisResult} repoUrl={repoUrl} />
            <ArchitectureGraph />
          </>
        )}

        {/* Locked Placeholder Banner */}
        {quickSummary && currentStep === 'quick_summary' && !deepAnalysisResult && (
          <SectionCard
            title="Deep Analysis Results & Architecture Graph"
            subtitle="Full vector embedding, module mapping, data flow analysis, and interactive chat."
            icon={<Lock className="h-5 w-5 text-amber-400" />}
            badge={<TagChip label="Locked" category="devops" />}
            className="border-dashed border-slate-800/80 bg-slate-900/40"
          >
            <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
              <Typography variant="body2" className="text-slate-400 text-sm max-w-md">
                Click <strong>&quot;Start Deep Analysis&quot;</strong> on the summary card above to begin vectorizing files and unlocking deep architecture insights.
              </Typography>
              <Button
                variant="contained"
                onClick={handleStartDeepAnalysis}
                disabled={isStartingAnalyze}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-5 py-2 rounded-xl flex items-center gap-2"
              >
                <Microscope className="h-4 w-4" />
                <span>Start Deep Analysis</span>
              </Button>
            </div>
          </SectionCard>
        )}
      </section>
    </AppShell>
  );
}
