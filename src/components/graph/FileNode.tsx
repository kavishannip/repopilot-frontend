'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { FileCode, Sparkles } from 'lucide-react';

export default memo(function FileNode({ data, selected }: NodeProps) {
  const label = String(data.label || data.path || 'file');
  const isDeepAnalyzed = Boolean(data.deep_analysis);

  return (
    <div
      className={`group px-3.5 py-2.5 rounded-xl transition-all duration-200 min-w-[190px] shadow-lg ${
        isDeepAnalyzed
          ? 'bg-slate-900/95 border-amber-500/60 shadow-amber-500/10'
          : 'bg-slate-950/90 border-slate-800'
      } ${
        selected
          ? 'border-indigo-500 ring-2 ring-indigo-500/30 shadow-indigo-500/20'
          : 'hover:border-slate-700 hover:bg-slate-900'
      }`}
    >
      <Handle type="target" position={Position.Top} className="w-2.5 h-2.5 !bg-indigo-500 !border-slate-900" />
      <div className="flex items-center gap-2.5">
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-lg shrink-0 ${
            isDeepAnalyzed
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              : 'bg-slate-800 text-slate-400 border border-slate-700/60'
          }`}
        >
          <FileCode className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-slate-200 text-xs truncate block font-mono">
              {label}
            </span>
            {isDeepAnalyzed && (
              <Sparkles className="h-3 w-3 text-amber-400 shrink-0" />
            )}
          </div>
          <span className="text-[10px] text-slate-400 font-mono block truncate">
            {isDeepAnalyzed ? 'Deep Analyzed' : 'File Context'}
          </span>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2.5 h-2.5 !bg-indigo-500 !border-slate-900" />
    </div>
  );
});
