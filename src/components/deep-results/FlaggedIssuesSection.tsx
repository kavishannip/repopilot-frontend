'use client';

import React from 'react';
import SectionCard from '../shared/SectionCard';
import TagChip from '../shared/TagChip';
import { FlaggedIssueItem } from '@/lib/types';
import { hasData, isEmpty } from '@/lib/isEmpty';
import { Alert, Typography } from '@wso2/oxygen-ui';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface FlaggedIssuesSectionProps {
  issues: (string | FlaggedIssueItem)[];
}

export default function FlaggedIssuesSection({ issues }: FlaggedIssuesSectionProps) {
  if (isEmpty(issues)) return null;

  return (
    <SectionCard
      title="Flagged Concerns & Observations"
      subtitle="Potential structural anti-patterns, security considerations, or missing configurations."
      icon={<AlertTriangle className="h-5 w-5 text-amber-400" />}
      badge={<TagChip label={`${issues.length} Flagged`} category="testing" />}
      collapsible
    >
      <div className="space-y-3">
        {issues.map((issue, idx) => {
          const isObj = typeof issue === 'object' && issue !== null;
          const severity = isObj ? (issue as FlaggedIssueItem).severity || 'warning' : 'warning';
          const description = isObj ? (issue as FlaggedIssueItem).description || (issue as FlaggedIssueItem).title : String(issue);
          const location = isObj ? (issue as FlaggedIssueItem).location : undefined;

          return (
            <Alert
              key={idx}
              severity={severity === 'error' ? 'error' : severity === 'info' ? 'info' : 'warning'}
              className="bg-slate-950/80 border border-slate-800 rounded-xl text-xs md:text-sm text-slate-200"
            >
              <div className="space-y-1">
                <Typography variant="body2" className="text-slate-200 text-xs md:text-sm font-medium">
                  {description}
                </Typography>
                {hasData(location) && (
                  <span className="font-mono text-[11px] text-slate-400 block">
                    Location: <code className="text-amber-300 font-mono">{location}</code>
                  </span>
                )}
              </div>
            </Alert>
          );
        })}
      </div>
    </SectionCard>
  );
}
