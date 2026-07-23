'use client';

import React from 'react';
import { Drawer, Typography, IconButton, Button, Chip } from '@wso2/oxygen-ui';
import { X, ExternalLink, FileCode, Folder, Sparkles } from 'lucide-react';
import TagChip from '../shared/TagChip';
import { getGitHubUrl } from '@/lib/utils';
import { useAppStore } from '@/stores/appStore';

interface NodeDetailDrawerProps {
  nodeData: Record<string, unknown> | null;
  open: boolean;
  onClose: () => void;
}

export default function NodeDetailDrawer({
  nodeData,
  open,
  onClose,
}: NodeDetailDrawerProps) {
  const repoUrl = useAppStore((state) => state.repoUrl);

  if (!nodeData) return null;

  const path = String(nodeData.path || nodeData.label || '');
  const isFolder = nodeData.type === 'folder';
  const isDeepAnalyzed = Boolean(nodeData.deep_analysis);
  const ghUrl = repoUrl ? getGitHubUrl(repoUrl, path) : undefined;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 380 },
          backgroundColor: '#090d16',
          borderLeft: '1px solid rgba(30, 41, 59, 0.8)',
          color: '#f8fafc',
          padding: 3,
        },
      }}
    >
      <div className="flex flex-col h-full justify-between space-y-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                  isFolder
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-indigo-500/20 text-indigo-400'
                }`}
              >
                {isFolder ? <Folder className="h-5 w-5" /> : <FileCode className="h-5 w-5" />}
              </div>
              <div>
                <Typography variant="h6" className="font-bold text-slate-100 text-sm md:text-base font-mono">
                  {nodeData.label as string}
                </Typography>
                <span className="text-slate-400 text-xs capitalize">{nodeData.type as string}</span>
              </div>
            </div>

            <IconButton size="small" onClick={onClose} className="text-slate-400 hover:text-slate-200">
              <X className="h-4 w-4" />
            </IconButton>
          </div>

          {/* Path Details */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 block">Path</span>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-300 break-all">
              {path}
            </div>
          </div>

          {/* Attributes List */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-slate-400 block">Node Properties</span>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
                <span className="text-slate-400">Node Type</span>
                <TagChip label={isFolder ? 'Directory' : 'Source File'} category={isFolder ? 'devops' : 'language'} />
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
                <span className="text-slate-400">Deep Analysis Status</span>
                {isDeepAnalyzed ? (
                  <Chip
                    icon={<Sparkles className="h-3 w-3 text-amber-400" />}
                    label="Indexed & Vectorized"
                    size="small"
                    className="bg-amber-500/20 text-amber-300 font-semibold text-[10px]"
                  />
                ) : (
                  <Chip label="Structural Node" size="small" className="bg-slate-800 text-slate-400 text-[10px]" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        {ghUrl && (
          <a href={ghUrl} target="_blank" rel="noopener noreferrer" className="w-full">
            <Button
              fullWidth
              variant="contained"
              className="h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2"
            >
              <span>View Source on GitHub</span>
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        )}
      </div>
    </Drawer>
  );
}
