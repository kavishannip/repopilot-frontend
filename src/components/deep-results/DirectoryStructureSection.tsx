'use client';

import React from 'react';
import SectionCard from '../shared/SectionCard';
import CodeBlock from '../shared/CodeBlock';
import TagChip from '../shared/TagChip';
import { isEmpty } from '@/lib/isEmpty';
import { FolderTree } from 'lucide-react';

interface DirectoryStructureSectionProps {
  directoryStructure: string | object;
}

export default function DirectoryStructureSection({
  directoryStructure,
}: DirectoryStructureSectionProps) {
  if (isEmpty(directoryStructure)) return null;

  const content =
    typeof directoryStructure === 'string'
      ? directoryStructure
      : JSON.stringify(directoryStructure, null, 2);

  return (
    <SectionCard
      title="Directory Structure"
      subtitle="Visual file tree hierarchy of analyzed repository modules."
      icon={<FolderTree className="h-5 w-5" />}
      badge={<TagChip label="Tree View" category="devops" />}
      collapsible
      defaultExpanded={false}
    >
      <CodeBlock code={content} language="text" maxHeight="450px" />
    </SectionCard>
  );
}
