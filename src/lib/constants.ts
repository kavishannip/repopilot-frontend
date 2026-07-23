import { JobPhase } from './types';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const STATUS_POLL_INTERVAL_MS = 3000;

export const PHASE_STEPS: Array<{ phase: JobPhase; label: string; description: string }> = [
  { phase: 'queued', label: 'Queued', description: 'Waiting to start analysis pipeline...' },
  { phase: 'embedding', label: 'Embedding Code', description: 'Chunking and vectorizing repository source files' },
  { phase: 'structural_map', label: 'Mapping Structure', description: 'Building file and import dependency graph' },
  { phase: 'search', label: 'Semantic Search', description: 'Retrieving relevant architectural code context' },
  { phase: 'group_summaries', label: 'Summarizing Groups', description: 'Generating per-module AI summaries' },
  { phase: 'synthesis', label: 'Synthesizing Report', description: 'Creating final comprehensive architecture report' },
  { phase: 'completed', label: 'Complete', description: 'Deep analysis completed successfully ✓' },
];

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  frontend: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  backend: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  database: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  devops: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  testing: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30' },
  language: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30' },
  framework: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  default: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30' },
};
