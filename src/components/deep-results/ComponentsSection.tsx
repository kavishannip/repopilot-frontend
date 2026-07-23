'use client';

import React from 'react';
import SectionCard from '../shared/SectionCard';
import TagChip from '../shared/TagChip';
import { ComponentItem } from '@/lib/types';
import { hasData, isEmpty } from '@/lib/isEmpty';
import { getGitHubUrl } from '@/lib/utils';
import { Box, Typography, Chip } from '@wso2/oxygen-ui';
import { Box as BoxIcon, Folder, FileCode, ArrowRight, ExternalLink } from 'lucide-react';

interface ComponentsSectionProps {
  components: ComponentItem[];
  repoUrl?: string;
}

export default function ComponentsSection({ components, repoUrl }: ComponentsSectionProps) {
  if (isEmpty(components)) return null;

  return (
    <SectionCard
      title="Architectural Modules & Components"
      subtitle="High-level modular decomposition of repository features and packages."
      icon={<BoxIcon className="h-5 w-5" />}
      badge={<TagChip label={`${components.length} Components`} category="backend" />}
      collapsible
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {components.map((comp, idx) => (
          <div
            key={`${comp.name}-${idx}`}
            className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors"
          >
            {/* Component Header */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <Typography variant="h6" className="font-bold text-slate-100 text-base">
                  {comp.name}
                </Typography>
              </div>

              {hasData(comp.directory) && (
                <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-mono mt-0.5">
                  <Folder className="h-3.5 w-3.5" />
                  <span>{comp.directory}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {hasData(comp.description) && (
              <Typography variant="body2" className="text-slate-300 text-xs leading-relaxed">
                {comp.description}
              </Typography>
            )}

            {/* Key Files */}
            {hasData(comp.key_files) && (
              <div className="space-y-1 pt-1">
                <span className="text-[11px] font-semibold text-slate-400 block">Key Files:</span>
                <div className="flex flex-wrap gap-1.5">
                  {comp.key_files?.map((file) => {
                    const ghUrl = repoUrl ? getGitHubUrl(repoUrl, file) : undefined;
                    return ghUrl ? (
                      <a
                        key={file}
                        href={ghUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-indigo-300 font-mono text-[11px] border border-slate-800 transition-colors"
                      >
                        <FileCode className="h-3 w-3 text-slate-500" />
                        <span>{file}</span>
                        <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                      </a>
                    ) : (
                      <span key={file} className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 font-mono text-[11px] border border-slate-800">
                        {file}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Component Dependencies */}
            {hasData(comp.depends_on) && (
              <div className="space-y-1 pt-1">
                <span className="text-[11px] font-semibold text-slate-400 block">Depends On:</span>
                <div className="flex flex-wrap gap-1.5">
                  {comp.depends_on?.map((dep) => (
                    <Chip
                      key={dep}
                      label={dep}
                      size="small"
                      icon={<ArrowRight className="h-3 w-3" />}
                      className="h-5 bg-slate-900 text-slate-400 text-[10px] font-mono border border-slate-800"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Tech Chips */}
            {hasData(comp.technologies) && (
              <div className="flex flex-wrap gap-1 pt-1">
                {comp.technologies?.map((tech) => (
                  <TagChip key={tech} label={tech} category="framework" />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
