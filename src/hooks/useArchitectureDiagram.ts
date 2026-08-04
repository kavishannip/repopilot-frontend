import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAppStore } from '@/stores/appStore';

export function useArchitectureDiagram() {
  const repoId = useAppStore((state) => state.repoId);
  const deepAnalysisResult = useAppStore((state) => state.deepAnalysisResult);

  // Check if cached diagram already in brief
  const cached = deepAnalysisResult?.architecture_diagram;

  const mutation = useMutation({
    mutationFn: async (forceRegenerate: boolean = false) => {
      if (!repoId) throw new Error('No repository ID. Run deep analysis first.');
      return api.generateArchitectureDiagram(repoId, forceRegenerate);
    },
  });

  return {
    // Prefer the cached version from the brief (set on first successful generate)
    mermaidCode: mutation.data?.mermaid_code ?? cached?.mermaid_code ?? null,
    diagramType: mutation.data?.diagram_type ?? cached?.diagram_type ?? 'graph',
    wasCached: mutation.data?.cached ?? Boolean(cached),
    isLoading: mutation.isPending,
    error: mutation.error,
    generate: (forceRegenerate: boolean = false) => mutation.mutate(forceRegenerate),
    hasData: Boolean(mutation.data?.mermaid_code ?? cached?.mermaid_code),
    hasBeenAttempted: mutation.isSuccess || mutation.isError,
  };

}
