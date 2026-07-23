'use client';

import React from 'react';
import AppShell from '@/components/layout/AppShell';
import RepoUrlInput from '@/components/input/RepoUrlInput';
import QuickSummaryCard from '@/components/quick-summary/QuickSummaryCard';
import SectionCard from '@/components/shared/SectionCard';
import TagChip from '@/components/shared/TagChip';
import { useAppStore } from '@/stores/appStore';
import { Sparkles, Layers, Lock } from 'lucide-react';
import { Typography, Alert, Button } from '@wso2/oxygen-ui';

export default function Home() {
  const currentStep = useAppStore((state) => state.currentStep);
  const quickSummary = useAppStore((state) => state.quickSummary);
  const setStep = useAppStore((state) => state.setStep);

  const handleStartDeepAnalysis = () => {
    // Advanced to Phase 3 step when triggered
    setStep('analyzing');
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

      {/* Step 1: Repo URL Input (Always available) */}
      <section className="space-y-6">
        <RepoUrlInput />

        {/* Step 2: Quick Summary Card (Revealed after submission) */}
        {quickSummary && (
          <QuickSummaryCard
            data={quickSummary}
            onStartDeepAnalysis={handleStartDeepAnalysis}
          />
        )}

        {/* Locked Placeholder Banner for Deep Analysis (Shown before trigger) */}
        {quickSummary && currentStep === 'quick_summary' && (
          <SectionCard
            title="Deep Analysis & Architecture Graph"
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
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-5 py-2 rounded-xl"
              >
                Start Deep Analysis
              </Button>
            </div>
          </SectionCard>
        )}
      </section>
    </AppShell>
  );
}
