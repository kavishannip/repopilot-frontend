'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Folder } from 'lucide-react';

export default memo(function FolderNode({ data, selected }: NodeProps) {
  const label = String(data.label || data.path || 'folder');
  const childCount = data.child_count;

  return (
    <div
      className={`group px-3.5 py-2.5 rounded-xl bg-slate-900/90 border transition-all duration-200 min-w-[180px] shadow-lg ${
        selected
          ? 'border-indigo-500 ring-2 ring-indigo-500/30 shadow-indigo-500/20'
          : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900'
      }`}
    >
      <Handle type="target" position={Position.Top} className="w-2.5 h-2.5 !bg-indigo-500 !border-slate-900" />
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
          <Folder className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="font-bold text-slate-200 text-xs truncate block font-mono">
            {label}
          </span>
          {typeof childCount === 'number' && (
            <span className="text-[10px] text-slate-400 font-medium block">
              {childCount} items
            </span>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2.5 h-2.5 !bg-indigo-500 !border-slate-900" />
    </div>
  );
});
