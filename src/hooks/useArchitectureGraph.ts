import { useQuery } from '@tanstack/react-query';
import ELK from 'elkjs/lib/elk.bundled.js';
import { api } from '@/lib/api';
import { useAppStore } from '@/stores/appStore';
import { ArchitectureGraphResponse, GraphNodeData } from '@/lib/types';
import { Node, Edge } from '@xyflow/react';

const elk = new ELK();

const ELK_OPTIONS = {
  'elk.algorithm': 'layered',
  'elk.direction': 'DOWN',
  'elk.layered.spacing.nodeNodeBetweenLayers': '80',
  'elk.spacing.nodeNode': '50',
};

export function useArchitectureGraph() {
  const repoUrl = useAppStore((state) => state.repoUrl);
  const deepAnalysisResult = useAppStore((state) => state.deepAnalysisResult);

  return useQuery<{ nodes: Node[]; edges: Edge[] }, Error>({
    queryKey: ['architectureGraph', repoUrl],
    queryFn: async () => {
      if (!repoUrl) throw new Error('No repository URL specified for architecture graph.');
      const data = await api.getArchitectureGraph(repoUrl);
      return layoutGraph(data);
    },
    enabled: Boolean(repoUrl) && Boolean(deepAnalysisResult),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

async function layoutGraph(graphData: ArchitectureGraphResponse): Promise<{ nodes: Node[]; edges: Edge[] }> {
  const rawNodes = graphData.nodes || [];
  const rawEdges = graphData.edges || [];

  if (rawNodes.length === 0) {
    return { nodes: [], edges: [] };
  }

  // Construct ELK graph structure
  const elkGraph = {
    id: 'root',
    layoutOptions: ELK_OPTIONS,
    children: rawNodes.map((node) => ({
      id: node.id,
      width: 220,
      height: 60,
    })),
    edges: rawEdges.map((edge, idx) => ({
      id: `e-${idx}-${edge.source}-${edge.target}`,
      sources: [edge.source],
      targets: [edge.target],
    })),
  };

  let layoutResult;
  try {
    layoutResult = await elk.layout(elkGraph);
  } catch {
    layoutResult = elkGraph;
  }

  const nodePositionMap = new Map<string, { x: number; y: number }>();
  layoutResult.children?.forEach((child) => {
    const item = child as unknown as { x?: number; y?: number };
    nodePositionMap.set(child.id, { x: item.x || 0, y: item.y || 0 });
  });

  const formattedNodes: Node[] = rawNodes.map((node) => {
    const pos = nodePositionMap.get(node.id) || { x: 0, y: 0 };
    const nodeData = node.data || {};
    const isFolder = nodeData.type === 'folder' || node.id.includes('/') && !node.id.includes('.');

    return {
      id: node.id,
      type: isFolder ? 'folderNode' : 'fileNode',
      position: pos,
      data: {
        ...nodeData,
        label: (nodeData.label as string) || node.id,
        path: (nodeData.path as string) || node.id,
        type: isFolder ? 'folder' : 'file',
        deep_analysis: Boolean(nodeData.deep_analysis),
      },
    };
  });

  const formattedEdges: Edge[] = rawEdges.map((edge, idx) => {
    const isImport = edge.type === 'imports' || edge.label === 'imports';
    return {
      id: `e-${idx}-${edge.source}-${edge.target}`,
      source: edge.source,
      target: edge.target,
      type: isImport ? 'smoothstep' : 'default',
      animated: isImport,
      style: {
        stroke: isImport ? '#6366f1' : '#475569',
        strokeWidth: isImport ? 2 : 1.5,
        strokeDasharray: isImport ? undefined : '5,5',
      },
      label: edge.label,
    };
  });

  return { nodes: formattedNodes, edges: formattedEdges };
}
