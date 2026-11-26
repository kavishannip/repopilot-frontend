# RepoPilot Frontend

RepoPilot is an AI-powered application for exploring public GitHub repositories. This repository contains the web client; the companion [RepoPilot Backend](https://github.com/kavishannip/repopilot-backend) fetches repository data, runs analysis, stores searchable code context, and generates summaries and chat answers.

## What it does

From the web app, users can:

- Submit a public GitHub repository URL and get a quick overview based on repository metadata and key files.
- Start a deeper, asynchronous analysis and view its progress and structured results, including the architecture, components, technologies, entry points, and potential issues.
- View an AI-generated Mermaid architecture diagram.
- Ask questions about a repository in a persistent, repository-specific chat session.
- Check whether a repository has changed and request a sync.

## How the application works

1. The user enters a GitHub URL on the Analyze page. The client validates the URL and sends it to the backend quick-summary API.
2. The backend returns a summary and repository ID. The client uses that ID to request deep analysis, if selected.
3. Deep analysis runs in a backend background task. The frontend polls the job-status endpoint and displays progress and the completed report.
4. The frontend can request an architecture diagram or open a repository chat. For chat, it sends the session and question to the backend; the backend retrieves relevant indexed code and generates an answer grounded in repository context.
5. The client also exposes repository history and update/sync actions backed by the API.

The UI is built with Next.js App Router, React, and TypeScript. TanStack Query handles API requests and polling, Zustand holds client-side app state, and Asgardeo provides authentication. API calls are centralized in `src/lib/api.ts` and use the configured API base URL.

## Requirements

- Node.js and npm (or pnpm)
- A running RepoPilot Backend. See its README for backend, PostgreSQL/pgvector, and AI-provider configuration.
- Asgardeo application configuration for authenticated use

## Getting started

Install dependencies and run the local development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

By default, the client calls the backend at `http://localhost:5000`. To use another backend URL, set the public environment variable before starting the app:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

For local development, create a `.env.local` file in the project root and set `NEXT_PUBLIC_API_URL` there. Configure the backend's Asgardeo settings to match your authentication application.

## Useful commands

```bash
npm run dev    # Start the development server
npm run lint   # Run ESLint
npm run build  # Build the production app
npm run start  # Serve the production build
```

## Project structure

- `src/app/` — Analyze, chat, and repository routes
- `src/components/` — UI components for repository input, analysis results, diagrams, and chat
- `src/hooks/` — Query and mutation hooks for backend operations
- `src/lib/api.ts` — Typed API client for the backend
- `src/stores/` — Client-side application state

## Related repository

- [RepoPilot Backend](https://github.com/kavishannip/repopilot-backend) — FastAPI analysis, indexing, persistence, and chat services
