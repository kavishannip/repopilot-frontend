'use client';

import React from 'react';
import SectionCard from '../shared/SectionCard';
import TagChip from '../shared/TagChip';
import { LanguageBreakdown } from '@/lib/types';
import { hasData, isEmpty } from '@/lib/isEmpty';
import { Typography } from '@wso2/oxygen-ui';
import { Code2 } from 'lucide-react';

interface LanguageBreakdownSectionProps {
  breakdown: LanguageBreakdown;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Go: '#00ADD8',
  Rust: '#dea584',
  Java: '#b07219',
  C: '#555555',
  'C++': '#f34b7d',
};

export default function LanguageBreakdownSection({ breakdown }: LanguageBreakdownSectionProps) {
  if (isEmpty(breakdown)) return null;

  const entries = Object.entries(breakdown);
  const total = entries.reduce((acc, [, val]) => acc + (typeof val === 'number' ? val : 0), 0);

  return (
    <SectionCard
      title="Language Breakdown"
      subtitle="Programming language distribution across repository source files."
      icon={<Code2 className="h-5 w-5" />}
      badge={<TagChip label={`${entries.length} Languages`} category="language" />}
      collapsible
    >
      <div className="space-y-4">
        {/* Stacked Percentage Bar */}
        <div className="flex h-3.5 w-full overflow-hidden rounded-full bg-slate-900 border border-slate-800 p-0.5">
          {entries.map(([lang, val], idx) => {
            const num = typeof val === 'number' ? val : 0;
            const pct = total > 0 ? (num / total) * 100 : 0;
            const color = LANGUAGE_COLORS[lang] || `hsl(${(idx * 67) % 360}, 65%, 55%)`;

            return (
              <div
                key={lang}
                style={{ width: `${pct}%`, backgroundColor: color }}
                className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-300"
                title={`${lang}: ${pct.toFixed(1)}%`}
              />
            );
          })}
        </div>

        {/* Legend Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
          {entries.map(([lang, val], idx) => {
            const num = typeof val === 'number' ? val : 0;
            const pct = total > 0 ? (num / total) * 100 : 0;
            const color = LANGUAGE_COLORS[lang] || `hsl(${(idx * 67) % 360}, 65%, 55%)`;

            return (
              <div key={lang} className="flex items-center gap-2 text-xs">
                <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <span className="font-semibold text-slate-200 truncate">{lang}</span>
                <span className="text-slate-400 font-mono text-[11px] ml-auto">{pct.toFixed(1)}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </SectionCard>
  );
}
