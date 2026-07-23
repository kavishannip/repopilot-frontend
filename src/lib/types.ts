/**
 * TypeScript Interfaces for RepoPilot Phase 1
 */

// Step navigation state
export type AppStep = 'input' | 'quick_summary' | 'analyzing' | 'results' | 'chat';

// Backend Analysis Pipeline Phases
export type JobPhase =
  | 'queued'
  | 'embedding'
  | 'structural_map'
  | 'search'
  | 'group_summaries'
  | 'synthesis'
  | 'completed'
  | 'failed';

// Generic Repo Metadata (Backend quicksummary & deep analysis)
export interface RepoMetadata {
  owner?: string;
  name?: string;
  description?: string;
  homepage?: string;
  language?: string;
  stars?: number;
  forks?: number;
  watchers?: number;
  open_issues?: number;
  size_kb?: number;
  default_branch?: string;
  visibility?: string;
  is_fork?: boolean;
  parent_repo?: string;
  archived?: boolean;
  license?: string;
  topics?: string[];
  created_at?: string;
  updated_at?: string;
  pushed_at?: string;
  contributors_count?: number;
  network_count?: number;
  has_wiki?: boolean;
  has_discussions?: boolean;
  [key: string]: unknown; // Allow backend extensibility
}

// Quick Summary API Response
export interface QuickSummaryResponse {
  repo_id: string;
  repo_url: string;
  metadata: RepoMetadata;
  summary: string;
  cached?: boolean;
}

// Analyze Trigger Response
export interface AnalyzeJobResponse {
  job_id: string;
  status: JobPhase;
  message?: string;
  cached?: boolean;
}

// Job Status Response
export interface JobStatusResponse {
  job_id: string;
  status: JobPhase;
  progress?: number;
  current_phase_label?: string;
  error?: string;
  result?: DeepAnalysisBrief;
}

// Tech Stack Item
export interface TechStackItem {
  name: string;
  category: string;
  version?: string;
  purpose?: string;
}

// Architecture Component Item
export interface ComponentItem {
  name: string;
  directory?: string;
  description?: string;
  key_files?: string[];
  depends_on?: string[];
  technologies?: string[];
  [key: string]: unknown;
}

// Entry Point Item
export interface EntryPointItem {
  file_path: string;
  description?: string;
  type?: string;
  [key: string]: unknown;
}

// Flagged Issue Item
export interface FlaggedIssueItem {
  title?: string;
  description?: string;
  severity?: 'error' | 'warning' | 'info';
  location?: string;
  [key: string]: unknown;
}

export type LanguageBreakdown = Record<string, number>;

// Deep Analysis Brief / Results Dashboard Payload
export interface DeepAnalysisBrief {
  summary?: string;
  detected_patterns?: string[];
  project_types?: string[];
  repo_metadata?: RepoMetadata;
  tech_stack?: TechStackItem[];
  framework_details?: Record<string, string>;
  architecture_summary?: string;
  data_flow?: string;
  components?: ComponentItem[];
  entry_points?: EntryPointItem[];
  flagged_issues?: (string | FlaggedIssueItem)[];
  language_breakdown?: LanguageBreakdown;
  directory_structure?: string;
  selected_files?: string[];
  [key: string]: unknown;
}

// Architecture Graph Types
export interface GraphNodeData {
  label: string;
  path: string;
  type: 'folder' | 'file';
  deep_analysis?: boolean;
  size?: number;
  language?: string;
  [key: string]: unknown;
}

export interface GraphNode {
  id: string;
  type?: 'folderNode' | 'fileNode' | string;
  data: GraphNodeData;
  position?: { x: number; y: number };
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: 'contains' | 'imports' | string;
}

export interface ArchitectureGraphResponse {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// Chat Types
export interface ChatMessageSource {
  file_path: string;
  snippet?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sufficient?: boolean;
  retrieved_chunks_count?: number;
  fallback_triggered?: boolean;
  sources?: ChatMessageSource[];
}

export interface CreateChatSessionResponse {
  session_id: string;
  repo_id: string;
}

export interface SendChatMessageRequest {
  session_id: string;
  message: string;
}

export interface SendChatMessageResponse {
  answer: string;
  sufficient: boolean;
  retrieved_chunks_count: number;
  fallback_triggered?: boolean;
  sources?: ChatMessageSource[];
}
