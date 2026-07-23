'use client';

import React from 'react';
import SectionCard from '../shared/SectionCard';
import TagChip from '../shared/TagChip';
import Markdown from '../shared/Markdown';
import TechStackSection from './TechStackSection';
import ComponentsSection from './ComponentsSection';
import EntryPointsSection from './EntryPointsSection';
import FlaggedIssuesSection from './FlaggedIssuesSection';
import LanguageBreakdownSection from './LanguageBreakdownSection';
import DirectoryStructureSection from './DirectoryStructureSection';
import SelectedFilesSection from './SelectedFilesSection';
import { DeepAnalysisBrief } from '@/lib/types';
import { hasData, isEmpty } from '@/lib/isEmpty';
import { Sparkles, Compass, Workflow, FileText } from 'lucide-react';
import { Typography } from '@wso2/oxygen-ui';

interface ResultsRendererProps {
  brief: DeepAnalysisBrief;
  repoUrl?: string;
}

// Known top-level fields handled explicitly
const HANDLED_FIELDS = new Set([
  'summary',
  'detected_patterns',
  'project_types',
  'repo_metadata',
  'tech_stack',
  'framework_details',
  'architecture_summary',
  'data_flow',
  'components',
  'entry_points',
  'flagged_issues',
  'language_breakdown',
  'directory_structure',
  'selected_files',
  'graph',
]);

export default function ResultsRenderer({ brief, repoUrl }: ResultsRendererProps) {
  if (isEmpty(brief)) return null;

  // Identify any unhandled backend fields dynamically
  const unhandledFields = Object.entries(brief).filter(
    ([key, value]) => !HANDLED_FIELDS.has(key) && hasData(value)
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* 1. Executive Summary & Detected Patterns */}
      {hasData(brief.summary) && (
        <SectionCard
          title="Executive Architecture Brief"
          subtitle="Comprehensive synthesis generated from deep vector index and dependency graph."
          icon={<Sparkles className="h-5 w-5 text-indigo-400" />}
          badge={<TagChip label="Deep Analysis Complete" category="frontend" />}
        >
          <div className="space-y-4">
            <Markdown content={brief.summary!} />

            {/* Detected Patterns & Project Types Chips */}
            {(hasData(brief.detected_patterns) || hasData(brief.project_types)) && (
              <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-800/80">
                {hasData(brief.detected_patterns) &&
                  brief.detected_patterns?.map((pattern) => (
                    <TagChip key={pattern} label={`Pattern: ${pattern}`} category="backend" />
                  ))}

                {hasData(brief.project_types) &&
                  brief.project_types?.map((type) => (
                    <TagChip key={type} label={`Type: ${type}`} category="framework" />
                  ))}
              </div>
            )}
          </div>
        </SectionCard>
      )}

      {/* 2. Tech Stack */}
      {hasData(brief.tech_stack) && (
        <TechStackSection
          techStack={brief.tech_stack!}
          frameworkDetails={brief.framework_details}
        />
      )}

      {/* 3. Architectural Components */}
      {hasData(brief.components) && (
        <ComponentsSection components={brief.components!} repoUrl={repoUrl} />
      )}

      {/* 4. Entry Points */}
      {hasData(brief.entry_points) && (
        <EntryPointsSection entryPoints={brief.entry_points!} repoUrl={repoUrl} />
      )}

      {/* 5. Architecture Summary */}
      {hasData(brief.architecture_summary) && (
        <SectionCard
          title="System Architecture Details"
          subtitle="Layering, module hierarchy, and structural boundaries."
          icon={<Compass className="h-5 w-5" />}
          badge={<TagChip label="Architecture" category="backend" />}
          collapsible
        >
          <Markdown content={brief.architecture_summary!} />
        </SectionCard>
      )}

      {/* 6. Data Flow */}
      {hasData(brief.data_flow) && (
        <SectionCard
          title="Data & Request Flow"
          subtitle="Pathways of data payloads, API requests, and state management."
          icon={<Workflow className="h-5 w-5" />}
          badge={<TagChip label="Data Flow" category="database" />}
          collapsible
        >
          <Markdown content={brief.data_flow!} />
        </SectionCard>
      )}

      {/* 7. Flagged Concerns */}
      {hasData(brief.flagged_issues) && (
        <FlaggedIssuesSection issues={brief.flagged_issues!} />
      )}

      {/* 8. Language Breakdown */}
      {hasData(brief.language_breakdown) && (
        <LanguageBreakdownSection breakdown={brief.language_breakdown!} />
      )}

      {/* 9. Directory Structure */}
      {hasData(brief.directory_structure) && (
        <DirectoryStructureSection directoryStructure={brief.directory_structure!} />
      )}

      {/* 10. Selected Files */}
      {hasData(brief.selected_files) && (
        <SelectedFilesSection files={brief.selected_files!} repoUrl={repoUrl} />
      )}

      {/* 11. Catch-all for Future / Unknown Fields */}
      {unhandledFields.length > 0 && (
        <SectionCard
          title="Additional Metadata"
          subtitle="Extended architecture properties provided by the analyzer API."
          icon={<FileText className="h-5 w-5" />}
          collapsible
          defaultExpanded={false}
        >
          <div className="space-y-3">
            {unhandledFields.map(([key, val]) => (
              <div key={key} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <Typography variant="subtitle2" className="font-mono text-xs text-indigo-300 capitalize mb-1">
                  {key.replace(/_/g, ' ')}
                </Typography>
                {typeof val === 'string' ? (
                  <Markdown content={val} />
                ) : (
                  <pre className="text-xs font-mono text-slate-300 overflow-auto">
                    {JSON.stringify(val, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
