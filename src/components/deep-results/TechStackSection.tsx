'use client';

import React from 'react';
import SectionCard from '../shared/SectionCard';
import TagChip from '../shared/TagChip';
import { Layers, Cpu } from 'lucide-react';
import { TechStackItem } from '@/lib/types';
import { hasData, isEmpty } from '@/lib/isEmpty';
import { Typography, Chip } from '@wso2/oxygen-ui';

interface TechStackSectionProps {
  techStack: TechStackItem[];
  frameworkDetails?: Record<string, unknown>;
}

export default function TechStackSection({
  techStack,
  frameworkDetails,
}: TechStackSectionProps) {
  if (isEmpty(techStack) && isEmpty(frameworkDetails)) return null;

  // Dynamically group tech stack by category
  const groupedTech: Record<string, TechStackItem[]> = {};
  if (Array.isArray(techStack)) {
    techStack.forEach((item) => {
      const category = item.category || 'Other';
      if (!groupedTech[category]) groupedTech[category] = [];
      groupedTech[category].push(item);
    });
  }

  return (
    <SectionCard
      title="Technology Stack"
      subtitle="Detected frameworks, libraries, runtime environments, and tools."
      icon={<Layers className="h-5 w-5" />}
      badge={<TagChip label={`${techStack?.length || 0} Technologies`} category="framework" />}
      collapsible
    >
      <div className="space-y-6">
        {/* Categorized Tech Cards */}
        {Object.entries(groupedTech).map(([category, items]) => (
          <div key={category} className="space-y-3">
            <div className="flex items-center gap-2">
              <Typography variant="subtitle2" className="font-semibold text-slate-300 capitalize text-sm">
                {category}
              </Typography>
              <Chip label={items.length} size="small" className="h-4 bg-slate-800 text-slate-400 text-[10px]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {items.map((item, idx) => (
                <div
                  key={`${item.name}-${idx}`}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-100 text-sm">{item.name}</span>
                    {hasData(item.version) && (
                      <Chip
                        label={item.version}
                        size="small"
                        className="h-4 bg-indigo-500/10 text-indigo-400 font-mono text-[10px] border border-indigo-500/20"
                      />
                    )}
                  </div>
                  {hasData(item.purpose) && (
                    <Typography variant="caption" className="text-slate-400 text-xs block leading-relaxed">
                      {item.purpose}
                    </Typography>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Framework Details Table if present */}
        {hasData(frameworkDetails) && (
          <div className="pt-4 border-t border-slate-800/80 space-y-3">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-indigo-400" />
              <Typography variant="subtitle2" className="font-semibold text-slate-300 text-sm">
                Framework Details
              </Typography>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="min-w-full divide-y divide-slate-800 text-left text-xs">
                <tbody className="divide-y divide-slate-800/60">
                  {Object.entries(frameworkDetails!).map(([key, val]) => (
                    <tr key={key}>
                      <td className="px-4 py-2 bg-slate-900/60 font-mono font-medium text-slate-300 w-1/3">
                        {key}
                      </td>
                      <td className="px-4 py-2 text-slate-300 font-mono">
                        {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
}
