import { create } from 'zustand';
import { AppStep, DeepAnalysisBrief, QuickSummaryResponse, RepositoryDetailsResponse } from '@/lib/types';

export type DashboardTab = 'analyze' | 'repositories' | 'chat';

interface AppState {
  // Dashboard Active Tab State
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;

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
  setDeepAnalysisResult: (result: DeepAnalysisBrief | null) => void;

  // Staleness / Update State
  isRepoStale: boolean;
  staleDiffSummary: { added: number; modified: number; removed: number } | null;
  setStaleInfo: (stale: boolean, diffSummary?: { added: number; modified: number; removed: number } | null) => void;

  // Chat Session
  sessionId: string | null;
  setSessionId: (id: string | null) => void;

  // Load Saved Repository Details
  loadRepositoryDetails: (details: RepositoryDetailsResponse) => void;

  // Global Reset
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeTab: 'analyze',
  setActiveTab: (activeTab) => set({ activeTab }),

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

  isRepoStale: false,
  staleDiffSummary: null,
  setStaleInfo: (isRepoStale, staleDiffSummary = null) => set({ isRepoStale, staleDiffSummary }),

  sessionId: null,
  setSessionId: (sessionId) => set({ sessionId }),

  loadRepositoryDetails: (details) => {
    const qs: QuickSummaryResponse | null = details.quick_summary
      ? {
          repo_id: details.id,
          repo_url: details.repo_url,
          summary: details.quick_summary,
          metadata: details.metadata || {},
          cached: true,
          cached_brief: details.brief || undefined,
          commit_sha: details.commit_sha || undefined,
        }
      : null;

    let step: AppStep = 'input';
    if (details.brief) {
      step = 'results';
    } else if (qs) {
      step = 'quick_summary';
    }

    set({
      repoId: details.id,
      repoUrl: details.repo_url,
      quickSummary: qs,
      deepAnalysisResult: details.brief || null,
      currentStep: step,
      activeTab: 'analyze',
      jobId: null,
      isRepoStale: false,
      staleDiffSummary: null,
      sessionId: null,
    });
  },

  reset: () =>
    set({
      currentStep: 'input',
      repoUrl: '',
      repoId: null,
      quickSummary: null,
      jobId: null,
      deepAnalysisResult: null,
      isRepoStale: false,
      staleDiffSummary: null,
      sessionId: null,
    }),
}));

