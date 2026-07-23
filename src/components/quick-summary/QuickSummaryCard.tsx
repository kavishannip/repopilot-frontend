'use client';

import React from 'react';
import { Paper, Typography, Button, Tooltip, Alert } from '@wso2/oxygen-ui';
import { Sparkles, ExternalLink, Calendar, Zap, Microscope, Info, Tag } from 'lucide-react';
import MetadataGrid from './MetadataGrid';
import TagChip from '../shared/TagChip';
import Markdown from '../shared/Markdown';
import { QuickSummaryResponse } from '@/lib/types';
import { hasData, isEmpty } from '@/lib/isEmpty';
import { formatDate } from '@/lib/utils';
import { useAppStore } from '@/stores/appStore';

interface QuickSummaryCardProps {
  data: QuickSummaryResponse;
  onStartDeepAnalysis?: () => void;
  isStartingAnalysis?: boolean;
}

export default function QuickSummaryCard({
  data,
  onStartDeepAnalysis,
  isStartingAnalysis = false,
}: QuickSummaryCardProps) {
  const metadata = data.metadata || {};
  const currentStep = useAppStore((state) => state.currentStep);

  return (
    <Paper
      elevation={0}
      className="border border-slate-800 bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl shadow-indigo-950/30 animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      {/* Accuracy Disclaimer Banner */}
      <div className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs md:text-sm">
        <Zap className="h-4 w-4 shrink-0 text-amber-400" />
        <div className="flex-1 min-w-0">
          <span className="font-semibold">Quick Summary</span> — Based on README and package manifests only. Results may be incomplete compared to Deep Analysis.
        </div>
      </div>

      {/* Repo Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <Typography variant="h4" className="font-extrabold text-slate-100 text-xl md:text-2xl tracking-tight truncate">
              {hasData(metadata.owner) ? `${metadata.owner} / ` : ''}
              <span className="text-indigo-400">{metadata.name || 'Repository'}</span>
            </Typography>
          </div>

          {hasData(metadata.description) && (
            <Typography variant="body1" className="text-slate-300 text-sm md:text-base leading-relaxed">
              {metadata.description}
            </Typography>
          )}
        </div>

        {hasData(metadata.homepage) && (
          <a
            href={metadata.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-indigo-400 hover:text-indigo-300 border border-slate-700/80 text-xs font-medium transition-colors shrink-0"
          >
            <span>Homepage</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      {/* Dynamic Metadata Grid & Badges */}
      <MetadataGrid metadata={metadata} />

      {/* Topics */}
      {hasData(metadata.topics) && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <Tag className="h-3.5 w-3.5 text-indigo-400" />
            <span>Topics</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {metadata.topics?.map((topic) => (
              <TagChip key={topic} label={topic} category="framework" />
            ))}
          </div>
        </div>
      )}

      {/* Activity Dates */}
      {(hasData(metadata.created_at) || hasData(metadata.updated_at) || hasData(metadata.pushed_at)) && (
        <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap pt-1 border-t border-slate-800/50">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-slate-500" /> Activity:
          </span>
          {hasData(metadata.created_at) && <span>Created: <strong className="text-slate-300 font-medium">{formatDate(metadata.created_at)}</strong></span>}
          {hasData(metadata.updated_at) && <span>Updated: <strong className="text-slate-300 font-medium">{formatDate(metadata.updated_at)}</strong></span>}
          {hasData(metadata.pushed_at) && <span>Last Push: <strong className="text-slate-300 font-medium">{formatDate(metadata.pushed_at)}</strong></span>}
        </div>
      )}

      {/* AI Quick Summary Prose */}
      {hasData(data.summary) && (
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span>AI Overview</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <Markdown content={data.summary} />
          </div>
        </div>
      )}

      {/* Deep Analysis CTA Banner */}
      <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Info className="h-4 w-4 text-indigo-400 shrink-0" />
          <span>Deep Analysis is required to enable AI Chat and generate full file graph details.</span>
        </div>

        {onStartDeepAnalysis && (
          <Button
            variant="contained"
            onClick={onStartDeepAnalysis}
            disabled={isStartingAnalysis}
            className="w-full sm:w-auto h-11 px-6 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 shrink-0 transition-all hover:scale-[1.02]"
          >
            <Microscope className="h-4 w-4" />
            <span>Start Deep Analysis</span>
          </Button>
        )}
      </div>
    </Paper>
  );
}
