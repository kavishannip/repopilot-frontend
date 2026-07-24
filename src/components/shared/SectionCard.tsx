'use client';

import React, { useState } from 'react';
import { Paper, IconButton, Typography, Collapse } from '@wso2/oxygen-ui';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

export default function SectionCard({
  title,
  subtitle,
  icon,
  badge,
  collapsible = false,
  defaultExpanded = true,
  children,
  className,
  headerAction,
}: SectionCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <Paper
      elevation={0}
      className={cn(
        'border border-slate-800 bg-slate-900/60 backdrop-blur-md rounded-xl p-5 md:p-6 transition-all duration-300 hover:border-slate-700/80 shadow-lg shadow-black/20',
        className
      )}
    >
      <div
        className={cn(
          'flex items-center justify-between gap-3',
          collapsible && 'cursor-pointer select-none'
        )}
        onClick={() => collapsible && setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3 min-w-0">
          {icon && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {icon}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <Typography variant="h6" className="font-semibold text-slate-100 text-base md:text-lg tracking-tight">
                {title}
              </Typography>
              {badge}
            </div>
            {subtitle && (
              <Typography variant="body2" className="text-slate-400 text-xs md:text-sm mt-0.5">
                {subtitle}
              </Typography>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
          {headerAction}
          {collapsible && (
            <IconButton
              size="small"
              onClick={() => setExpanded(!expanded)}
              aria-label={expanded ? 'Collapse section' : 'Expand section'}
              className="text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            >
              {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </IconButton>
          )}
        </div>
      </div>

      {collapsible ? (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <div className="pt-5 border-t border-slate-800/80 mt-4">{children}</div>
        </Collapse>
      ) : (
        <div className="pt-4 border-t border-slate-800/60 mt-4">{children}</div>
      )}
    </Paper>
  );
}
