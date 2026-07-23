'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import FolderNode from './FolderNode';
import FileNode from './FileNode';
import NodeDetailDrawer from './NodeDetailDrawer';
import SectionCard from '../shared/SectionCard';
import TagChip from '../shared/TagChip';
import EmptyState from '../shared/EmptyState';
import { useArchitectureGraph } from '@/hooks/useArchitectureGraph';
import { TextField, InputAdornment, Chip, CircularProgress } from '@wso2/oxygen-ui';
import { Network, Search, Filter, Sparkles, Layers } from 'lucide-react';

const nodeTypes = {
  folderNode: FolderNode,
  fileNode: FileNode,
};

export default function ArchitectureGraphCanvas() {
  const { data: graphData, isLoading, error } = useArchitectureGraph();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDeepOnly, setFilterDeepOnly] = useState(false);
  const [selectedNodeData, setSelectedNodeData] = useState<Record<string, unknown> | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const initialNodes = useMemo(() => graphData?.nodes || [], [graphData]);
  const initialEdges = useMemo(() => graphData?.edges || [], [graphData]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Synchronize when query completes
  React.useEffect(() => {
    if (graphData) {
      setNodes(graphData.nodes);
      setEdges(graphData.edges);
    }
  }, [graphData, setNodes, setEdges]);

  // Handle node selection click
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeData(node.data as Record<string, unknown>);
    setDrawerOpen(true);
  }, []);

  // Filter & Search Node Transformation
  const filteredNodes = useMemo(() => {
    return initialNodes.map((node) => {
      const label = String(node.data?.label || node.data?.path || '').toLowerCase();
      const searchMatch = searchTerm.trim() ? label.includes(searchTerm.toLowerCase().trim()) : true;
      const deepMatch = filterDeepOnly ? Boolean(node.data?.deep_analysis) : true;

      const hidden = !(searchMatch && deepMatch);
      const isHighlighted = Boolean(searchTerm.trim()) && searchMatch;

      return {
        ...node,
        hidden,
        selected: isHighlighted,
      };
    });
  }, [initialNodes, searchTerm, filterDeepOnly]);

  if (isLoading) {
    return (
      <SectionCard
        title="Architecture Dependency Graph"
        subtitle="Generating interactive file and module import dependency graph..."
        icon={<Network className="h-5 w-5" />}
      >
        <div className="flex flex-col items-center justify-center p-12 space-y-3">
          <CircularProgress size={32} className="text-indigo-500" />
          <span className="text-xs text-slate-400 font-medium">Layouting graph with ELK.js...</span>
        </div>
      </SectionCard>
    );
  }

  if (error || !graphData || initialNodes.length === 0) {
    return (
      <SectionCard
        title="Architecture Dependency Graph"
        subtitle="Visual representation of file import dependencies."
        icon={<Network className="h-5 w-5" />}
      >
        <EmptyState
          title="Graph Data Unavailable"
          description="Dependency graph details could not be loaded for this repository."
        />
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Architecture Dependency Graph"
      subtitle="Interactive file module structure and import flow diagram."
      icon={<Network className="h-5 w-5" />}
      badge={<TagChip label={`${initialNodes.length} Nodes`} category="frontend" />}
      collapsible
    >
      <div className="space-y-4">
        {/* Controls & Search Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
          {/* Search Input */}
          <div className="w-full sm:w-72">
            <TextField
              fullWidth
              size="small"
              placeholder="Search file or node..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search className="h-3.5 w-3.5 text-slate-400" />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '0.8rem',
                  fontFamily: 'monospace',
                  '& fieldset': { borderColor: 'rgba(51, 65, 85, 0.8)' },
                },
              }}
            />
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setFilterDeepOnly(!filterDeepOnly)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                filterDeepOnly
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Deep Analyzed Only</span>
            </button>
          </div>
        </div>

        {/* React Flow Fixed 500px Canvas */}
        <div className="h-[500px] w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950 relative">
          <ReactFlow
            nodes={filteredNodes}
            edges={initialEdges}
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
            fitView
            attributionPosition="bottom-right"
          >
            <Controls className="!bg-slate-900 !border-slate-800 !text-slate-200 !rounded-lg" />
            <MiniMap
              className="!bg-slate-900/90 !border-slate-800 !rounded-lg"
              nodeColor={(n) => (n.type === 'folderNode' ? '#f59e0b' : '#6366f1')}
              maskColor="rgba(15, 23, 42, 0.8)"
            />
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#334155" />
          </ReactFlow>
        </div>

        {/* Click Node Detail Drawer */}
        <NodeDetailDrawer
          nodeData={selectedNodeData}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
      </div>
    </SectionCard>
  );
}
