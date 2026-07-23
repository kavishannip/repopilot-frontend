'use client';

import React from 'react';
import SectionCard from '../shared/SectionCard';
import TagChip from '../shared/TagChip';
import { EntryPointItem } from '@/lib/types';
import { hasData, isEmpty } from '@/lib/isEmpty';
import { getGitHubUrl } from '@/lib/utils';
import { Typography } from '@wso2/oxygen-ui';
import { PlayCircle, ExternalLink, FileCode } from 'lucide-react';

interface EntryPointsSectionProps {
  entryPoints: EntryPointItem[];
  repoUrl?: string;
}

export default function EntryPointsSection({ entryPoints, repoUrl }: EntryPointsSectionProps) {
  if (isEmpty(entryPoints)) return null;

  return (
    <SectionCard
      title="Application Entry Points"
      subtitle="Primary execution scripts, server bootstrap files, and API routes."
      icon={<PlayCircle className="h-5 w-5" />}
      badge={<TagChip label={`${entryPoints.length} Entry Points`} category="devops" />}
      collapsible
    >
      <div className="space-y-3">
        {entryPoints.map((item, idx) => {
          const ghUrl = repoUrl && item.file_path ? getGitHubUrl(repoUrl, item.file_path) : undefined;

          return (
            <div
              key={`${item.file_path}-${idx}`}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <FileCode className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  {ghUrl ? (
                    <a
                      href={ghUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs md:text-sm font-semibold text-indigo-300 hover:text-indigo-200 underline underline-offset-2 flex items-center gap-1.5"
                    >
                      <span>{item.file_path}</span>
                      <ExternalLink className="h-3 w-3 opacity-70 shrink-0" />
                    </a>
                  ) : (
                    <span className="font-mono text-xs md:text-sm font-semibold text-slate-200">{item.file_path}</span>
                  )}
                  {hasData(item.description) && (
                    <Typography variant="body2" className="text-slate-400 text-xs mt-0.5">
                      {item.description}
                    </Typography>
                  )}
                </div>
              </div>

              {hasData(item.type) && (
                <TagChip label={item.type!} category="language" className="self-start sm:self-auto shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
