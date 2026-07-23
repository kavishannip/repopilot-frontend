'use client';

import React from 'react';
import { Box, Chip, Typography, Alert } from '@wso2/oxygen-ui';
import { Star, GitFork, Eye, Bug, HardDrive, Users, ShieldAlert, GitBranch, Scale, Lock, Globe } from 'lucide-react';
import { RepoMetadata } from '@/lib/types';
import { hasData, isEmpty } from '@/lib/isEmpty';
import { formatFileSize } from '@/lib/utils';

interface MetadataGridProps {
  metadata: RepoMetadata;
}

export default function MetadataGrid({ metadata }: MetadataGridProps) {
  if (isEmpty(metadata)) return null;

  // Numeric Stats Definitions
  const numericStats = [
    { key: 'stars', label: 'Stars', value: metadata.stars, icon: <Star className="h-4 w-4 text-amber-400" /> },
    { key: 'forks', label: 'Forks', value: metadata.forks, icon: <GitFork className="h-4 w-4 text-indigo-400" /> },
    { key: 'watchers', label: 'Watchers', value: metadata.watchers, icon: <Eye className="h-4 w-4 text-cyan-400" /> },
    { key: 'open_issues', label: 'Open Issues', value: metadata.open_issues, icon: <Bug className="h-4 w-4 text-rose-400" /> },
    { key: 'contributors', label: 'Contributors', value: metadata.contributors_count, icon: <Users className="h-4 w-4 text-emerald-400" /> },
    {
      key: 'size',
      label: 'Size',
      value: hasData(metadata.size_kb) ? formatFileSize(metadata.size_kb) : null,
      icon: <HardDrive className="h-4 w-4 text-purple-400" />,
      isString: true,
    },
  ].filter((s) => hasData(s.value));

  return (
    <div className="space-y-4">
      {/* Archived Warning Banner if applicable */}
      {metadata.archived === true && (
        <Alert severity="warning" icon={<ShieldAlert className="h-4 w-4" />} className="bg-amber-950/40 border border-amber-800/60 text-amber-300 rounded-xl">
          This repository is archived by the owner. It is read-only and no longer actively maintained.
        </Alert>
      )}

      {/* Numeric Stats Grid */}
      {numericStats.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {numericStats.map((stat) => (
            <div
              key={stat.key}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-sm"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800/60">
                {stat.icon}
              </div>
              <div className="min-w-0">
                <Typography variant="caption" className="text-slate-400 text-[11px] block leading-none">
                  {stat.label}
                </Typography>
                <span className="font-bold text-slate-100 text-sm tracking-tight truncate block mt-0.5">
                  {stat.isString ? stat.value : Number(stat.value).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Badges & Key Metadata Row */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {hasData(metadata.language) && (
          <Chip
            icon={<Globe className="h-3.5 w-3.5" />}
            label={metadata.language}
            size="small"
            className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium"
          />
        )}

        {hasData(metadata.visibility) && (
          <Chip
            icon={<Lock className="h-3.5 w-3.5" />}
            label={metadata.visibility}
            size="small"
            className="bg-slate-800 text-slate-300 border border-slate-700 font-medium"
          />
        )}

        {hasData(metadata.default_branch) && (
          <Chip
            icon={<GitBranch className="h-3.5 w-3.5" />}
            label={metadata.default_branch}
            size="small"
            className="bg-slate-800/80 text-slate-300 border border-slate-700/80 font-mono text-[11px]"
          />
        )}

        {hasData(metadata.license) && (
          <Chip
            icon={<Scale className="h-3.5 w-3.5" />}
            label={metadata.license}
            size="small"
            className="bg-slate-800/60 text-slate-300 border border-slate-700/60 font-medium"
          />
        )}

        {metadata.is_fork === true && (
          <Chip
            icon={<GitFork className="h-3.5 w-3.5 text-indigo-400" />}
            label={hasData(metadata.parent_repo) ? `Forked from ${metadata.parent_repo}` : 'Forked Repository'}
            size="small"
            className="bg-indigo-950/40 text-indigo-300 border border-indigo-800/60 font-medium"
          />
        )}
      </div>
    </div>
  );
}
