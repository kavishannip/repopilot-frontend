'use client';

import React from 'react';
import SectionCard from '../shared/SectionCard';
import TagChip from '../shared/TagChip';
import { Typography, Button } from '@wso2/oxygen-ui';
import { Lock, Microscope, MessageSquare } from 'lucide-react';

interface ChatLockCardProps {
  onStartDeepAnalysis?: () => void;
  isStartingAnalysis?: boolean;
}

export default function ChatLockCard({
  onStartDeepAnalysis,
  isStartingAnalysis = false,
}: ChatLockCardProps) {
  return (
    <SectionCard
      title="Chat with Repository"
      subtitle="Ask questions, trace architecture patterns, and query code logic."
      icon={<MessageSquare className="h-5 w-5 text-indigo-400" />}
      badge={<TagChip label="Locked" category="devops" />}
      className="border-dashed border-slate-800/80 bg-slate-900/40"
    >
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <Lock className="h-6 w-6" />
        </div>

        <div className="space-y-1 max-w-md">
          <Typography variant="h6" className="font-bold text-slate-200 text-base">
            Chat is locked
          </Typography>
          <Typography variant="body2" className="text-slate-400 text-xs md:text-sm">
            Run Deep Analysis to enable vector embeddings and unlock AI-powered chat about this repository.
          </Typography>
        </div>

        {onStartDeepAnalysis && (
          <Button
            variant="contained"
            onClick={onStartDeepAnalysis}
            disabled={isStartingAnalysis}
            className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2"
          >
            <Microscope className="h-4 w-4" />
            <span>Run Deep Analysis →</span>
          </Button>
        )}
      </div>
    </SectionCard>
  );
}
