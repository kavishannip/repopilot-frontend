'use client';

import React from 'react';
import { Box, Typography } from '@wso2/oxygen-ui';
import { Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({
  title = 'No Data Available',
  description = 'This section has no details to display for the current repository.',
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Box
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-slate-800 bg-slate-900/30 text-slate-400',
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800/60 text-slate-400 mb-3">
        {icon || <Inbox className="h-6 w-6" />}
      </div>
      <Typography variant="subtitle1" className="font-medium text-slate-300 text-sm md:text-base">
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" className="text-slate-500 text-xs md:text-sm max-w-sm mt-1">
          {description}
        </Typography>
      )}
      {action && <div className="mt-4">{action}</div>}
    </Box>
  );
}
