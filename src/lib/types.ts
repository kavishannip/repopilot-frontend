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
  cached_brief?: DeepAnalysisBrief;
  commit_sha?: string;
}

export interface CheckUpdateResponse {
  is_stale: boolean;
  cached_sha?: string | null;
  latest_sha?: string | null;
  changed_files_count: number;
  diff_summary?: {
    added: number;
    modified: number;
    removed: number;
  };
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
  architecture_diagram?: {
    mermaid_code: string;
    diagram_type: string;
  };
  [key: string]: unknown;
}

export interface ArchitectureDiagramResponse {
  mermaid_code: string;
  diagram_type: string;
  cached: boolean;
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

export interface RepositoryItem {
  id: string;
  repo_url: string;
  owner: string;
  name: string;
  language?: string | null;
  stars?: number | null;
  description?: string | null;
  has_quick_summary: boolean;
  has_deep_analysis: boolean;
  updated_at?: string | null;
}

export interface RepositoryDetailsResponse {
  id: string;
  repo_url: string;
  owner: string;
  name: string;
  quick_summary?: string | null;
  metadata?: RepoMetadata | null;
  brief?: DeepAnalysisBrief | null;
  commit_sha?: string | null;
}

export interface ChatSessionItem {
  id: string;
  repo_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}


