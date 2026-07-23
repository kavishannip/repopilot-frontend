'use client';

import React from 'react';
import SectionCard from '../shared/SectionCard';
import TagChip from '../shared/TagChip';
import { isEmpty } from '@/lib/isEmpty';
import { getGitHubUrl } from '@/lib/utils';
import { Files, ExternalLink, FileCode } from 'lucide-react';

interface SelectedFilesSectionProps {
  files: string[];
  repoUrl?: string;
}

export default function SelectedFilesSection({ files, repoUrl }: SelectedFilesSectionProps) {
  if (isEmpty(files)) return null;

  return (
    <SectionCard
      title="Analyzed File Context"
      subtitle={`List of ${files.length} key source code files chunked and indexed in vector memory.`}
      icon={<Files className="h-5 w-5" />}
      badge={<TagChip label={`${files.length} Files`} category="framework" />}
      collapsible
      defaultExpanded={false}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto pr-1">
        {files.map((filePath, idx) => {
          const ghUrl = repoUrl ? getGitHubUrl(repoUrl, filePath) : undefined;

          return ghUrl ? (
            <a
              key={`${filePath}-${idx}`}
              href={ghUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 hover:bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:text-indigo-300 transition-colors group truncate"
            >
              <div className="flex items-center gap-2 truncate">
                <FileCode className="h-3.5 w-3.5 text-slate-500 group-hover:text-indigo-400 shrink-0" />
                <span className="truncate">{filePath}</span>
              </div>
              <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100 shrink-0 ml-2" />
            </a>
          ) : (
            <div
              key={`${filePath}-${idx}`}
              className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-xs font-mono text-slate-300 truncate"
            >
              <FileCode className="h-3.5 w-3.5 text-slate-500 shrink-0" />
              <span className="truncate">{filePath}</span>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
