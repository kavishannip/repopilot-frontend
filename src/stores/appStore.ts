import { create } from 'zustand';
import { AppStep, DeepAnalysisBrief, QuickSummaryResponse } from '@/lib/types';

interface AppState {
  // App Navigation Flow State
  currentStep: AppStep;
  setStep: (step: AppStep) => void;

  // Active Repository Context
  repoUrl: string;
  repoId: string | null;
  setRepoContext: (url: string, id: string) => void;

  // Analysis State
  quickSummary: QuickSummaryResponse | null;
  setQuickSummary: (data: QuickSummaryResponse) => void;

  jobId: string | null;
  setJobId: (id: string | null) => void;

  deepAnalysisResult: DeepAnalysisBrief | null;
  setDeepAnalysisResult: (result: DeepAnalysisBrief) => void;

  // Chat Session
  sessionId: string | null;
  setSessionId: (id: string | null) => void;

  // Global Reset
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentStep: 'input',
  setStep: (currentStep) => set({ currentStep }),

  repoUrl: '',
  repoId: null,
  setRepoContext: (repoUrl, repoId) => set({ repoUrl, repoId }),

  quickSummary: null,
  setQuickSummary: (quickSummary) =>
    set({ quickSummary, repoId: quickSummary.repo_id, repoUrl: quickSummary.repo_url }),

  jobId: null,
  setJobId: (jobId) => set({ jobId }),

  deepAnalysisResult: null,
  setDeepAnalysisResult: (deepAnalysisResult) => set({ deepAnalysisResult }),

  sessionId: null,
  setSessionId: (sessionId) => set({ sessionId }),

  reset: () =>
    set({
      currentStep: 'input',
      repoUrl: '',
      repoId: null,
      quickSummary: null,
      jobId: null,
      deepAnalysisResult: null,
      sessionId: null,
    }),
}));
