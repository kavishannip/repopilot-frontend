'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import SectionCard from '../shared/SectionCard';
import { Network } from 'lucide-react';
import { CircularProgress } from '@wso2/oxygen-ui';

const ArchitectureGraphCanvas = dynamic(
  () => import('./ArchitectureGraphCanvas'),
  {
    ssr: false,
    loading: () => (
      <SectionCard
        title="Architecture Dependency Graph"
        subtitle="Loading graph visualization engine..."
        icon={<Network className="h-5 w-5" />}
      >
        <div className="flex flex-col items-center justify-center p-12 space-y-3">
          <CircularProgress size={32} className="text-indigo-500" />
          <span className="text-xs text-slate-400 font-medium">Initializing graph canvas...</span>
        </div>
      </SectionCard>
    ),
  }
);

export default function ArchitectureGraph() {
  return <ArchitectureGraphCanvas />;
}
