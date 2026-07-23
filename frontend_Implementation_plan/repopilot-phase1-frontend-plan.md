# RepoPilot — Phase 1: Repo Analyzer — Frontend Plan

## Project Overview

Frontend for RepoPilot Phase 1 — a public GitHub repo analyzer. The entire experience lives on a **single page with progressive disclosure**: Quick Summary → Deep Analysis → Chat, each step unlocking the next.

**Backend API** (`localhost:5000`):
- `POST /api/analyzer/quicksummary` → Quick summary + `repo_id`
- `POST /api/analyzer/analyze` → Submit async job → `job_id`
- `GET /api/analyzer/status/:job_id` → Poll phases: `queued → embedding → structural_map → search → group_summaries → synthesis → completed`
- `GET /api/analyzer/graph?repo_url=...` → Dependency graph nodes + edges
- `POST /api/chat/session` → Create chat session
- `POST /api/chat/message` → Send question → answer + metadata
- `GET /api/chat/session/:session_id` → Session history
- `DELETE /api/chat/session/:session_id` → Delete session

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 15.x |
| UI Components | WSO2 Oxygen UI | 0.12.x (MUI v7 wrapper) |
| Icons | `@wso2/oxygen-ui-icons-react` + Lucide | latest |
| Utility CSS | Tailwind CSS | v4.x |
| Graph Visualization | `@xyflow/react` (React Flow) | latest |
| Graph Layout | `elkjs` | latest |
| State Management | Zustand | latest |
| Data Fetching | TanStack React Query v5 | v5 |
| HTTP Client | Native `fetch` (thin typed wrapper in `lib/api.ts`) | — |
| Markdown | `react-markdown` + `remark-gfm` | latest |
| Code Highlighting | `shiki` | latest |
| Package Manager | pnpm | latest |

> **Why not Axios?** React Query v5 handles caching, polling, retries, and cancellation. A thin `fetch` wrapper is sufficient and preserves Next.js 15's native fetch cache extension. Axios adds 13KB for zero benefit here.

---

## Setup Notes (Corrections to Original Recommendations)

- `@mui/material-nextjs/**v15**-appRouter` — not v14 (matches Next.js 15)
- CSS Layers instead of disabling Preflight: `@layer theme, base, mui, components, utilities;` + `enableCssLayer: true` in `AppRouterCacheProvider`
- `npx @wso2/oxygen-ui init` (universal) — not `--claude` (Claude Code specific)
- Add peer deps: `@emotion/react @emotion/styled` alongside Oxygen UI install

---

## Progress Tracker

| # | Phase | Status |
|---|-------|--------|
| 0 | Project Scaffolding & Config | ⬜ Not started |
| 1 | Core Layout & Navigation Shell | ⬜ Not started |
| 2 | Repo Input & Quick Summary Card | ⬜ Not started |
| 3 | Deep Analysis Trigger & Job Progress | ⬜ Not started |
| 4 | Deep Analysis Results Dashboard | ⬜ Not started |
| 5 | Architecture Graph Visualization | ⬜ Not started |
| 6 | Chat-with-Repo | ⬜ Not started |
| 7 | Polish, Responsiveness & Dark Mode | ⬜ Not started |
| 8 | Testing & Deployment Prep | ⬜ Not started |

Status key: ⬜ Not started → 🟨 In progress → ✅ Done

---

## UX Flow: Single-Page Progressive Disclosure

```
[1] URL Input
      ↓ POST /quicksummary
[2] Quick Summary Card (with ⚠️ accuracy disclaimer)
      ↓ "Start Deep Analysis" button (tooltip: "Required to enable Chat")
[3] Analysis Progress (7-step pipeline, live polling)
      ↓ status === "completed"
[4] Quick Summary collapses → Deep Analysis Results expand
    + Separate Architecture Graph section below
      ↓ "Chat with this Repo" unlocked
[5] Chat Panel (Thinking... → fallback progress bar → answer)
```

All sections live on a single route. No page navigations between steps.

---

## Phase 0: Project Scaffolding & Config

### 0.1 — Initialize Next.js Project
- [ ] `npx -y create-next-app@latest ./ --ts --app --tailwind --eslint --src-dir --use-pnpm --no-import-alias`
- [ ] Verify dev server: `pnpm dev`

### 0.2 — Install Core Dependencies
- [ ] Oxygen UI + MUI SSR: `pnpm add @wso2/oxygen-ui @wso2/oxygen-ui-icons-react @mui/material-nextjs @emotion/cache @emotion/react @emotion/styled @mui/material`
- [ ] Data/state: `pnpm add @tanstack/react-query zustand`
- [ ] Graph: `pnpm add @xyflow/react elkjs`
- [ ] Utilities: `pnpm add react-markdown remark-gfm shiki`

### 0.3 — Configure Oxygen UI + Tailwind Coexistence
- [ ] `globals.css` — CSS layer order:
  ```css
  @layer theme, base, mui, components, utilities;
  @import 'tailwindcss';
  ```
- [ ] `app/layout.tsx` — provider wrapping:
  ```tsx
  <AppRouterCacheProvider options={{ enableCssLayer: true }}>
    <OxygenUIThemeProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </OxygenUIThemeProvider>
  </AppRouterCacheProvider>
  ```
- [ ] Extract providers into `components/Providers.tsx` (`"use client"`)

### 0.4 — Initialize AI Agent Docs
- [ ] `npx @wso2/oxygen-ui init` → verify `.ai/oxygen-ui/` created

### 0.5 — Project Structure
- [ ] Create directory layout:
  ```
  src/
  ├── app/
  │   ├── layout.tsx          # Root layout with providers
  │   ├── page.tsx            # Single-page app entry
  │   └── globals.css
  ├── components/
  │   ├── layout/             # AppShell, Navbar
  │   ├── input/              # RepoUrlInput
  │   ├── quick-summary/      # QuickSummaryCard, MetadataGrid
  │   ├── progress/           # AnalysisProgressStepper
  │   ├── deep-results/       # All results section components
  │   ├── graph/              # ArchitectureGraph, custom nodes/edges
  │   ├── chat/               # ChatPanel, ChatMessage, ChatInput
  │   └── shared/             # Markdown, CodeBlock, EmptyState, Skeleton
  ├── lib/
  │   ├── api.ts              # Typed fetch wrapper
  │   ├── types.ts            # All TypeScript interfaces
  │   ├── constants.ts        # API base URL, phase labels
  │   └── utils.ts            # isEmpty, formatDate, techCategoryColor, etc.
  ├── hooks/
  │   ├── useQuickSummary.ts
  │   ├── useAnalyze.ts
  │   ├── useJobStatus.ts     # With polling
  │   ├── useGraphData.ts
  │   └── useChat.ts
  └── stores/
      └── appStore.ts         # Zustand: currentStep, repoId, jobId, sessionId
  ```
- [ ] `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:5000`

---

## Phase 1: Core Layout & Navigation Shell

### 1.1 — App Shell
- [ ] Single-column centered layout (max-width `900px`) with top navbar
- [ ] Navbar: RepoPilot logo + dark/light mode toggle
- [ ] No sidebar for Phase 1 (single-repo focus, not multi-repo list)

### 1.2 — Theme Configuration
- [ ] Customize Oxygen UI theme: deep blue/indigo primary, neutral grays
- [ ] Dark mode as default
- [ ] Code block monospace font (JetBrains Mono via Google Fonts)

### 1.3 — Shared Primitives
- [ ] `<Markdown>` wrapper (react-markdown + remark-gfm)
- [ ] `<CodeBlock>` with Shiki highlighting + copy button
- [ ] `<SectionCard>` — Oxygen UI `Paper` wrapper with title + optional collapse toggle
- [ ] `<EmptyState>` — shown when a section has no data
- [ ] `<TagChip>` — Oxygen UI `Chip` with category color coding

---

## Phase 2: Repo Input & Quick Summary Card

### 2.1 — Repo URL Input
- [ ] `RepoUrlInput` component:
  - Oxygen UI `TextField` with GitHub URL regex validation
  - Loading spinner in submit button while calling API
  - Paste-from-clipboard icon button
  - Example URL hint: `https://github.com/owner/repo`
- [ ] On submit: call `POST /api/analyzer/quicksummary`
- [ ] Error handling: show Oxygen UI `Alert` for invalid URL / repo too large / private repo

### 2.2 — Quick Summary Card
After successful response, show `QuickSummaryCard` below the input.

> **Dynamic rendering principle**: every field is guarded by `isEmpty()` before rendering. The example response is illustrative — if the backend adds new metadata fields, they render automatically via the metadata grid pattern. Never hardcode a field list.

- [ ] **Accuracy disclaimer banner** (always visible at top of card):
  ```
  ⚡ Quick Summary — Based on README and package manifests only.
  Results may be incomplete or less accurate than a Deep Analysis.
  ```

- [ ] **Repo Header** (always shown — minimum viable data):
  - `{metadata.owner} / {metadata.name}` as title
  - `metadata.description` as subtitle — skip if `isEmpty()`
  - Homepage link chip — skip if `isEmpty(metadata.homepage)`

- [ ] **Stats Row** — generic numeric stat grid. For each numeric field in `metadata`:
  - Map field name → label + icon (stars ⭐, forks 🍴, watchers 👁, open_issues 🐛, size_kb 📦, etc.)
  - Skip any stat where `isEmpty()` is true
  - `size_kb` converted to MB, never skipped

- [ ] **Badges Row** — for each string/boolean field in `metadata`:
  - `language`, `default_branch`, `visibility` → always show if non-null
  - `is_fork === true` → show fork badge + `parent_repo` link
  - `archived === true` → show warning banner
  - `license` → skip if null or `"None"`
  - Any other string field the backend adds → show as generic badge

- [ ] **Topics** — `metadata.topics[]`: render each as `<TagChip>`. Skip entire row if `isEmpty()`.

- [ ] **Activity Dates** — any date-shaped fields (`*_at` suffix): render as formatted date row. Skip individual dates that are null.

- [ ] **AI Quick Summary** — `summary` field: always shown via `<Markdown>`.

- [ ] **Deep Analysis CTA** (at bottom of card):
  ```
  [ 🔬 Run Deep Analysis ]
  ℹ️ Deep Analysis is required to enable Chat and see full architecture details.
  ```

### 2.3 — Core Dynamic Rendering Utility
- [ ] Create `lib/isEmpty.ts` — the single source of truth for field visibility:
  ```ts
  /**
   * Returns true if a value should NOT be rendered.
   * Covers: null, undefined, empty string, 0 (for counts),
   * "None"/"null" strings (backend sentinels), empty arrays, empty objects.
   * Apply this guard before rendering ANY dynamic field.
   */
  export const isEmpty = (v: unknown): boolean => {
    if (v == null) return true;
    if (typeof v === 'string') return v.trim() === '' || v === 'None' || v === 'null';
    if (typeof v === 'number') return v === 0;
    if (Array.isArray(v)) return v.length === 0;
    if (typeof v === 'object') return Object.keys(v as object).length === 0;
    return false;
  };

  /** Returns true only if value has meaningful data to display. */
  export const hasData = (v: unknown): boolean => !isEmpty(v);
  ```
- [ ] **Rule**: every optional UI section is wrapped with `{hasData(field) && <Section ... />}`
- [ ] **Rule**: never enumerate a static list of "fields to show" in component code — always iterate the actual response data

---

## Phase 3: Deep Analysis Trigger & Job Progress

### 3.1 — Analysis Trigger
- [ ] "Run Deep Analysis" button calls `POST /api/analyzer/analyze` with `{ repo_id }`
- [ ] If response `status === "completed"` (cache hit): skip progress, go directly to results
- [ ] If `status === "pending"`: store `job_id`, start polling

### 3.2 — Analysis Progress Stepper
While polling `GET /api/analyzer/status/:job_id`:

- [ ] **`AnalysisProgressStepper`** component — Oxygen UI `Stepper` (vertical layout):

  | Phase value | Label | Description |
  |---|---|---|
  | `queued` | Queued | Waiting to start... |
  | `embedding` | Embedding Code | Chunking and vectorizing repository files |
  | `structural_map` | Mapping Structure | Building file and import dependency graph |
  | `search` | Semantic Search | Retrieving relevant code context |
  | `group_summaries` | Summarizing Groups | Generating per-module AI summaries |
  | `synthesis` | Synthesizing | Creating final architecture report |
  | `done` | Complete | Analysis complete ✓ |

- [ ] Active phase: pulse animation on step icon
- [ ] Completed phases: green checkmark
- [ ] Current phase description rendered below stepper
- [ ] Poll every **3 seconds** (`refetchInterval: 3000`)
- [ ] Auto-stop when `status === "completed"` or `status === "failed"`
- [ ] On failure: show `Alert` with `error` message + "Try Again" button

### 3.3 — State Management
- [ ] Zustand `appStore`: track `{ step, repoId, repoUrl, jobId, brief, sessionId }`
- [ ] Steps: `'input' | 'quick_summary' | 'analyzing' | 'results' | 'chat'`

---

## Phase 4: Deep Analysis Results Dashboard

When `status === "completed"`:
- Collapse `QuickSummaryCard` (animate to accordion — click to re-expand)
- Reveal full results below

### 4.1 — Results Layout: Dynamic Section Rendering

> **Core principle**: sections are not hardcoded. The response schema defines what *can* exist. Each section component checks `hasData()` on its source field — if falsy, the section is not mounted at all. If the backend adds a new field in a future version, it will appear automatically once a renderer is wired for that field type.

- [ ] Build a `<ResultsRenderer brief={result} repoMeta={metadata} />` component that owns section ordering
- [ ] Section render order (each wrapped in `{hasData(field) && <Section />}`):
  1. Summary + Patterns
  2. Repo Metadata & Stats
  3. Tech Stack
  4. Architecture Overview
  5. Data Flow
  6. Components
  7. Entry Points
  8. Architecture Graph (Phase 5 — always shown after deep analysis)
  9. Flagged Issues
  10. Language Breakdown
  11. Directory Structure
  12. Selected Files
  13. *(Any future fields the backend adds — handled via catch-all unknown field renderer)*

### 4.2 — Summary Section
- [ ] `result.summary` via `<Markdown>` — always shown (core output, never skip)
- [ ] `result.detected_patterns[]` → chips — `{hasData(result.detected_patterns) && ...}`
- [ ] `result.project_types[]` → chips — `{hasData(result.project_types) && ...}`

### 4.3 — Repo Metadata & Stats Section
*Source: `result.repo_metadata` (or `metadata` from quick summary)*

- [ ] **Generic stat grid renderer** — iterate over all numeric fields in the object, render each as a stat chip if `hasData()`. Don't name-check individual fields:
  ```ts
  const NUMERIC_LABELS: Record<string, { label: string; icon: string }> = {
    stars: { label: 'Stars', icon: '⭐' },
    forks: { label: 'Forks', icon: '🍴' },
    watchers: { label: 'Watchers', icon: '👁' },
    open_issues: { label: 'Open Issues', icon: '🐛' },
    contributors_count: { label: 'Contributors', icon: '👥' },
    network_count: { label: 'Network', icon: '🔗' },
    // Add new numeric fields here as backend adds them
  };
  // Render: Object.entries(repo_metadata).filter numeric + hasData()
  ```
- [ ] **String/badge fields**: `language`, `default_branch`, `visibility`, `license` (skip if `isEmpty`) — rendered as `<Chip>` badges
- [ ] **Boolean feature flags**: `is_fork`, `archived`, `has_wiki`, `has_discussions` — rendered as a feature row with icons, only if true
- [ ] **Date fields**: any field with `_at` suffix → formatted as human-readable date, skip if null
- [ ] **String fields with links**: `homepage`, `parent_repo` → rendered as external link chips
- [ ] **Array fields**: `topics[]` → `<TagChip>` list, skip if empty
- [ ] **Hide entire section** if every field in `repo_metadata` is `isEmpty()`

### 4.4 — Tech Stack Section
*Source: `result.tech_stack[]`*

- [ ] Skip if `isEmpty(result.tech_stack)`
- [ ] Group by `item.category` — the category value itself comes from the response, not hardcoded:
  ```ts
  const grouped = groupBy(tech_stack, (t) => t.category); // dynamic grouping
  ```
- [ ] Each group header: `category` label (capitalized) + count
- [ ] Each tech card: `name` (required), `version` chip (skip if `isEmpty(version)`), `purpose` text
- [ ] Category color mapping: define a default palette, fall back to neutral gray for unknown categories
- [ ] `result.framework_details` → compact key-value table — `{hasData(result.framework_details) && ...}`

### 4.5 — Architecture Overview Section
*Source: `result.architecture_summary`*

- [ ] `{hasData(result.architecture_summary) && <Markdown>{result.architecture_summary}</Markdown>}`
- [ ] Inline `[path/to/file]` refs → render as `<code>` spans

### 4.6 — Data Flow Section
*Source: `result.data_flow`*

- [ ] `{hasData(result.data_flow) && <Markdown>{result.data_flow}</Markdown>}`
- [ ] Same inline file-ref handling as architecture summary

### 4.7 — Components Section
*Source: `result.components[]`*

- [ ] `{hasData(result.components) && <ComponentsSection items={result.components} />}`
- [ ] Each component card renders all sub-fields conditionally:
  - `name` + `directory` — always shown
  - `description` — shown if `hasData()`
  - `key_files[]` — shown if `hasData()`; link each to GitHub
  - `depends_on[]` — shown if `hasData()`
  - `technologies[]` — shown if `hasData()`; first 8 + expand
  - *Any future sub-fields the backend adds* — rendered as a generic key-value row

### 4.8 — Entry Points Section
*Source: `result.entry_points[]`*

- [ ] `{hasData(result.entry_points) && <EntryPointsSection items={result.entry_points} />}`
- [ ] Each item: `file_path` as code chip (GitHub link) + `description` text

### 4.9 — Flagged Issues Section
*Source: `result.flagged_issues[]`*

- [ ] `{hasData(result.flagged_issues) && <FlaggedIssuesSection items={result.flagged_issues} />}`
- [ ] Each issue as Oxygen UI `Alert` severity="warning"
- [ ] **If array is empty: section is not mounted at all** — no empty card shown

### 4.10 — Language Breakdown Section
*Source: `result.language_breakdown`*

- [ ] `{hasData(result.language_breakdown) && <LanguageBreakdown data={result.language_breakdown} />}`
- [ ] Iterate `Object.entries(language_breakdown)` dynamically — works for any language set
- [ ] Stacked bar: each entry as a colored segment with label + percentage
- [ ] Color map: define known languages; fallback to generated hue for unknowns

### 4.11 — Directory Structure Section
*Source: `result.directory_structure`*

- [ ] `{hasData(result.directory_structure) && <DirectoryStructure tree={result.directory_structure} />}`
- [ ] Render in `<CodeBlock>` (monospace, max-height 400px scroll)
- [ ] Collapsed by default — "Show Directory Tree" expand toggle

### 4.12 — Selected Files Section
*Source: `result.selected_files[]`*

- [ ] `{hasData(result.selected_files) && <SelectedFiles files={result.selected_files} />}`
- [ ] Collapsed by default — "Show Analyzed Files ({N})" expand
- [ ] Simple `<code>` path list

---

## Phase 5: Architecture Graph Visualization

Rendered as a separate `<SectionCard>` between Results and Chat — only after deep analysis completes.

### 5.1 — Graph Data
- [ ] Call `GET /api/analyzer/graph?repo_url={repoUrl}` after job completes
- [ ] Transform backend `nodes[]` + `edges[]` → React Flow format
- [ ] Run `elkjs` layout (hierarchical, top-down) in a `useEffect`

### 5.2 — Graph Canvas
- [ ] `ArchitectureGraph` using `@xyflow/react` (wrapped in `dynamic(() => import(...), { ssr: false })`)
- [ ] Custom node types:
  - `folderNode`: folder icon, collapsible subtree
  - `fileNode`: file icon; orange tint if `deep_analysis === true`, gray if false
- [ ] Custom edge types:
  - `contains`: dashed gray line
  - `imports`: solid blue arrow
- [ ] Controls: zoom in/out, fit-to-view, minimap toggle
- [ ] Fixed canvas height: `500px`, full width

### 5.3 — Graph Interactivity
- [ ] Click node → right-side drawer shows: path, type, deep_analysis status, GitHub link
- [ ] Filter bar above graph: "Show folders", "Deep-analyzed only", edge type filter
- [ ] Node search input → highlight matching nodes

---

## Phase 6: Chat-with-Repo

Unlocked only after deep analysis completes. Panel appears below graph section.

### 6.1 — Chat Unlock Gate
- [ ] Before deep analysis: show locked `ChatPanel` with message:
  ```
  🔒 Chat is locked
  Run Deep Analysis to enable AI-powered chat about this repository.
  [ Run Deep Analysis → ]
  ```

### 6.2 — Session Initialization
- [ ] Generate and persist `client_id` = `crypto.randomUUID()` in localStorage (once per browser)
- [ ] On chat unlock: auto-call `POST /api/chat/session` with `{ repo_id, title: "Chat", client_id }`
- [ ] Store `session_id` in Zustand `appStore`

### 6.3 — Chat Interface
- [ ] `ChatPanel` layout: fixed-height message list (scrollable) + sticky input at bottom
- [ ] **Suggested starter questions** (shown when no messages yet):
  - Dynamically selected based on `detected_patterns` and `project_types`:
    - REST API project: "How does the API routing work?", "What's the request-response flow?"
    - PWA project: "How are push notifications implemented?", "What's the offline strategy?"
    - Database-heavy: "What's the database schema?", "How are models structured?"
  - Generic fallbacks: "What does this project do?", "What's the main entry point?", "How is authentication handled?"

### 6.4 — Message Rendering
- [ ] User message: right-aligned bubble, user icon
- [ ] Assistant message: left-aligned, no bubble, markdown rendered
- [ ] Each assistant message shows metadata row below:
  - `sufficient === true`: 🟢 "Full context" | `sufficient === false`: 🟡 "Partial context"
  - "📄 {retrieved_chunks_count} chunks referenced"
  - `fallback_triggered === true`: "🔍 Extended search triggered" badge

### 6.5 — Chat Sending & States
- [ ] On send: call `POST /api/chat/message`
- [ ] While awaiting response:
  - Show **"Thinking..."** animated indicator (3-dot pulse) in assistant message position
  - Input disabled, send button shows spinner
- [ ] If response takes >3s: show **"Searching additional files..."** progress bar below "Thinking..." (covers fallback latency — `fallback_triggered` likely true)
- [ ] On response: replace thinking indicator with actual answer (smooth fade-in)

### 6.6 — Chat UX Polish
- [ ] Send on `Enter`, newline on `Shift+Enter`
- [ ] Copy button on each assistant message
- [ ] Code block copy button inside markdown responses
- [ ] Auto-scroll to latest message on new message
- [ ] Session persists across page refresh (reload history from `GET /api/chat/session/:id`)

---

## Phase 7: Polish, Responsiveness & Dark Mode

### 7.1 — Responsive Design
- [ ] Mobile (< 768px): full-width cards, stacked layout, no graph (show "Open on desktop for graph view")
- [ ] Tablet (768px–1024px): all sections visible, graph scales to full width
- [ ] Stats grid: 2 columns on mobile, 3-4 on desktop
- [ ] Tech stack cards: horizontal scroll on mobile

### 7.2 — Dark Mode
- [ ] All Oxygen UI components: auto-follow theme mode toggle
- [ ] Tailwind `dark:` variants for layout backgrounds
- [ ] Graph: dark canvas bg, light node labels
- [ ] Code blocks: dark theme (Shiki `github-dark`)

### 7.3 — Animations & Micro-interactions
- [ ] Quick Summary Card: slide-down appear on load
- [ ] Section cards: staggered fade-in as analysis results render
- [ ] Progress stepper: pulse animation on active step
- [ ] Collapsible sections: smooth height transition (CSS `grid-template-rows` trick)
- [ ] Chat messages: slide-up + fade-in
- [ ] Skeleton loaders for all async sections

### 7.4 — Accessibility
- [ ] All interactive elements keyboard-navigable
- [ ] Progress stepper: `aria-label` on each step
- [ ] Graph: `aria-label` on nodes, keyboard pan/zoom
- [ ] WCAG 2.1 AA color contrast on all text

---

## Phase 8: Testing & Deployment Prep

### 8.1 — Manual Integration Tests
- [ ] Full flow: input → quick summary → deep analysis → results → graph → chat
- [ ] Test empty field handling: repo with no topics, null language, empty flagged_issues, etc.
- [ ] Test error states: invalid URL, large repo rejection, analysis failure, chat failure
- [ ] Test cache hit path (same repo analyzed twice → immediate results)
- [ ] Test fallback_triggered chat path (verify progress bar appears)

### 8.2 — Performance
- [ ] `dynamic(() => import(...))` for graph visualization (no SSR)
- [ ] `dynamic(() => import(...))` for Shiki highlighter
- [ ] Lighthouse target: 90+ Performance, 95+ Accessibility

### 8.3 — Deployment Config
- [ ] `next.config.ts` API rewrite: `/api/:path* → http://localhost:5000/api/:path*` (dev)
- [ ] Env vars: `NEXT_PUBLIC_API_URL` for production backend URL
- [ ] Vercel deployment config

---

## Rendering Philosophy: Schema-Driven, Not Example-Driven

> [!IMPORTANT]
> The API response examples in this document are **illustrative only**. The actual response may have more fields, fewer fields, or new fields added in future backend versions. The frontend must **never hardcode a list of specific fields to check**. Instead:

**The one rule**: `{hasData(field) && <SectionOrValue />}`

| Scenario | Behaviour |
|---|---|
| Field present and non-empty | Section/value renders |
| Field present but empty (`null`, `[]`, `{}`, `""`, `"None"`, `0`) | Section/value is not mounted |
| Field not present at all in response | Section/value is not mounted (TypeScript optional chaining handles this) |
| Backend adds a **new field** the frontend knows how to render | Automatically appears once `hasData()` is true |
| Backend adds a **completely new unknown field** | Ignored until a renderer is added (no crash, no empty card) |

### Rendering Patterns by Field Type

| Field type | Render pattern | Skip when |
|---|---|---|
| `string` (prose/markdown) | `<Markdown>` | `isEmpty()` |
| `string` (short label) | `<Chip>` badge | `isEmpty()` |
| `string` (date `*_at`) | Formatted date | null |
| `string` (URL/link) | External link chip | `isEmpty()` |
| `string` (sentinel `"None"`) | Same as null — skip | Always |
| `number` (count) | Stat chip | `=== 0` |
| `number` (size) | Formatted (KB→MB) | Never (always show size) |
| `boolean` (flag) | Icon badge | `=== false` |
| `string[]` (tags) | `<TagChip>` list | `length === 0` |
| `string[]` (file list) | `<code>` list | `length === 0` |
| `object[]` (items) | Card list | `length === 0` |
| `{ [key]: number }` | Stacked bar / table | all values 0 or `{}` |
| `{ [key]: string }` | Key-value table | `{}` |
| `{ [key]: string[] }` | Grouped list | all arrays empty |

### The `isEmpty` / `hasData` Utilities

```ts
// lib/isEmpty.ts — apply this before rendering ANY dynamic field
export const isEmpty = (v: unknown): boolean => {
  if (v == null) return true;
  if (typeof v === 'string') return v.trim() === '' || v === 'None' || v === 'null';
  if (typeof v === 'number') return v === 0;
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === 'object') return Object.keys(v as object).length === 0;
  return false;
};

export const hasData = (v: unknown): boolean => !isEmpty(v);
```

### Chat Response Fields

| Field | UI treatment | Always shown? |
|---|---|---|
| `answer` | `<Markdown>` in assistant bubble | Yes |
| `sufficient` | 🟢 Full context / 🟡 Partial context indicator | Yes |
| `retrieved_chunks_count` | "📄 N chunks referenced" | Yes |
| `fallback_triggered` | "🔍 Extended search triggered" badge | Only if `true` |

---

## Out of Scope (Phase 1)

- Authentication / user accounts
- PR creation, issue management (Phase 2)
- Multi-repo comparison
- Export / share analysis reports
- WebSocket real-time updates (polling sufficient for Phase 1)
