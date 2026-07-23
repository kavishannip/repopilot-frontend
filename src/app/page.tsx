'use client';

import React from 'react';
import AppShell from '@/components/layout/AppShell';
import SectionCard from '@/components/shared/SectionCard';
import TagChip from '@/components/shared/TagChip';
import Markdown from '@/components/shared/Markdown';
import CodeBlock from '@/components/shared/CodeBlock';
import { Compass, Sparkles, Code2, Layers } from 'lucide-react';
import { Typography, Button } from '@wso2/oxygen-ui';

export default function Home() {
  return (
    <AppShell>
      {/* Hero Welcome Banner */}
      <section className="text-center space-y-4 py-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Progressive Disclosure Architecture</span>
        </div>
        <Typography variant="h3" className="font-extrabold text-slate-100 text-2xl md:text-4xl tracking-tight">
          Analyze Any Public GitHub Repository
        </Typography>
        <Typography variant="body1" className="text-slate-400 text-sm md:text-base max-w-xl mx-auto">
          From quick summary to deep structural analysis and interactive chat — unlocked step-by-step.
        </Typography>
      </section>

      {/* Demo Section Card & Primitives Showcase (Phase 1 Ready) */}
      <SectionCard
        title="Phase 1 — Navigation Shell & Primitives"
        subtitle="Core layout container (900px centered) with Oxygen UI styling and shared components."
        icon={<Layers className="h-5 w-5" />}
        badge={<TagChip label="Phase 1 Active" category="frontend" />}
        collapsible
      >
        <div className="space-y-6">
          {/* Tag Chips Row */}
          <div>
            <Typography variant="subtitle2" className="text-slate-300 font-semibold mb-2.5">
              Category Color Badges (<code className="text-indigo-300 font-mono">&lt;TagChip /&gt;</code>)
            </Typography>
            <div className="flex flex-wrap gap-2">
              <TagChip label="Frontend" category="frontend" />
              <TagChip label="Backend" category="backend" />
              <TagChip label="Database" category="database" />
              <TagChip label="DevOps" category="devops" />
              <TagChip label="Testing" category="testing" />
              <TagChip label="TypeScript" category="language" />
              <TagChip label="Next.js 15" category="framework" />
            </div>
          </div>

          {/* Shiki Code Block */}
          <div>
            <Typography variant="subtitle2" className="text-slate-300 font-semibold mb-2.5">
              Syntax Highlighted Code Block (<code className="text-indigo-300 font-mono">&lt;CodeBlock /&gt;</code>)
            </Typography>
            <CodeBlock
              code={`// Typed API Client Example
import { api } from '@/lib/api';

const summary = await api.getQuickSummary('https://github.com/owner/repo');
console.log(summary.metadata.name);`}
              language="typescript"
            />
          </div>

          {/* Markdown Renderer */}
          <div>
            <Typography variant="subtitle2" className="text-slate-300 font-semibold mb-2.5">
              Markdown Wrapper (<code className="text-indigo-300 font-mono">&lt;Markdown /&gt;</code>)
            </Typography>
            <Markdown
              content={`### Single-Page Pipeline
1. **Quick Summary**: Light inspection of \`README.md\` & package manifests.
2. **Deep Analysis**: Full semantic chunking, vector embedding, and structural dependency graph.
3. **Chat-with-Repo**: Context-aware QA with source citations.`}
            />
          </div>
        </div>
      </SectionCard>
    </AppShell>
  );
}
